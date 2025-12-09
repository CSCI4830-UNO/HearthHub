"use client";
import { useEffect, useState } from "react";
import { Heart, MapPin, Bed, Bath, Building2, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface RentedProperty {
  id: number;
  name: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number | null;
  rent: number;
  deposit: number | null;
  availableDate: string | null;
  amenities: string[];
  images: string[];
  saved: boolean;
}

export default function RentPaymentsPage() {
  const [savedProperties, setSavedProperties] = useState<RentedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rented properties from database
  useEffect(() => {
    async function fetchRentedProperties() {
      const supabase = createClient();
      
      // Get saved property IDs from localStorage
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]") as number[];
      
      if (stored.length === 0) {
        setSavedProperties([]);
        setIsLoading(false);
        return;
      }

      // Fetch properties that are saved
      const { data, error } = await supabase
        .from('property')
        .select('*')
        .in('id', stored)
        .in('status', ['Available', 'available', 'Vacant', 'vacant']);

      if (error) {
        console.error('Error fetching saved properties:', error);
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

        console.log(images); // Used to backtest the public URLS

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
            saved: false, // Will check localStorage below to see if its saved
          };
        });

        console.log(mappedProperties); // Used to backtest the public URLS

      // Get the saved favorites from localStorage
      // Using JSON.parse because localStorage stores strings
      const propertiesWithSaved: RentedProperty[] = mappedProperties.map((p) => ({
        ...p,
        saved: stored.includes(p.id), // Check if this property id is in the favorites list
      }));

      setSavedProperties(mappedProperties);
      setIsLoading(false);
    }

    fetchRentedProperties();
  }, []);




  // Removes from Favorited selection on the saved page
  const removeFromSaved = (id: number) => {
    const updated = savedProperties.filter((p) => p.id !== id);
    setSavedProperties(updated);

    const stored = JSON.parse(localStorage.getItem("favorites") || "[]") as number[];
    const newFavorites = stored.filter((favId) => favId !== id);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rent Payments</h1>
            <p className="text-muted-foreground">Properties to make a rent payment</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading saved properties...</p>
        </div>
      </div>
    );
  }
  
  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rent Payments</h1>
            <p className="text-muted-foreground">Properties to make a rent payment</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {savedProperties.length} rented
          </div>
        </div>

        {savedProperties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved properties yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start browsing properties and save the ones you like
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={() => removeFromSaved(property.id)}
                      >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
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