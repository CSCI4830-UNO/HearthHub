import { Users, Mail, Phone, Calendar, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const tenants = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    property: "Sunset Apartments - Unit 101",
    moveInDate: "2024-01-15",
    rent: 2500,
    status: "current",
    paymentStatus: "paid",
    leaseEnd: "2025-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    property: "Downtown Loft",
    moveInDate: "2023-11-01",
    rent: 3200,
    status: "current",
    paymentStatus: "overdue",
    leaseEnd: "2024-11-01",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "(555) 456-7890",
    property: "Riverside Condo - Unit 205",
    moveInDate: "2024-02-01",
    rent: 2800,
    status: "current",
    paymentStatus: "paid",
    leaseEnd: "2025-02-01",
  },
];

export default function TenantsPage() {
  const totalTenants = tenants.length;
  const currentTenants = tenants.filter(t => t.status === "current").length;
  const overduePayments = tenants.filter(t => t.paymentStatus === "overdue").length;
  const totalMonthlyRent = tenants.filter(t => t.status === "current").reduce((sum, t) => sum + t.rent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tenants</h1>
        <p className="text-muted-foreground">
          Manage your tenants and rental agreements
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tenants</CardDescription>
            <CardTitle className="text-2xl">{totalTenants}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Tenants</CardDescription>
            <CardTitle className="text-2xl text-green-600">{currentTenants}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue Payments</CardDescription>
            <CardTitle className="text-2xl text-red-600">{overduePayments}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Rent Collected</CardDescription>
            <CardTitle className="text-2xl">${totalMonthlyRent.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Search by name, email, phone, or property..." />
        </CardContent>
      </Card>

      {/* Tenants List */}
      <div className="grid gap-4">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{tenant.name}</h3>
                    <Badge variant={tenant.status === "current" ? "default" : "secondary"}>
                      {tenant.status}
                    </Badge>
                    <Badge 
                      variant={tenant.paymentStatus === "paid" ? "default" : "destructive"}
                    >
                      {tenant.paymentStatus === "paid" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Overdue
                        </span>
                      )}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {tenant.phone}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Property:</span>
                        <span className="font-medium">{tenant.property}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Monthly Rent:</span>
                        <span className="font-bold">${tenant.rent.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Move-in:</span>
                        <span>{new Date(tenant.moveInDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Lease End:</span>
                        <span>{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/owners/dashboard/tenants/${tenant.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/owners/dashboard/messages?tenant=${tenant.id}`}>
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

