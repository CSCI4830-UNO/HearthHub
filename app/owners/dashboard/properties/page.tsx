import { Building2, Plus, Search, MapPin, DollarSign, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock properties data
const properties = [
  {
    id: 1,
    name: "Sunset Apartments - Unit 101",
    address: "123 Main Street, San Francisco, CA 94102",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    rent: 2500,
    status: "occupied",
    tenant: "John Doe",
    image: null,
  },
  {
    id: 2,
    name: "Downtown Loft",
    address: "456 Market St, San Francisco, CA 94103",
    type: "Loft",
    bedrooms: 1,
    bathrooms: 1,
    rent: 3200,
    status: "occupied",
    tenant: "Jane Smith",
    image: null,
  },
  {
    id: 3,
    name: "Garden View Suite",
    address: "789 Oak Avenue, San Francisco, CA 94104",
    type: "Suite",
    bedrooms: 3,
    bathrooms: 2,
    rent: 4500,
    status: "vacant",
    tenant: null,
    image: null,
  },
];

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            Manage your rental properties and listings
          </p>
        </div>
        <Button asChild>
          <Link href="/owners/dashboard/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Properties</CardDescription>
            <CardTitle className="text-2xl">{properties.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Occupied</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {properties.filter(p => p.status === "occupied").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vacant</CardDescription>
            <CardTitle className="text-2xl text-orange-600">
              {properties.filter(p => p.status === "vacant").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Revenue</CardDescription>
            <CardTitle className="text-2xl">
              ${properties.filter(p => p.status === "occupied").reduce((sum, p) => sum + p.rent, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, address, or tenant..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {property.address}
                  </CardDescription>
                </div>
                <Badge variant={property.status === "occupied" ? "default" : "secondary"}>
                  {property.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{property.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bedrooms:</span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bathrooms:</span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Rent:</span>
                  <span className="font-bold text-lg">${property.rent.toLocaleString()}</span>
                </div>
                {property.tenant && (
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <UsersIcon className="h-3 w-3" />
                      Tenant:
                    </span>
                    <span className="font-medium">{property.tenant}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" className="flex-1" size="sm">
                    <Link href={`/owners/dashboard/properties/${property.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1" size="sm">
                    <Link href={`/owners/dashboard/properties/${property.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first rental property
            </p>
            <Button asChild>
              <Link href="/owners/dashboard/properties/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Property
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

