import { Search, Heart, MapPin, DollarSign, Bed, Bath, Building2, Filter, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const properties = [
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
    image: null,
    amenities: ["Parking", "Laundry", "Air Conditioning", "Pet Friendly"],
    saved: false,
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
    image: null,
    amenities: ["Parking", "Furnished", "Gym", "Elevator"],
    saved: true,
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
    image: null,
    amenities: ["Parking", "Laundry", "Balcony", "Pool"],
    saved: true,
  },
  {
    id: 4,
    name: "Riverside Condo - Unit 205",
    address: "321 River Road, San Francisco, CA 94105",
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1400,
    rent: 2800,
    deposit: 2800,
    availableDate: "2024-11-01",
    image: null,
    amenities: ["Parking", "Laundry", "Gym", "Pet Friendly"],
    saved: false,
  },
];

export default function BrowsePropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Browse Properties</h1>
        <p className="text-muted-foreground">
          Find your perfect home from thousands of listings
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, property type, or features..."
                className="pl-10"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Rent</label>
                <Input type="number" placeholder="5000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                  <option>Any</option>
                  <option>1+</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>4+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                  <option>Any</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Condo</option>
                  <option>Loft</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {properties.length} properties found
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {property.address}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className={`h-4 w-4 ${property.saved ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Price and Details */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">${property.rent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                  <Badge variant="outline">{property.type}</Badge>
                </div>

                {/* Property Details */}
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

                {/* Availability */}
                <div className="text-xs text-muted-foreground">
                  Available: {new Date(property.availableDate).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" className="flex-1">
                    <a href={`/renters/dashboard/properties/${property.id}`}>
                      View Details
                    </a>
                  </Button>
                  <Button asChild className="flex-1">
                    <a href={`/renters/dashboard/properties/${property.id}/apply`}>
                      Apply Now
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline">Load More Properties</Button>
      </div>
    </div>
  );
}

