import { FileText, CheckCircle2, Clock, XCircle, MapPin, DollarSign, Calendar, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock applications
const applications = [
  {
    id: 1,
    property: "Sunset Apartments - Unit 101",
    address: "123 Main Street, San Francisco, CA",
    rent: 2500,
    appliedDate: "2024-10-25",
    status: "pending",
    statusMessage: "Under review by property owner",
  },
  {
    id: 2,
    property: "Garden View Suite",
    address: "789 Oak Avenue, San Francisco, CA",
    rent: 4500,
    appliedDate: "2024-10-20",
    status: "approved",
    statusMessage: "Congratulations! Your application has been approved.",
  },
  {
    id: 3,
    property: "Downtown Loft",
    address: "456 Market St, San Francisco, CA",
    rent: 3200,
    appliedDate: "2024-10-30",
    status: "pending",
    statusMessage: "Under review by property owner",
  },
  {
    id: 4,
    property: "Riverside Condo - Unit 205",
    address: "321 River Road, San Francisco, CA",
    rent: 2800,
    appliedDate: "2024-10-15",
    status: "rejected",
    statusMessage: "Application was not approved at this time",
  },
];

export default function ApplicationsPage() {
  const pending = applications.filter(a => a.status === "pending").length;
  const approved = applications.filter(a => a.status === "approved").length;
  const rejected = applications.filter(a => a.status === "rejected").length;

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
            <CardTitle className="text-2xl">{applications.length}</CardTitle>
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
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold">{application.property}</h3>
                    {getStatusBadge(application.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {application.address}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Monthly Rent:</span>
                        <span className="font-bold">${application.rent.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Applied:</span>
                        <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {application.statusMessage}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button asChild variant="outline" size="sm">
                    <a href={`/renters/dashboard/properties/${application.id}`}>
                      View Property
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={`/renters/dashboard/applications/${application.id}`}>
                      View Details
                    </a>
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
        ))}
      </div>

      {applications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start applying to properties you're interested in
            </p>
            <Button asChild>
              <a href="/renters/dashboard/properties">Browse Properties</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

