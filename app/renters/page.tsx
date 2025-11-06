import { Home as HomeIcon, Search, FileText, MessageSquare, Shield, Calendar, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { createClient } from "@/lib/supabase/server";

export default async function RentersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center p-4 px-6">
          <Link href={"/"} className="flex items-center gap-2 font-bold text-xl flex-1">
            <HomeIcon className="h-6 w-6 text-primary" />
            HeartHub
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

      {/* Hero Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold">Find Your Perfect Home</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Search through thousands of verified properties and find the perfect place to call home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button asChild size="lg">
                <Link href="/renters/dashboard">
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform makes finding and securing your next home simple and stress-free.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Easy Search</CardTitle>
                <CardDescription>
                  Browse thousands of properties with advanced filters for location, price, size, and amenities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Price range filters</li>
                  <li>• Location-based search</li>
                  <li>• Property type filters</li>
                  <li>• Save favorite listings</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Quick Applications</CardTitle>
                <CardDescription>
                  Apply for properties with a simple, streamlined application process. Save your information and apply to multiple properties.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• One-click applications</li>
                  <li>• Document upload</li>
                  <li>• Application tracking</li>
                  <li>• Status notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Direct Communication</CardTitle>
                <CardDescription>
                  Message property owners directly through our secure platform. Get answers to your questions quickly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• In-app messaging</li>
                  <li>• Quick responses</li>
                  <li>• Secure communication</li>
                  <li>• Message history</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Verified Listings</CardTitle>
                <CardDescription>
                  All properties are verified for accuracy and legitimacy. We ensure you're seeing real, available properties.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Verified property owners</li>
                  <li>• Accurate information</li>
                  <li>• Up-to-date availability</li>
                  <li>• Fraud protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Schedule Tours</CardTitle>
                <CardDescription>
                  Book property viewings directly through the platform. See properties on your schedule.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Online scheduling</li>
                  <li>• Calendar integration</li>
                  <li>• Reminder notifications</li>
                  <li>• Virtual tour options</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Community Reviews</CardTitle>
                <CardDescription>
                  Read reviews from other renters to make informed decisions. Share your experiences too.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Tenant reviews</li>
                  <li>• Property ratings</li>
                  <li>• Neighborhood insights</li>
                  <li>• Honest feedback</li>
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
                Continue browsing properties and manage your applications.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link href="/renters/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Find Your Home?</h2>
              <p className="text-lg text-primary-foreground/90">
                Create your free account and start browsing properties today.
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

