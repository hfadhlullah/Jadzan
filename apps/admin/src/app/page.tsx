import { redirect } from "next/navigation";

// Root route → always redirect to /dashboard (middleware handles auth)
export default function RootPage() {
  redirect("/dashboard");
}
