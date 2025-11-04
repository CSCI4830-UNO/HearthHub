import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Home as HomeIcon, ArrowRight } from "lucide-react";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data.claims;

  // Show dashboard selection page
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Dashboard</h1>
          <p className="text-muted-foreground">
            Select the dashboard that matches your role
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/renters/dashboard">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <HomeIcon className="h-8 w-8 text-primary" />
                  <CardTitle>Renter Dashboard</CardTitle>
                </div>
                <CardDescription>
                  Browse properties, manage applications, and find your perfect home
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Browse available properties</li>
                  <li>• Save favorite listings</li>
                  <li>• Track applications</li>
                  <li>• Message landlords</li>
                </ul>
                <Button className="w-full mt-4">
                  Go to Renter Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/owners/dashboard">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-8 w-8 text-primary" />
                  <CardTitle>Property Owner Dashboard</CardTitle>
                </div>
                <CardDescription>
                  Manage your properties, tenants, and rental portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Manage properties</li>
                  <li>• Review applications</li>
                  <li>• Track payments</li>
                  <li>• Communicate with tenants</li>
                </ul>
                <Button className="w-full mt-4">
                  Go to Owner Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You can switch between dashboards at any time from the navigation menu
          </p>
        </div>
      </div>
    </div>
  );
}
