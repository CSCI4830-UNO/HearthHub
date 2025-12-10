"use client";
import { useEffect, useState } from "react";
import { Heart, MapPin, Bed, Bath, Building2, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

interface RentedProperty {
  id: number;
  name: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number | null;
  rent: number;
  deposit: number;
  availableDate: string | null;
  amenities: string[];
  images: string[];
}


export default function RentPaymentsPage() {
  const [savedProperties, setSavedProperties] = useState<RentedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rented properties from database
  useEffect(() => {
    async function fetchRentedProperties() {
      const supabase = createClient();

      // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          redirect("/auth/login");
        }

      // Fetch leases with user
      const { data: lease, error: leaseError } = await supabase
        .from('lease')
        .select(`*`)
        .eq('tenant_id', user.id);

      if (leaseError) {
        console.error('Error fetching leased properties:', leaseError);
        setIsLoading(false);
        return;
      }

      // Create array of leased ids to get property data
      let leasedArray = []
      for(let i = 0; i < lease.length; i++)
        {
          leasedArray.push(lease[i].property_id)
        }

      // Fetch properties that are leased
      const { data, error } = await supabase
        .from('property')
        .select('*')
        .in('id', leasedArray);

      if (error) {
        console.error('Error fetching leased properties:', error);
        setIsLoading(false);
        return;
      }

      // The database uses snake_case but I want to use camelCase in my code
      // So I'm mapping the fields to match my interface
      const mappedProperties = (data || []).map((property) => {
        let images: string[] = []; // local variable used for an Array of strings to hold the URLs

        if (property.images) {
            // If Supabase returns a string then convert into an Array of URLs then assigned directly to images
            if (typeof property.images === "string") {
              images = JSON.parse(property.images);
            }
            // If Supabase returns and Array then property.images is assigned directly to images
            else if (Array.isArray(property.images)) {
              images = property.images;
            }
          }
          return {
            id: property.id,
            name: property.name,
            address: property.address,
            type: property.property_type,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            squareFeet: property.square_feet,
            rent: property.monthly_rent,
            deposit: property.security_deposit,
            availableDate: property.available_date,
            amenities: property.amenities || [], // Make sure it's always an array
            images, // bucket
          };
        });

      setSavedProperties(mappedProperties);
      setIsLoading(false);
    }

    fetchRentedProperties();
  }, []);


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">Properties currenty leased to make a payment</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading leased properties...</p>
        </div>
      </div>
    );
  }
  
  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">Properties currenty leased to make a payment</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {savedProperties.length} leased
          </div>
        </div>

        {savedProperties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leased properties yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start a new lease and make a payment
              </p>
              <Button asChild>
                <a href="/renters/dashboard/properties">Browse Properties</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]} // show the first image
                  alt={property.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 text-muted-foreground" />
              )}
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">${property.rent.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                      <Badge variant="outline">{property.type}</Badge>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div>
                        <p className="text-2xs font-bold">${property.deposit.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">deposit</p>
                      </div>
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.bathrooms}
                      </span>
                      {property.squareFeet && (
                        <span>{property.squareFeet.toLocaleString()} sq ft</span>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild variant="outline" className="flex-1">
                        <a href={`/renters/dashboard/properties/${property.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="flex-1" size="sm">
                        <Link href={`/renters/rentpayment/${property.id}`}>
                          Make Payment
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }