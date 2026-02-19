import { getMosque } from "./actions";
import MosqueForm from "./MosqueForm";

export const metadata = {
    title: "Mosque Settings — Jadzan Admin",
};

export default async function MosquesPage() {
    const mosque = await getMosque();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                    Mosque Settings
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    Configure your mosque's location, prayer calculation method, and Iqomah delays.
                </p>
            </div>

            <MosqueForm mosque={mosque} />
        </div>
    );
}
