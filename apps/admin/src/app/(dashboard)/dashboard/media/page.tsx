import { getMediaItems, getScreensWithTargets } from "./actions";
import UploadForm from "./UploadForm";
import MediaGrid from "./MediaGrid";

export const metadata = {
    title: "Content Manager — Jadzan Admin",
};

export default async function MediaPage() {
    const [items, screens] = await Promise.all([
        getMediaItems(),
        getScreensWithTargets(),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Content Manager
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    Upload images and videos, then assign them to specific screens.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Upload form — 1/3 */}
                <div className="lg:col-span-1">
                    <UploadForm />
                </div>

                {/* Media grid — 2/3 */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                        LIBRARY ({items.length} items)
                    </h2>
                    <MediaGrid items={items} screens={screens} />
                </div>
            </div>
        </div>
    );
}
