import { Heart, MapPin, DollarSign, Bed, Bath, Building2, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock saved properties
const savedProperties = [
  {
    id: 1,
    name: "Sunset Apartments - Unit 101",
    address: "123 Main Street, San Francisco, CA 94102",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1200,
    rent: 2500,
    deposit: 2500,
    availableDate: "2024-12-01",
    savedDate: "2024-10-15",
    amenities: ["Parking", "Laundry", "Air Conditioning", "Pet Friendly"],
  },
  {
    id: 2,
    name: "Downtown Loft",
    address: "456 Market St, San Francisco, CA 94103",
    type: "Loft",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 900,
    rent: 3200,
    deposit: 3200,
    availableDate: "2024-11-15",
    savedDate: "2024-10-20",
    amenities: ["Parking", "Furnished", "Gym", "Elevator"],
  },
  {
    id: 3,
    name: "Garden View Suite",
    address: "789 Oak Avenue, San Francisco, CA 94104",
    type: "Suite",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    rent: 4500,
    deposit: 4500,
    availableDate: "2024-12-15",
    savedDate: "2024-10-25",
    amenities: ["Parking", "Laundry", "Balcony", "Pool"],
  },
];

export default function SavedPropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saved Properties</h1>
          <p className="text-muted-foreground">
            Properties you've saved for later
          </p>
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

                  {/* Saved Date */}
                  <div className="text-xs text-muted-foreground">
                    Saved {new Date(property.savedDate).toLocaleDateString()}
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
                  <Button variant="ghost" className="w-full" size="sm">
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

