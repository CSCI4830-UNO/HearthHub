import { 
  Search, 
  Heart, 
  FileText, 
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Building2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data
const stats = {
  savedProperties: 5,
  activeApplications: 3,
  approvedApplications: 1,
  unreadMessages: 2,
};

const recentSearches = [
  { id: 1, query: "2 bedroom apartments in San Francisco", date: "2024-11-01" },
  { id: 2, query: "Pet friendly condos", date: "2024-10-28" },
];

const recentProperties = [
  {
    id: 1,
    name: "Sunset Apartments - Unit 101",
    address: "123 Main Street, San Francisco, CA",
    price: 2500,
    bedrooms: 2,
    bathrooms: 1,
    type: "Apartment",
    saved: true,
  },
  {
    id: 2,
    name: "Downtown Loft",
    address: "456 Market St, San Francisco, CA",
    price: 3200,
    bedrooms: 1,
    bathrooms: 1,
    type: "Loft",
    saved: false,
  },
  {
    id: 3,
    name: "Garden View Suite",
    address: "789 Oak Avenue, San Francisco, CA",
    price: 4500,
    bedrooms: 3,
    bathrooms: 2,
    type: "Suite",
    saved: true,
  },
];

const applications = [
  {
    id: 1,
    property: "Sunset Apartments - Unit 101",
    status: "pending",
    appliedDate: "2024-10-25",
  },
  {
    id: 2,
    property: "Garden View Suite",
    status: "approved",
    appliedDate: "2024-10-20",
  },
  {
    id: 3,
    property: "Downtown Loft",
    status: "pending",
    appliedDate: "2024-10-30",
  },
];

export default function RenterDashboard() {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedProperties}</div>
            <p className="text-xs text-muted-foreground">
              Properties you're interested in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeApplications}</div>
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
            <div className="text-2xl font-bold text-green-600">{stats.approvedApplications}</div>
            <p className="text-xs text-muted-foreground">
              Applications approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              New messages from landlords
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

      {/* Recent Applications & Saved Properties */}
      <div className="grid gap-4 md:grid-cols-2">
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
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{app.property}</p>
                    <p className="text-xs text-muted-foreground">
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Saved Properties */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Saved Properties</CardTitle>
                <CardDescription>Properties you're interested in</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/renters/dashboard/saved">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.filter(p => p.saved).map((property) => (
                <div key={property.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{property.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${property.price}/mo
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          {property.bedrooms} bed
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3 w-3" />
                          {property.bathrooms} bath
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Searches</CardTitle>
          <CardDescription>Your recent property searches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentSearches.map((search) => (
              <div key={search.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{search.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(search.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/renters/dashboard/properties?search=${encodeURIComponent(search.query)}`}>
                    Search Again
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

