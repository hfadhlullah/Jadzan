import { createClient } from "@/lib/supabase/server";
import { Monitor, Image as ImageIcon, Megaphone, Clock } from "lucide-react";

async function getStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: mosque } = await supabase
        .from("mosques")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!mosque) return null;

    const [screens, media, announcements] = await Promise.all([
        supabase.from("screens").select("id", { count: "exact", head: true }).eq("mosque_id", mosque.id),
        supabase.from("media_content").select("id", { count: "exact", head: true }).eq("mosque_id", mosque.id),
        supabase.from("announcements").select("id", { count: "exact", head: true }).eq("mosque_id", mosque.id),
    ]);

    return {
        screens: screens.count ?? 0,
        media: media.count ?? 0,
        announcements: announcements.count ?? 0,
    };
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
    return (
        <div className="rounded-xl border p-6 space-y-2" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
                <Icon size={20} style={{ color }} />
                <span className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{value}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{title}</p>
        </div>
    );
}

export default async function DashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Dashboard Overview
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    Welcome to Jadzan Admin. Here is what&apos;s happening with your displays.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Paired Screens" value={stats?.screens ?? 0} icon={Monitor} color="var(--color-primary)" />
                <StatCard title="Media Library" value={stats?.media ?? 0} icon={ImageIcon} color="var(--color-accent)" />
                <StatCard title="Ticker Messages" value={stats?.announcements ?? 0} icon={Megaphone} color="var(--color-success)" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-xl border p-6 space-y-4" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                    <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                        Getting Started
                    </h2>
                    <div className="space-y-4">
                        {[
                            { title: "Configure Mosque", desc: "Set your location and prayer calculation methods.", link: "/dashboard/mosques" },
                            { title: "Pair your TV", desc: "Connect a TV device using the 6-digit pairing code.", link: "/dashboard/screens" },
                            { title: "Upload Media", desc: "Add images or videos to display during idle time.", link: "/dashboard/media" },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{item.title}</p>
                                    <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border p-6 flex flex-col items-center justify-center text-center space-y-3" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                    <Clock size={48} style={{ color: "var(--color-text-secondary)", opacity: 0.2 }} />
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                        Live preview of TV display coming soon.
                    </p>
                </div>
            </div>
        </div>
    );
}
