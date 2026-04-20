export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          headline: string;
          school_info: string;
          bio: string;
          phone: string;
          email: string;
          address: string;
          social_links: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          headline: string;
          school_info: string;
          bio: string;
          phone: string;
          email: string;
          address: string;
          social_links?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string;
          headline?: string;
          school_info?: string;
          bio?: string;
          phone?: string;
          email?: string;
          address?: string;
          social_links?: Json;
        };
      };
      site_content: {
        Row: {
          id: string;
          created_at: string;
          hero_badge: string;
          hero_title: string;
          hero_subtitle: string;
          about_title: string;
          about_body: string;
          focus_title: string;
          focus_items: Json;
          portfolio_drive_url: string;
          contact_title: string;
          contact_body: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          hero_badge: string;
          hero_title: string;
          hero_subtitle: string;
          about_title: string;
          about_body: string;
          focus_title: string;
          focus_items?: Json;
          portfolio_drive_url?: string;
          contact_title: string;
          contact_body: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          hero_badge?: string;
          hero_title?: string;
          hero_subtitle?: string;
          about_title?: string;
          about_body?: string;
          focus_title?: string;
          focus_items?: Json;
          portfolio_drive_url?: string;
          contact_title?: string;
          contact_body?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          slug: string;
          summary: string;
          description: string;
          category: string;
          year: string;
          client_name: string;
          cover_url: string;
          asset_url: string;
          featured: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          slug: string;
          summary: string;
          description: string;
          category: string;
          year?: string;
          client_name?: string;
          cover_url: string;
          asset_url: string;
          featured?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          slug?: string;
          summary?: string;
          description?: string;
          category?: string;
          year?: string;
          client_name?: string;
          cover_url?: string;
          asset_url?: string;
          featured?: boolean;
        };
      };
    };
  };
}
