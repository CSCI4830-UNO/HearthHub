import { Home as HomeIcon, Key, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Hero() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <div className="flex flex-col gap-12 items-center text-center">
      <div className="flex items-center gap-3 justify-center">
        <HomeIcon className="h-10 w-10 text-primary" />
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
          HeartHub
        </h1>
      </div>
      
      <div className="space-y-4 max-w-3xl">
        <p className="text-2xl lg:text-3xl font-semibold">
          Your Home, Your Community, Your Way
        </p>
        <p className="text-lg lg:text-xl text-muted-foreground">
          The modern platform connecting renters with property owners. 
          Find your perfect home or manage your portfolio with ease.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {user ? (
          <>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/protected">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/sign-up">
                <Key className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
