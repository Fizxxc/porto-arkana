import { AdminAuthGate } from '@/components/admin/admin-auth-gate';
import { AiStudioCard } from '@/components/admin/ai-studio-card';
import { ContentForm } from '@/components/admin/content-form';
import { ProfileForm } from '@/components/admin/profile-form';
import { ProjectForm } from '@/components/admin/project-form';
import { getAdminSession } from '@/lib/admin';
import { getProfile, getSiteContent } from '@/lib/data';

export default async function AdminPage() {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    return (
      <main className="min-h-screen px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-3">
            <p className="section-label">Hidden Admin Route</p>
            <h1 className="text-5xl tracking-[-0.08em]">The Vault Access</h1>
          </div>
          <AdminAuthGate />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-xl space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <p className="section-label">Access Denied</p>
          <h1 className="text-4xl tracking-[-0.06em]">Akun ini login, tapi bukan admin.</h1>
          <p className="text-sm leading-7 text-white/[0.55]">
            Tambahkan <code>auth.uid()</code> akun ini ke tabel <code>admin_users</code> agar dashboard bisa dibuka.
          </p>
        </div>
      </main>
    );
  }

  const [profile, content] = await Promise.all([getProfile(), getSiteContent()]);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-16 md:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-20 h-48 w-48 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute bottom-24 right-[10%] h-56 w-56 rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-3">
          <p className="section-label">Admin Dashboard</p>
          <h1 className="text-5xl tracking-[-0.08em]">Manual Portfolio Control</h1>
          <p className="max-w-3xl text-sm leading-7 text-white/[0.55]">
            Semua isi portfolio dapat diatur manual dari admin: hero, about, fokus karya, identitas personal, contact, cover project, asset download, sampai assist AI untuk copy yang lebih rapi.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProjectForm />
          <ProfileForm profile={profile} />
          <ContentForm content={content} />
        </div>

        <AiStudioCard profile={profile} content={content} />
      </div>
    </main>
  );
}
