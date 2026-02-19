"use client";

import { useRef, useState, useTransition } from "react";
import { uploadMedia } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, Video, X } from "lucide-react";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm";

export default function UploadForm() {
    const [isPending, startTransition] = useTransition();
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState<{ url: string; type: "image" | "video"; name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    function handleFile(file: File) {
        const type = file.type.startsWith("video/") ? "video" : "image";
        setPreview({ url: URL.createObjectURL(file), type, name: file.name });
        setError(null);
        setSuccess(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const dt = new DataTransfer();
            dt.items.add(file);
            if (fileRef.current) fileRef.current.files = dt.files;
            handleFile(file);
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        const fd = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await uploadMedia(fd);
            if (result.success) {
                setSuccess(true);
                setPreview(null);
                formRef.current?.reset();
            } else {
                setError(result.error);
            }
        });
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit}
            className="rounded-xl border p-6 space-y-5"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>

            <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Upload Media
            </h2>

            {/* Drop zone */}
            <div
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className="rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center
                   justify-center gap-3 p-8 transition-colors"
                style={{
                    borderColor: dragOver ? "var(--color-primary)" : "var(--color-border)",
                    background: dragOver ? "rgba(5,150,105,0.05)" : "transparent",
                }}
            >
                {preview ? (
                    <div className="relative w-full max-h-48 flex items-center justify-center">
                        {preview.type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={preview.url} alt="preview" className="max-h-48 rounded-lg object-contain" />
                        ) : (
                            <video src={preview.url} className="max-h-48 rounded-lg" controls />
                        )}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black/80"
                        >
                            <X size={14} className="text-white" />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload size={32} style={{ color: "var(--color-text-secondary)" }} />
                        <div className="text-center">
                            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                                Drop a file here, or click to browse
                            </p>
                            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                                Images (JPEG, PNG, WebP) or Videos (MP4, WebM) · Max 200MB
                            </p>
                        </div>
                    </>
                )}

                <input
                    ref={fileRef}
                    id="file"
                    name="file"
                    type="file"
                    accept={ACCEPT}
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
                <Label htmlFor="title" style={{ color: "var(--color-text-secondary)" }}>
                    Title
                </Label>
                <Input
                    id="title" name="title" required
                    placeholder="e.g. Ramadan Announcement"
                    className="bg-transparent border-[var(--color-border)] text-[var(--color-text-primary)]
                     focus-visible:ring-[var(--color-primary)] placeholder:text-[var(--color-text-secondary)]"
                />
            </div>

            {/* Duration (video only) */}
            {preview?.type === "video" && (
                <div className="space-y-1.5">
                    <Label htmlFor="duration" style={{ color: "var(--color-text-secondary)" }}>
                        Display Duration (seconds)
                    </Label>
                    <Input
                        id="duration" name="duration" type="number" min={5} max={3600}
                        defaultValue={30}
                        className="bg-transparent border-[var(--color-border)] text-[var(--color-text-primary)]
                       focus-visible:ring-[var(--color-primary)] w-32"
                    />
                </div>
            )}

            {error && (
                <p className="text-sm rounded-lg px-3 py-2"
                    style={{ color: "var(--color-danger)", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}>
                    {error}
                </p>
            )}
            {success && (
                <p className="text-sm rounded-lg px-3 py-2"
                    style={{ color: "var(--color-success)", background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.3)" }}>
                    ✓ Media uploaded successfully.
                </p>
            )}

            <Button type="submit" disabled={isPending || !preview}
                style={{ background: "var(--color-primary)" }}
                className="w-full text-white font-semibold">
                {isPending ? "Uploading…" : "Upload"}
            </Button>
        </form>
    );
}
