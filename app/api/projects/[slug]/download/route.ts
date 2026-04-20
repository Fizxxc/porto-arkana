import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { getProjectBySlug } from '@/lib/data';
import { isImageAsset } from '@/lib/utils';

function getExtension(url: string) {
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.png')) return 'png';
  if (clean.endsWith('.webp')) return 'webp';
  return 'jpg';
}

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const targetUrl = project.asset_url || project.cover_url;

  if (!isImageAsset(targetUrl)) {
    return NextResponse.redirect(targetUrl, { status: 302 });
  }

  const response = await fetch(targetUrl);
  if (!response.ok) {
    return NextResponse.json({ error: 'Asset unavailable' }, { status: 400 });
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width ?? 1600;
  const height = metadata.height ?? 1200;
  const watermark = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .main { fill: rgba(255,255,255,0.28); font-size: ${Math.max(24, Math.round(width * 0.032))}px; font-family: Arial, Helvetica, sans-serif; letter-spacing: 3px; }
        .sub { fill: rgba(255,255,255,0.16); font-size: ${Math.max(12, Math.round(width * 0.012))}px; font-family: Arial, Helvetica, sans-serif; letter-spacing: 2px; }
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="main">ARKANA KAFI</text>
      <text x="50%" y="${Math.min(height - 44, height * 0.92)}" text-anchor="middle" class="sub">Generated download preview · author credit embedded by system</text>
    </svg>
  `);

  const ext = getExtension(targetUrl);

  let transformed = image
    .composite([{ input: watermark, gravity: 'center' }])
    .withMetadata();

  try {
    // Available on recent sharp versions. Best effort only.
    transformed = transformed.withExifMerge({
      IFD0: {
        Artist: 'Arkana Kafi',
        Copyright: 'Arkana Kafi'
      }
    } as any);
  } catch {}

  const output =
    ext === 'png'
      ? await transformed.png({ compressionLevel: 8 }).toBuffer()
      : ext === 'webp'
        ? await transformed.webp({ quality: 92 }).toBuffer()
        : await transformed.jpeg({ quality: 92 }).toBuffer();

const body = new Uint8Array(output);

return new NextResponse(body, {
  headers: {
    'Content-Type': ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg',
    'Content-Disposition': `attachment; filename="${project.slug}-arkana-kafi.${ext}"`,
    'Cache-Control': 'no-store'
  }
});
}
