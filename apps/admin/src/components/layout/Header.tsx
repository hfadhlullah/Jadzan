import { signOut } from "@/app/(auth)/login/actions";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    userEmail: string;
}

export default function Header({ userEmail }: HeaderProps) {
    return (
        <header
            className="flex items-center justify-between px-6 py-3 border-b shrink-0"
            style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
            }}
        >
            {/* Left: page context hint */}
            <div />

            {/* Right: user + signout */}
            <div className="flex items-center gap-4">
                <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {userEmail}
                </span>

                <form action={signOut}>
                    <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-sm hover:text-red-400 cursor-pointer"
                        style={{ color: "var(--color-text-secondary)" }}
                    >
                        <LogOut size={15} />
                        Sign out
                    </Button>
                </form>
            </div>
        </header>
    );
}
