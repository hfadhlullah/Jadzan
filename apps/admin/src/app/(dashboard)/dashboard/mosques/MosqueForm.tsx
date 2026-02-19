"use client";

import { useState, useTransition } from "react";
import { upsertMosque, type UpsertMosqueInput, type IqomahDelays } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/types/supabase";

type Mosque = Tables<"mosques">;

const PRAYER_NAMES: (keyof IqomahDelays)[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
const CALCULATION_METHODS = [
    { value: "KEMENAG", label: "Kemenag (Indonesia)" },
    { value: "MWL", label: "Muslim World League" },
    { value: "ISNA", label: "ISNA (North America)" },
    { value: "EGYPT", label: "Egyptian Authority" },
] as const;

interface MosqueFormProps {
    mosque: Mosque | null;
}

export default function MosqueForm({ mosque }: MosqueFormProps) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const defaultDelays = (mosque?.iqomah_delays as IqomahDelays | null) ?? {
        fajr: 20, dhuhr: 10, asr: 10, maghrib: 10, isha: 10,
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const form = e.currentTarget;
        const data = new FormData(form);

        const input: UpsertMosqueInput = {
            name: data.get("name") as string,
            address: data.get("address") as string,
            latitude: parseFloat(data.get("latitude") as string),
            longitude: parseFloat(data.get("longitude") as string),
            timezone: data.get("timezone") as string,
            calculation_method: data.get("calculation_method") as UpsertMosqueInput["calculation_method"],
            background_url: data.get("background_url") as string,
            arabesque_opacity: parseFloat(data.get("arabesque_opacity") as string),
            iqomah_delays: {
                fajr: parseInt(data.get("iqomah_fajr") as string, 10),
                dhuhr: parseInt(data.get("iqomah_dhuhr") as string, 10),
                asr: parseInt(data.get("iqomah_asr") as string, 10),
                maghrib: parseInt(data.get("iqomah_maghrib") as string, 10),
                isha: parseInt(data.get("iqomah_isha") as string, 10),
            },
        };

        startTransition(async () => {
            const result = await upsertMosque(input);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">

            {/* ── Basic Info ─────────────────────────────────── */}
            <section className="rounded-xl border p-6 space-y-5"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    Mosque Info
                </h2>

                <Field label="Mosque Name" htmlFor="name">
                    <Input id="name" name="name" required placeholder="Masjid Al-Falah"
                        defaultValue={mosque?.name ?? ""} className={inputClass} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Latitude" htmlFor="latitude">
                        <Input id="latitude" name="latitude" type="number" step="any" required
                            placeholder="-6.2088" defaultValue={mosque?.latitude ?? ""}
                            className={inputClass} />
                    </Field>
                    <Field label="Longitude" htmlFor="longitude">
                        <Input id="longitude" name="longitude" type="number" step="any" required
                            placeholder="106.8456" defaultValue={mosque?.longitude ?? ""}
                            className={inputClass} />
                    </Field>
                </div>

                <Field label="Timezone" htmlFor="timezone">
                    <Input id="timezone" name="timezone" required placeholder="Asia/Jakarta"
                        defaultValue={mosque?.timezone ?? "Asia/Jakarta"} className={inputClass} />
                </Field>

                <Field label="Calculation Method" htmlFor="calculation_method">
                    <select id="calculation_method" name="calculation_method"
                        defaultValue={mosque?.calculation_method ?? "KEMENAG"}
                        className={`${inputClass} bg-[var(--color-surface)] cursor-pointer`}>
                        {CALCULATION_METHODS.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Address" htmlFor="address">
                    <Input id="address" name="address" required
                        placeholder="Jl. Raya No. 1..." defaultValue={mosque?.address ?? ""}
                        className={inputClass} />
                </Field>
            </section>

            {/* ── Visual Settings ────────────────────────────── */}
            <section className="rounded-xl border p-6 space-y-5"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    Theme & Background
                </h2>

                <Field label="Background Image URL" htmlFor="background_url">
                    <Input id="background_url" name="background_url"
                        placeholder="https://images.unsplash.com/..." defaultValue={mosque?.background_url ?? ""}
                        className={inputClass} />
                </Field>

                <Field label="Arabesque Opacity (0.0 - 1.0)" htmlFor="arabesque_opacity">
                    <Input id="arabesque_opacity" name="arabesque_opacity" type="number" step="0.01" min="0" max="1"
                        defaultValue={mosque?.arabesque_opacity ?? 0.05}
                        className={inputClass} />
                </Field>
            </section>

            {/* ── Iqomah Delays ─────────────────────────────── */}
            <section className="rounded-xl border p-6 space-y-5"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div>
                    <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        Iqomah Delays
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                        Minutes between Adzan and Iqomah for each prayer.
                    </p>
                </div>

                <div className="grid grid-cols-5 gap-3">
                    {PRAYER_NAMES.map((prayer) => (
                        <Field key={prayer} label={capitalize(prayer)} htmlFor={`iqomah_${prayer}`}>
                            <Input
                                id={`iqomah_${prayer}`}
                                name={`iqomah_${prayer}`}
                                type="number"
                                min={0} max={60}
                                defaultValue={defaultDelays[prayer]}
                                className={`${inputClass} text-center`}
                            />
                        </Field>
                    ))}
                </div>
            </section>

            {/* ── Feedback + Submit ──────────────────────────── */}
            {error && (
                <p className="text-sm text-[var(--color-danger)] bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-3">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-sm text-[var(--color-success)] bg-emerald-950/30 border border-emerald-900/50 rounded-lg px-4 py-3">
                    ✓ Mosque settings saved successfully.
                </p>
            )}

            <Button type="submit" disabled={isPending}
                className="text-white font-semibold px-6"
                style={{ background: "var(--color-primary)" }}>
                {isPending ? "Saving…" : "Save Settings"}
            </Button>
        </form>
    );
}

// ── Helpers ───────────────────────────────────────────────────

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const inputClass =
    "bg-transparent border-[var(--color-border)] text-[var(--color-text-primary)] " +
    "focus-visible:ring-[var(--color-primary)] placeholder:text-[var(--color-text-secondary)] w-full";

function Field({
    label,
    htmlFor,
    children,
}: {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={htmlFor} className="text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}>
                {label}
            </Label>
            {children}
        </div>
    );
}
