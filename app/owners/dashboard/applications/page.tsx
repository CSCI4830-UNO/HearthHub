import { FileText, User, Calendar, Building2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RejectButton from "@/components/reject-button";

export default async function ApplicationsPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch applications for properties owned by this user
  // First get all properties owned by this user
  const { data: properties, error: propertiesError } = await supabase
    .from('property')
    .select('id')
    .eq('landlord_id', user.id);

  if (propertiesError) {
    console.error('Error fetching properties:', propertiesError);
  }

  const propertyIds = (properties || []).map(p => p.id);

  // If no properties, show empty state
  if (propertyIds.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Rental Applications</h1>
          <p className="text-muted-foreground">
            Review and manage rental applications from prospective tenants
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create a property listing to start receiving applications
            </p>
            <Button asChild>
              <Link href="/owners/dashboard/properties/create">Create Property</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch applications for these properties with property and user details
  const { data: applications, error } = await supabase
    .from('rental_applications')
    .select(`
      id,
      status,
      applied_date,
      first_name,
      last_name,
      email,
      monthly_income,
      move_in_date,
      property_id,
      user_id,
      property:property_id (
        id,
        name,
        address
      )
    `)
    .in('property_id', propertyIds)
    .order('applied_date', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
  }

  // Calculate stats
  const applicationsList = applications || [];
  const pending = applicationsList.filter(a => a.status === "pending").length;
  const approved = applicationsList.filter(a => a.status === "approved").length;
  const rejected = applicationsList.filter(a => a.status === "rejected").length;

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

  // Calculate annual income from monthly income
  const getAnnualIncome = (monthlyIncome: number | null) => {
    if (!monthlyIncome) return null;
    return monthlyIncome * 12;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Rental Applications</h1>
        <p className="text-muted-foreground">
          Review and manage rental applications from prospective tenants
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-2xl">{applicationsList.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Review</CardDescription>
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

      {/* Filters - TODO: Implement filtering */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">All</Button>
        <Button variant="outline" size="sm">Pending</Button>
        <Button variant="outline" size="sm">Approved</Button>
        <Button variant="outline" size="sm">Rejected</Button>
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {applicationsList.map((application) => {
          const property = application.property as any;
          if (!property) return null;

          const applicantName = `${application.first_name} ${application.last_name}`;
          const annualIncome = getAnnualIncome(application.monthly_income);

          return (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold">{applicantName}</h3>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          Property
                        </div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-xs text-muted-foreground">{property.address}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Applied
                        </div>
                        <p className="font-medium">
                          {new Date(application.applied_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Monthly Income</div>
                        <p className="font-medium">
                          {application.monthly_income 
                            ? `$${application.monthly_income.toLocaleString()}/mo`
                            : "Not provided"
                          }
                        </p>
                        {annualIncome && (
                          <p className="text-xs text-muted-foreground">
                            ${annualIncome.toLocaleString()}/year
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Email</div>
                        <p className="font-medium text-sm">{application.email}</p>
                      </div>
                    </div>

                    {application.move_in_date && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Desired Move-in:</span>
                          <span className="font-medium">
                            {new Date(application.move_in_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button asChild variant="default" size="sm">
                      <Link href={`/owners/dashboard/applications/${application.id}`}>
                        Review Application
                      </Link>
                    </Button>
                    {application.status === "pending" && (
                      <>
                        <Button asChild variant="outline" size="sm" className="bg-green-200 hover:bg-green-300 text-black">
                          <Link href={`/owners/dashboard/applications/${application.id}/approve`}>
                            Approve
                          </Link>
                        </Button>
                        <RejectButton applicationId={application.id} />
                      </>
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
            <p className="text-muted-foreground text-center">
              Applications from prospective tenants will show up here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

