import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/session";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin-panel");
  return (
    <div className="mx-auto grid min-h-screen max-w-sm content-center gap-6 px-4">
      <p className="display text-3xl font-semibold text-oxford">OEN Admin</p>
      <LoginForm />
    </div>
  );
}
