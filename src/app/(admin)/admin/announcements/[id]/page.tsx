import AdminAnnouncementsDetailScreen from "./AdminAnnouncementsDetailScreen";

export const metadata = {
  title: "Detail Pengumuman",
  description: "Edit detail pengumuman.",
};

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  return <AdminAnnouncementsDetailScreen id={params.id} />;
}