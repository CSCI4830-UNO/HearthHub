import { Building2, Plus, Search, MapPin, DollarSign, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PropertiesPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch properties for this landlord
  const { data: properties, error } = await supabase
    .from('property')
    .select('*')
    .eq('landlord_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
  }

  // Map database fields to display format
  const mappedProperties = (properties || []).map((property) => ({
    id: property.id,
    name: property.name,
    address: property.address,
    type: property.property_type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.square_feet,
    rent: property.monthly_rent,
    status: property.status,
    tenant: null, // You can add tenant lookup later if needed
    image: null,
  }));
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
          <Link href="/owners/dashboard/properties/create">
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
            <CardTitle className="text-2xl">{mappedProperties.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Occupied</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {mappedProperties.filter(p => p.status === "occupied").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vacant</CardDescription>
            <CardTitle className="text-2xl text-orange-600">
              {mappedProperties.filter(p => p.status === "vacant" || p.status === "available").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Revenue</CardDescription>
            <CardTitle className="text-2xl">
              ${mappedProperties.filter(p => p.status === "occupied").reduce((sum, p) => sum + (p.rent || 0), 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      

      {/* Properties List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mappedProperties.map((property) => (
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
                {property.sqft && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sqft:</span>
                    <span className="font-medium">{property.sqft}</span>
                  </div>
                )}
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

      {mappedProperties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first rental property
            </p>
            <Button asChild>
              <Link href="/owners/dashboard/properties/create">
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

