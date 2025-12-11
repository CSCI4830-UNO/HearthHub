import { 
  Building2, 
  Users, 
  DollarSign, 
  FileText,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OwnerDashboard() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch properties for this owner
  const { data: properties, error: propertiesError } = await supabase
    .from('property')
    .select('*')
    .eq('landlord_id', user.id)
    .order('created_at', { ascending: false });

  if (propertiesError) {
    console.error('Error fetching properties:', propertiesError);
  }

  const propertiesList = properties || [];
  const propertyIds = propertiesList.map(p => p.id);

  // Fetch applications for owner's properties
  let applicationsList: any[] = [];
  if (propertyIds.length > 0) {
    const { data: applications, error: applicationsError } = await supabase
      .from('rental_applications')
      .select('id, status, user_id')
      .in('property_id', propertyIds);

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError);
    } else {
      applicationsList = applications || [];
    }
  }

  // Calculate stats
  const totalProperties = propertiesList.length;
  const occupiedUnits = propertiesList.filter(p => 
    p.status?.toLowerCase() === 'occupied' || p.status?.toLowerCase() === 'rented'
  ).length;
  const vacantUnits = propertiesList.filter(p => 
    ['available', 'vacant'].includes(p.status?.toLowerCase() || '')
  ).length;
  
  // Calculate monthly revenue from occupied properties
  const monthlyRevenue = propertiesList
    .filter(p => p.status?.toLowerCase() === 'occupied' || p.status?.toLowerCase() === 'rented')
    .reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

  // Count unique tenants (users with approved applications)
  const approvedApplications = applicationsList.filter(a => a.status === "approved");
  const uniqueTenants = new Set(approvedApplications.map(a => a.user_id)).size;

  const pendingApplications = applicationsList.filter(a => a.status === "pending").length;

  // Get recent properties (limit 3)
  const recentProperties = propertiesList.slice(0, 3);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your rental portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {occupiedUnits} occupied, {vacantUnits} vacant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {occupiedUnits} occupied unit{occupiedUnits !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueTenants}</div>
            <p className="text-xs text-muted-foreground">
              {approvedApplications.length} approved application{approvedApplications.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Requires review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/owners/dashboard/properties/create">
                <Building2 className="mr-2 h-4 w-4" />
                Add New Property
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/owners/dashboard/applications">
                <FileText className="mr-2 h-4 w-4" />
                Review Applications
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/owners/dashboard/payments">
                <DollarSign className="mr-2 h-4 w-4" />
                View Payments
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApplications > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New Applications</p>
                  <p className="text-xs text-muted-foreground">
                    {pendingApplications} application{pendingApplications !== 1 ? 's' : ''} pending review
                  </p>
                  <Button asChild size="sm" variant="link" className="p-0 h-auto mt-1">
                    <Link href="/owners/dashboard/applications">Review Now →</Link>
                  </Button>
                </div>
              </div>
            )}

            {pendingApplications === 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-700">All caught up!</p>
                  <p className="text-xs text-muted-foreground">
                    No pending items requiring attention
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Properties</CardTitle>
              <CardDescription>Your latest property listings</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/owners/dashboard/properties">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentProperties.length > 0 ? (
            <div className="space-y-4">
              {recentProperties.map((property) => {
                const isOccupied = property.status?.toLowerCase() === 'occupied' || property.status?.toLowerCase() === 'rented';
                return (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-sm text-muted-foreground">{property.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={isOccupied ? "default" : "secondary"}>
                            {isOccupied ? "Occupied" : "Vacant"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ${property.monthly_rent?.toLocaleString() || 0}/month
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/owners/dashboard/properties/${property.id}`}>View Details</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">No properties yet</p>
              <Button asChild variant="outline">
                <Link href="/owners/dashboard/properties/create">Create Property</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

