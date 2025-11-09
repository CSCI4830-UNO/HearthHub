import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  // Fetch user data from database to check for name
  const { data: userData } = await supabase
    .from('user')
    .select('first_name, name, full_name')
    .eq('email', user.email)
    .maybeSingle();

  // Determine display name: prefer first name only, fall back to email
  let displayName = user.email;
  if (userData) {
    if (userData.first_name) {
      displayName = userData.first_name;
    } else if (userData.name) {
      // Extract first name from name field (split by space and take first part)
      displayName = userData.name.split(' ')[0];
    } else if (userData.full_name) {
      // Extract first name from full_name field (split by space and take first part)
      displayName = userData.full_name.split(' ')[0];
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">Hey, {displayName}!</span>
      <LogoutButton />
    </div>
  );
}
