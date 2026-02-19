"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    Monitor,
    ImagePlay,
    Megaphone,
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/mosques", label: "Mosque", icon: Building2 },
    { href: "/dashboard/screens", label: "Screens", icon: Monitor },
    { href: "/dashboard/media", label: "Content", icon: ImagePlay },
    { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            className="flex flex-col w-56 shrink-0 border-r h-screen"
            style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
            }}
        >
            {/* Brand */}
            <div className="flex items-center gap-2 px-5 py-5 border-b"
                style={{ borderColor: "var(--color-border)" }}>
                <span className="text-2xl">🕌</span>
                <span className="font-bold text-lg tracking-tight"
                    style={{ color: "var(--color-text-primary)" }}>
                    Jadzan
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive =
                        href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                         transition-colors group"
                            style={{
                                background: isActive ? "rgba(5,150,105,0.15)" : "transparent",
                                color: isActive
                                    ? "var(--color-primary)"
                                    : "var(--color-text-secondary)",
                                borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
                            }}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom version label */}
            <div className="px-5 py-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    Jadzan v1.0.0 · MVP
                </p>
            </div>
        </aside>
    );
}
