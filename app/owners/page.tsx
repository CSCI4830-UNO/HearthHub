import { Home as HomeIcon, Building2, Users, BarChart3, DollarSign, FileText, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { createClient } from "@/lib/supabase/server";

export default async function OwnersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <Link href={"/"} className="flex items-center gap-2 font-bold text-xl">
            <HomeIcon className="h-6 w-6 text-primary" />
            HeartHub
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/renters" className="text-sm font-medium text-muted-foreground hover:text-foreground">For Renters</Link>
            <Link href="/owners" className="text-sm font-medium">For Owners</Link>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold">Manage Your Rental Portfolio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your property management with powerful tools designed for landlords and property owners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button asChild size="lg">
                <Link href="/owners/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Complete Property Management</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your rental properties efficiently and grow your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>
                  Manage multiple properties from one centralized dashboard. Track all your listings, tenants, and maintenance requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Multi-property dashboard</li>
                  <li>• Property listings</li>
                  <li>• Status tracking</li>
                  <li>• Bulk operations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Tenant Screening</CardTitle>
                <CardDescription>
                  Access comprehensive tenant applications and background checks. Make informed decisions with detailed applicant profiles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Application management</li>
                  <li>• Credit checks</li>
                  <li>• Reference verification</li>
                  <li>• Tenant profiles</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Track performance, occupancy rates, and revenue analytics. Make data-driven decisions for your portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Revenue tracking</li>
                  <li>• Occupancy rates</li>
                  <li>• Performance metrics</li>
                  <li>• Financial reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Payment Processing</CardTitle>
                <CardDescription>
                  Collect rent and manage payments securely online. Automated reminders and tracking for all transactions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Online rent collection</li>
                  <li>• Payment reminders</li>
                  <li>• Transaction history</li>
                  <li>• Automated receipts</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Store leases, contracts, and important documents securely. Access everything from anywhere.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Digital lease storage</li>
                  <li>• Contract management</li>
                  <li>• Document templates</li>
                  <li>• Secure cloud storage</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Tenant Communication</CardTitle>
                <CardDescription>
                  Communicate with tenants and handle maintenance requests. Keep all communication in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• In-app messaging</li>
                  <li>• Maintenance requests</li>
                  <li>• Announcements</li>
                  <li>• Communication history</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {user ? (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold">Welcome back!</h2>
              <p className="text-lg text-primary-foreground/90">
                Continue managing your properties and portfolio.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link href="/owners/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold">Start Managing Your Properties Today</h2>
              <p className="text-lg text-primary-foreground/90">
                Join property owners who are streamlining their rental business with HeartHub.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link href="/auth/sign-up">Get Started Free</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

