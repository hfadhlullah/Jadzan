import { getAnnouncements } from "./actions";
import AddAnnouncementForm from "./AddAnnouncementForm";
import AnnouncementList from "./AnnouncementList";

export const metadata = {
    title: "Announcements — Jadzan Admin",
};

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Announcements
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    Manage messages that scroll at the bottom of the TV screen.
                </p>
            </div>

            <div className="max-w-4xl space-y-6">
                <AddAnnouncementForm />

                <div className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                        Current Ticker Messages ({announcements.length})
                    </h2>
                    <AnnouncementList announcements={announcements} />
                </div>
            </div>
        </div>
    );
}
