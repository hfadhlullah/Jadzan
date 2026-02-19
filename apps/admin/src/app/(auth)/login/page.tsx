"use client";

import { useState } from "react";
import { signIn } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setError(null);
        setLoading(true);
        const result = await signIn(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{ background: "var(--color-background)" }}>
            <div className="w-full max-w-sm space-y-8">
                {/* Logo / Brand */}
                <div className="text-center space-y-2">
                    <div className="text-4xl">🕌</div>
                    <h1 className="text-3xl font-bold tracking-tight"
                        style={{ color: "var(--color-text-primary)" }}>
                        Jadzan
                    </h1>
                    <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        Mosque Digital Signage Admin
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-xl border p-8 space-y-6"
                    style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                    }}>
                    <div>
                        <h2 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
                            Sign in
                        </h2>
                        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                            Enter your admin credentials to continue.
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" style={{ color: "var(--color-text-secondary)" }}>
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@mosque.com"
                                required
                                autoComplete="email"
                                className="bg-transparent border-[var(--color-border)] text-[var(--color-text-primary)]
                           focus-visible:ring-[var(--color-primary)] placeholder:text-[var(--color-text-secondary)]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" style={{ color: "var(--color-text-secondary)" }}>
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="bg-transparent border-[var(--color-border)] text-[var(--color-text-primary)]
                           focus-visible:ring-[var(--color-primary)] placeholder:text-[var(--color-text-secondary)]"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-[var(--color-danger)] bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white font-semibold"
                            style={{ background: "var(--color-primary)" }}
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    Jadzan v1.0 — Mosque Digital Signage
                </p>
            </div>
        </div>
    );
}
