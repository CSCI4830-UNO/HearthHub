import { FileText, MapPin, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getStatusBadge, getStatusMessage, calculateApplicationStats } from "@/lib/utils/application-utils";

export default async function ApplicationsPage() {
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
  const stats = calculateApplicationStats(applicationsList);
  const { pending, approved, rejected } = stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your rental applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl text-green-600">{approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl text-red-600">{rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {applicationsList.map((application) => {
          const property = application.property as any;
          if (!property) return null;

          return (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold">{property.name}</h3>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {property.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Monthly Rent:</span>
                          <span className="font-bold">${property.monthly_rent?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Applied:</span>
                          <span>{new Date(application.applied_date).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getStatusMessage(application.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/renters/dashboard/properties/${property.id}`}>
                        View Property
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/renters/dashboard/applications/${application.id}`}>
                        View Details
                      </Link>
                    </Button>
                    {application.status === "approved" && (
                      <Button variant="default" size="sm">
                        Schedule Tour
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {applicationsList.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start applying to properties you're interested in
            </p>
            <Button asChild>
              <Link href="/renters/dashboard/properties">Browse Properties</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

