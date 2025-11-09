import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { Home as HomeIcon } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center p-4 px-6">
          <Link href={"/"} className="flex items-center gap-2 font-bold text-xl flex-1">
            <HomeIcon className="h-6 w-6 text-primary" />
            Hearth Hub
          </Link>
          <div className="flex items-center gap-4 justify-center flex-1">
            <Link href="/renters" className="font-bold text-muted-foreground hover:text-foreground">For Renters</Link>
            <Link href="/owners" className="font-bold text-muted-foreground hover:text-foreground">For Owners</Link>
          </div>
          <div className="flex items-center gap-4 justify-end flex-1">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </div>
        </nav>

      {/* Login Form */}
      <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
