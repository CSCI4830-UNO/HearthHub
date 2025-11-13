"use client";
import { useEffect, useState } from "react";
import { Heart, MapPin, DollarSign, Bed, Bath, Building2, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { startingProperties } from "../properties/page";

export default function SavedPropertiesPage() {
  // Pulls data from dashboard/properties that are "Favorited"
  const [savedProperties, setSavedProperties] = useState([]);

  // Uses localStorage to grab the "Favorite" properties
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    const filtered = startingProperties.filter((p) => stored.includes(p.id));
    setSavedProperties(filtered);
  }, []);

  // Removes from Favorited selection on the saved page in line 131-137 of this page
    const removeFromSaved = (id) => {
        const updated = savedProperties.filter((p) => p.id !== id);
        setSavedProperties(updated);

    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    const newFavorites = stored.filter((favId) => favId !== id);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

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
                      <span>{property.squareFeet.toLocaleString()} sq ft</span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity) => (
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