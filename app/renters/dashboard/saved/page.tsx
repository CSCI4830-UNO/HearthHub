"use client";
import { useEffect, useState } from "react";
import { Heart, MapPin, DollarSign, Bed, Bath, Building2, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

interface SavedProperty {
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
}

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved properties from database
  useEffect(() => {
    async function fetchSavedProperties() {
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

      // Map database fields to display format
      const mappedProperties = (data || []).map((property) => ({
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
        amenities: property.amenities || [],
      }));

      setSavedProperties(mappedProperties);
      setIsLoading(false);
    }

    fetchSavedProperties();
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
            <h1 className="text-3xl font-bold">Saved Properties</h1>
            <p className="text-muted-foreground">Properties you've saved for later</p>
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
            <h1 className="text-3xl font-bold">Saved Properties</h1>
            <p className="text-muted-foreground">Properties you've saved for later</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {savedProperties.length} saved
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
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => removeFromSaved(property.id)} // 👈 Heart removes
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

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {property.amenities.slice(0, 3).map((amenity: string) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{property.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button asChild variant="outline" className="flex-1">
                        <a href={`/renters/dashboard/properties/${property.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </a>
                      </Button>
                      <Button asChild className="flex-1">
                        <a href={`/renters/dashboard/properties/${property.id}/apply`}>
                          Apply
                        </a>
                      </Button>
                    </div>

                    {/* Button removes Favorited property when clicked */}
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      size="sm"
                      onClick={() => removeFromSaved(property.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove from Saved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }