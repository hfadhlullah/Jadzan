"use client";

import { useState, useTransition } from "react";
import { createAnnouncement } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function AddAnnouncementForm() {
    const [isPending, startTransition] = useTransition();
    const [text, setText] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim()) return;

        startTransition(async () => {
            try {
                await createAnnouncement(text.trim());
                setText("");
            } catch (err) {
                alert(err instanceof Error ? err.message : "Failed to create announcement");
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1">
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a new announcement..."
                    disabled={isPending}
                    className="bg-transparent border-[var(--color-border)] text-[var(--color-text-primary)] focus-visible:ring-[var(--color-primary)]"
                />
            </div>
            <Button
                type="submit"
                disabled={isPending || !text.trim()}
                style={{ background: "var(--color-primary)" }}
                className="text-white font-semibold"
            >
                <Plus size={18} className="mr-2" />
                Add
            </Button>
        </form>
    );
}
