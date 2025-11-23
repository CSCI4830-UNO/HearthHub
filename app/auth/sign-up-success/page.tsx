import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import { Home as HomeIcon} from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-6">
      <nav className="w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center p-4 px-6">
          <Link href={"/"} className="flex items-center gap-2 font-bold text-xl flex-1">
            <HomeIcon className="h-6 w-6 text-primary" />
            Hearth Hub
          </Link>
          <div className="flex items-center gap-4 justify-center flex-1">
            <Link href="/renters/dashboard" className="font-bold text-muted-foreground hover:text-foreground">For Renters</Link>
            <Link href="/owners/dashboard" className="font-bold text-muted-foreground hover:text-foreground">For Owners</Link>
          </div>
        </div>
      </nav>
      
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
