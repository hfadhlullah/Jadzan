import { getScreens } from "./actions";
import PairScreenForm from "./PairScreenForm";
import { Monitor, Wifi, WifiOff, Clock } from "lucide-react";
import type { Tables } from "@/types/supabase";

type Screen = Tables<"screens">;

function StatusBadge({ status }: { status: Screen["status"] }) {
    const config = {
        ACTIVE: { label: "Active", color: "var(--color-success)", bg: "rgba(5,150,105,0.15)" },
        OFFLINE: { label: "Offline", color: "var(--color-danger)", bg: "rgba(220,38,38,0.15)" },
        PENDING: { label: "Pending", color: "var(--color-accent)", bg: "rgba(217,119,6,0.15)" },
    }[status];

    return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: config.color, background: config.bg }}>
            {config.label}
        </span>
    );
}

function ScreenCard({ screen }: { screen: Screen }) {
    const Icon = screen.status === "ACTIVE" ? Wifi : WifiOff;
    const lastSeen = screen.last_seen
        ? new Date(screen.last_seen).toLocaleString()
        : "Never";

    return (
        <div className="rounded-xl border p-4 flex items-start gap-4"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="p-2 rounded-lg" style={{ background: "var(--color-surface-hover, #273549)" }}>
                <Icon size={20} style={{ color: "var(--color-text-secondary)" }} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm truncate"
                        style={{ color: "var(--color-text-primary)" }}>
                        {screen.name ?? "Unnamed Screen"}
                    </span>
                    <StatusBadge status={screen.status} />
                </div>
                <div className="flex items-center gap-1 mt-1"
                    style={{ color: "var(--color-text-secondary)" }}>
                    <Clock size={12} />
                    <span className="text-xs">Last seen: {lastSeen}</span>
                </div>
            </div>

            <Monitor size={16} style={{ color: "var(--color-text-secondary)", flexShrink: 0 }} />
        </div>
    );
}

export default async function ScreensPage() {
    const screens = await getScreens();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Screens
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    Pair and manage your mosque&apos;s TV displays.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left: Pair form */}
                <PairScreenForm />

                {/* Right: Screen list */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                        PAIRED SCREENS ({screens.length})
                    </h2>

                    {screens.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-8 text-center"
                            style={{ borderColor: "var(--color-border)" }}>
                            <Monitor size={32} className="mx-auto mb-2"
                                style={{ color: "var(--color-text-secondary)" }} />
                            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                No screens paired yet. Turn on a TV and enter its code above.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {screens.map((screen) => (
                                <ScreenCard key={screen.id} screen={screen} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
