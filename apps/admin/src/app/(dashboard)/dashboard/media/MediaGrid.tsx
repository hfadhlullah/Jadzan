"use client";

import { useTransition } from "react";
import { deleteMedia, setMediaTarget } from "./actions";
import { Trash2, Monitor, Video, Image as ImageIcon } from "lucide-react";
import type { Tables } from "@/types/supabase";

type MediaItem = Tables<"media_content">;
type ScreenWithTargets = {
    id: string;
    name: string | null;
    status: string;
    targetedMediaIds: string[];
};

// ─── Media Card ───────────────────────────────────────────────
function MediaCard({
    item,
    screens,
}: {
    item: MediaItem;
    screens: ScreenWithTargets[];
}) {
    const [isPending, startTransition] = useTransition();
    const isVideo = item.type === "VIDEO";

    function handleDelete() {
        if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
        startTransition(() => { void deleteMedia(item.id); });
    }

    function handleTarget(screenId: string, currentlyEnabled: boolean) {
        startTransition(() => { void setMediaTarget(item.id, screenId, !currentlyEnabled); });
    }

    return (
        <div className="rounded-xl border overflow-hidden flex flex-col group"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>

            {/* Thumbnail */}
            <div className="relative h-40 bg-black flex items-center justify-center overflow-hidden">
                {isVideo ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                )}

                {/* Type badge */}
                <span className="absolute top-2 left-2 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: isVideo ? "rgba(15,23,42,0.85)" : "rgba(15,23,42,0.85)", color: "var(--color-text-primary)" }}>
                    {isVideo ? <Video size={10} /> : <ImageIcon size={10} />}
                    {isVideo ? "Video" : "Image"}
                </span>

                {/* Delete button */}
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100
                     transition-opacity cursor-pointer"
                    style={{ background: "rgba(220,38,38,0.85)" }}
                >
                    <Trash2 size={12} className="text-white" />
                </button>
            </div>

            {/* Info */}
            <div className="p-3 flex-1 flex flex-col gap-2">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                    {item.title}
                </p>
                {isVideo && item.duration && (
                    <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {item.duration}s
                    </p>
                )}

                {/* Screen targeting */}
                {screens.length > 0 && (
                    <div className="border-t pt-2 mt-auto" style={{ borderColor: "var(--color-border)" }}>
                        <p className="text-xs mb-1.5 flex items-center gap-1" style={{ color: "var(--color-text-secondary)" }}>
                            <Monitor size={10} /> Target screens
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {screens.map((screen) => {
                                const active = screen.targetedMediaIds.includes(item.id);
                                return (
                                    <button
                                        key={screen.id}
                                        onClick={() => handleTarget(screen.id, active)}
                                        disabled={isPending}
                                        className="text-xs px-2 py-0.5 rounded-full border transition-colors cursor-pointer"
                                        style={{
                                            background: active ? "rgba(5,150,105,0.2)" : "transparent",
                                            borderColor: active ? "var(--color-success)" : "var(--color-border)",
                                            color: active ? "var(--color-success)" : "var(--color-text-secondary)",
                                        }}
                                    >
                                        {screen.name ?? "Screen"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Media Grid ───────────────────────────────────────────────
export default function MediaGrid({
    items,
    screens,
}: {
    items: MediaItem[];
    screens: ScreenWithTargets[];
}) {
    if (items.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-12 flex flex-col items-center gap-3 text-center"
                style={{ borderColor: "var(--color-border)" }}>
                <ImageIcon size={40} style={{ color: "var(--color-text-secondary)" }} />
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    No media yet. Upload an image or video to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
                <MediaCard key={item.id} item={item} screens={screens} />
            ))}
        </div>
    );
}
