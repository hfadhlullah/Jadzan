"use client";

import { useState, useTransition } from "react";
import { pairScreen } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PairScreenForm() {
    const [isPending, startTransition] = useTransition();
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        startTransition(async () => {
            const result = await pairScreen(code.replace(/\s/g, ""), name);
            if (result.success) {
                setSuccess(true);
                setCode("");
                setName("");
            } else {
                setError(result.error);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}
            className="rounded-xl border p-6 space-y-5 max-w-md"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>

            <div>
                <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    Pair a New Screen
                </h2>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    Turn on the TV — it will display a 6-digit code on screen.
                </p>
            </div>

            {/* Code input — large, digit-focused */}
            <div className="space-y-1.5">
                <Label htmlFor="pairing-code" style={{ color: "var(--color-text-secondary)" }}>
                    6-Digit Pairing Code
                </Label>
                <Input
                    id="pairing-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                    className="text-center text-2xl font-mono tracking-[0.4em] bg-transparent
                     border-[var(--color-border)] text-[var(--color-primary)]
                     focus-visible:ring-[var(--color-primary)]
                     placeholder:text-[var(--color-text-secondary)] placeholder:tracking-normal"
                />
            </div>

            {/* Screen name */}
            <div className="space-y-1.5">
                <Label htmlFor="screen-name" style={{ color: "var(--color-text-secondary)" }}>
                    Screen Name
                </Label>
                <Input
                    id="screen-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Main Hall, Women's Section"
                    required
                    className="bg-transparent border-[var(--color-border)] text-[var(--color-text-primary)]
                     focus-visible:ring-[var(--color-primary)]
                     placeholder:text-[var(--color-text-secondary)]"
                />
            </div>

            {error && (
                <p className="text-sm text-[var(--color-danger)] bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-sm text-[var(--color-success)] bg-emerald-950/30 border border-emerald-900/50 rounded-lg px-3 py-2">
                    ✓ Screen paired successfully!
                </p>
            )}

            <Button
                type="submit"
                disabled={isPending || code.length !== 6}
                style={{ background: "var(--color-primary)" }}
                className="w-full text-white font-semibold"
            >
                {isPending ? "Pairing…" : "Pair Screen"}
            </Button>
        </form>
    );
}
