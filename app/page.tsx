import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { 
  Home as HomeIcon, 
  Building2, 
  Search, 
  Shield, 
  DollarSign, 
  Users, 
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
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
      <section className="w-full flex flex-col items-center py-20 px-4">
        <div className="max-w-5xl w-full">
          <Hero />
        </div>
      </section>

      {/* For Renters Section */}
      <section className="w-full py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">For Renters</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Find your perfect home with ease. Search, view, and apply for properties all in one place.
            </p>
            <Button asChild>
              <Link href="/renters">Explore Renter Features →</Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Easy Search</CardTitle>
                <CardDescription>
                  Browse thousands of properties with advanced filters and search tools
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Quick Applications</CardTitle>
                <CardDescription>
                  Apply for properties with a simple, streamlined application process
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Direct Communication</CardTitle>
                <CardDescription>
                  Message property owners directly through our secure platform
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Verified Listings</CardTitle>
                <CardDescription>
                  All properties are verified for accuracy and legitimacy
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Schedule Tours</CardTitle>
                <CardDescription>
                  Book property viewings directly through the platform
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Community Reviews</CardTitle>
                <CardDescription>
                  Read reviews from other renters to make informed decisions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* For Property Owners Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">For Property Owners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Manage your rental portfolio efficiently. List properties, screen tenants, and grow your business.
            </p>
            <Button asChild>
              <Link href="/owners">Explore Owner Features →</Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>
                  Manage multiple properties from one centralized dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Tenant Screening</CardTitle>
                <CardDescription>
                  Access comprehensive tenant applications and background checks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Track performance, occupancy rates, and revenue analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Payment Processing</CardTitle>
                <CardDescription>
                  Collect rent and manage payments securely online
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Store leases, contracts, and important documents securely
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Tenant Communication</CardTitle>
                <CardDescription>
                  Communicate with tenants and handle maintenance requests
                </CardDescription>
              </CardHeader>
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
                Continue exploring properties or managing your portfolio.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Get Started?</h2>
              <p className="text-lg text-primary-foreground/90">
                Join thousands of renters and property owners already using HeartHub
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link href="/auth/sign-up">Create Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold">HeartHub</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} HeartHub. All rights reserved.
          </p>
          <ThemeSwitcher />
        </div>
        </footer>
    </main>
  );
}