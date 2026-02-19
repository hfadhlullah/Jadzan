"use client";

import { useTransition } from "react";
import { updateAnnouncement, deleteAnnouncement } from "./actions";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Megaphone } from "lucide-react";
import type { Tables } from "@/types/supabase";

export default function AnnouncementList({ announcements }: { announcements: Tables<"announcements">[] }) {
    const [isPending, startTransition] = useTransition();

    function handleToggle(id: string, current: boolean) {
        startTransition(async () => {
            try {
                await updateAnnouncement(id, { is_active: !current });
            } catch (err) {
                alert(err instanceof Error ? err.message : "Failed to update");
            }
        });
    }

    function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        startTransition(async () => {
            try {
                await deleteAnnouncement(id);
            } catch (err) {
                alert(err instanceof Error ? err.message : "Failed to delete");
            }
        });
    }

    if (announcements.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-12 flex flex-col items-center gap-3 text-center"
                style={{ borderColor: "var(--color-border)" }}>
                <Megaphone size={40} style={{ color: "var(--color-text-secondary)" }} />
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    No announcements yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {announcements.map((ann) => (
                <div
                    key={ann.id}
                    className="rounded-xl border p-4 flex items-center justify-between gap-4"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                >
                    <div className="flex-1 min-w-0">
                        <p className="text-sm" style={{ color: ann.is_active ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                            {ann.text}
                        </p>
                        <p className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                            Created {new Date(ann.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                                {ann.is_active ? "Active" : "Hidden"}
                            </span>
                            <Switch
                                checked={ann.is_active}
                                onCheckedChange={() => handleToggle(ann.id, ann.is_active)}
                                disabled={isPending}
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ann.id)}
                            disabled={isPending}
                            className="hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
