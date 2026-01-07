export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  banner_url: string | null;
  video_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementStats {
  total: number;
  public_count: number;
  private_count: number;
}