import { FileText, User, Calendar, Building2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock applications data
const applications = [
  {
    id: 1,
    applicantName: "Sarah Williams",
    applicantEmail: "sarah.williams@example.com",
    property: "Garden View Suite",
    appliedDate: "2024-11-01",
    status: "pending",
    income: 85000,
    creditScore: 720,
    moveInDate: "2024-12-01",
  },
  {
    id: 2,
    applicantName: "Robert Chen",
    applicantEmail: "robert.chen@example.com",
    property: "Garden View Suite",
    appliedDate: "2024-11-02",
    status: "pending",
    income: 95000,
    creditScore: 780,
    moveInDate: "2024-12-15",
  },
  {
    id: 3,
    applicantName: "Emily Davis",
    applicantEmail: "emily.davis@example.com",
    property: "Sunset Apartments - Unit 102",
    appliedDate: "2024-10-28",
    status: "approved",
    income: 65000,
    creditScore: 690,
    moveInDate: "2024-11-15",
  },
  {
    id: 4,
    applicantName: "Michael Brown",
    applicantEmail: "michael.brown@example.com",
    property: "Downtown Loft",
    appliedDate: "2024-10-25",
    status: "rejected",
    income: 55000,
    creditScore: 620,
    moveInDate: "2024-11-01",
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
            <CardTitle className="text-2xl">{applications.length}</CardTitle>
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

      {/* Filters */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">All</Button>
        <Button variant="outline" size="sm">Pending</Button>
        <Button variant="outline" size="sm">Approved</Button>
        <Button variant="outline" size="sm">Rejected</Button>
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold">{application.applicantName}</h3>
                    {getStatusBadge(application.status)}
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        Property
                      </div>
                      <p className="font-medium">{application.property}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied
                      </div>
                      <p className="font-medium">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Income</div>
                      <p className="font-medium">${application.income.toLocaleString()}/year</p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Credit Score</div>
                      <p className="font-medium">{application.creditScore}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Desired Move-in:</span>
                      <span className="font-medium">
                        {new Date(application.moveInDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button asChild variant="default" size="sm">
                    <Link href={`/owners/dashboard/applications/${application.id}`}>
                      Review Application
                    </Link>
                  </Button>
                  {application.status === "pending" && (
                    <>
                      <Button asChild variant="outline" size="sm" className="bg-green-50 hover:bg-green-100">
                        <Link href={`/owners/dashboard/applications/${application.id}/approve`}>
                          Approve
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="bg-red-50 hover:bg-red-100">
                        <Link href={`/owners/dashboard/applications/${application.id}/reject`}>
                          Reject
                        </Link>
                      </Button>
                    </>
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
            <p className="text-muted-foreground text-center">
              Applications from prospective tenants will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

