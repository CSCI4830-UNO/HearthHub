import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const stats = {
  totalProperties: 12,
  occupiedUnits: 8,
  vacantUnits: 4,
  totalTenants: 8,
  monthlyRevenue: 24500,
  pendingApplications: 5,
  overduePayments: 2,
  maintenanceRequests: 3,
};

export default function OwnerDashboard() {
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
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupiedUnits} occupied, {stats.vacantUnits} vacant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overduePayments} overdue payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
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
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/owners/dashboard/messages">
                <Users className="mr-2 h-4 w-4" />
                Check Messages
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
            {stats.overduePayments > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Overdue Payments</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.overduePayments} tenant(s) have overdue payments
                  </p>
                  <Button asChild size="sm" variant="link" className="p-0 h-auto mt-1">
                    <Link href="/owners/dashboard/payments">View Details →</Link>
                  </Button>
                </div>
              </div>
            )}

            {stats.pendingApplications > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New Applications</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingApplications} application(s) pending review
                  </p>
                  <Button asChild size="sm" variant="link" className="p-0 h-auto mt-1">
                    <Link href="/owners/dashboard/applications">Review Now →</Link>
                  </Button>
                </div>
              </div>
            )}

            {stats.maintenanceRequests > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintenance Requests</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.maintenanceRequests} open maintenance request(s)
                  </p>
                  <Button asChild size="sm" variant="link" className="p-0 h-auto mt-1">
                    <Link href="/owners/dashboard/messages">View Requests →</Link>
                  </Button>
                </div>
              </div>
            )}

            {stats.overduePayments === 0 && stats.pendingApplications === 0 && stats.maintenanceRequests === 0 && (
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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Property {i}</p>
                    <p className="text-sm text-muted-foreground">123 Main St, City, State</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                        {i % 2 === 0 ? "Occupied" : "Vacant"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">$2,500/month</span>
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/owners/dashboard/properties/${i}`}>View Details</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

