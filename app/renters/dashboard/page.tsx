import { 
  Search, 
  Heart, 
  FileText, 
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function RenterDashboard() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch applications for this user with property details
  const { data: applications, error } = await supabase
    .from('rental_applications')
    .select(`
      id,
      status,
      applied_date,
      property_id,
      property:property_id (
        id,
        name,
        address,
        monthly_rent
      )
    `)
    .eq('user_id', user.id)
    .order('applied_date', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
  }

  // Calculate stats
  const applicationsList = applications || [];
  const activeApplications = applicationsList.filter(a => a.status === "pending").length;
  const approvedApplications = applicationsList.filter(a => a.status === "approved").length;
  
  // Get recent applications (limit 3)
  const recentApplications = applicationsList.slice(0, 3);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your rental search.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApplications}</div>
            <p className="text-xs text-muted-foreground">
              Applications under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedApplications}</div>
            <p className="text-xs text-muted-foreground">
              Applications approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicationsList.length}</div>
            <p className="text-xs text-muted-foreground">
              All applications submitted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your rental search</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/renters/dashboard/properties">
              <Search className="mr-2 h-4 w-4" />
              Browse Properties
            </Link>
          </Button>
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/renters/dashboard/saved">
              <Heart className="mr-2 h-4 w-4" />
              View Saved
            </Link>
          </Button>
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/renters/dashboard/applications">
              <FileText className="mr-2 h-4 w-4" />
              My Applications
            </Link>
          </Button>
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/renters/dashboard/messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest rental applications</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/renters/dashboard/applications">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const property = app.property as any;
                if (!property) return null;
                
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{property.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied {new Date(app.applied_date).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">No applications yet</p>
              <Button asChild variant="outline">
                <Link href="/renters/dashboard/properties">Browse Properties</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

