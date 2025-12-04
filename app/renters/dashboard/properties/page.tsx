"use client";
import { Search, Heart, MapPin, DollarSign, Bed, Bath, Building2, Filter, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

interface Property {
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
  saved: boolean;
}

export default function BrowsePropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [bathroomFilter, setBathroomFilter] = useState<number | null>(null);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string | null>(null);
  const [sqFtFilter, setSqFFilter] = useState<number | null>(null);
  const [maxRentFilter, setMaxRentFilter] = useState<number | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  // Fetch properties from database
  useEffect(() => {
    async function fetchProperties() {
      const supabase = createClient();
      
      // Fetch all available properties (status = 'Available' or 'available' or 'Vacant' or 'vacant')
      const { data, error } = await supabase
        .from('property')
        .select('*')
        .in('status', ['Available', 'available', 'Vacant', 'vacant'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
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
        saved: false, // Will be set from localStorage below
      }));



      // Load saved favorites from localStorage
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]") as number[];
      const propertiesWithSaved: Property[] = mappedProperties.map((p) => ({
        ...p,
        saved: stored.includes(p.id),
      }));
      setProperties(propertiesWithSaved);
      setIsLoading(false);
    }

    fetchProperties();
  }, []);

    // Whenever properties change (after fetch), update filteredProperties
    useEffect(() => {
      setFilteredProperties(properties);
    }, [properties]);

    // Code to filter the drop down menu's
    // Automatically filter whenever filters or properties change
    useEffect(() => {
        const results = properties.filter((p) => {
        if (bedroomFilter !== null && p.bedrooms < bedroomFilter) return false;
        if (bathroomFilter !== null && p.bathrooms < bathroomFilter) return false;
        if (propertyTypeFilter !== null && p.type !== propertyTypeFilter) return false;
        if (sqFtFilter !== null && p.squareFeet < sqFtFilter) return false;
        if (maxRentFilter !== null && p.rent > maxRentFilter) return false;
        return true;
      });
      setFilteredProperties(results);
    }, [properties, bedroomFilter, bathroomFilter, propertyTypeFilter, maxRentFilter, sqFtFilter]);


  const toggleSaved = (id: number) => {
    setProperties((prev) => {
      const updated = prev.map((property) =>
        property.id === id ? { ...property, saved: !property.saved } : property
      );

      // Save favorites to localStorage
      const favorites = updated.filter((p) => p.saved).map((p) => p.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browse Properties</h1>
          <p className="text-muted-foreground">
            Find your perfect home from thousands of listings
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

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
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={bedroomFilter ?? ""}
                  onChange={(e) => setBedroomFilter(e.target.value ? parseInt(e.target.value) : null)}>
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bathrooms</label>
              <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={bathroomFilter ?? ""}
                  onChange={(e) => setBathroomFilter(e.target.value ? parseInt(e.target.value) : null)}>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
            </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={propertyTypeFilter ?? ""}
                  onChange={(e) => setPropertyTypeFilter(e.target.value || null)}>
                  <option value="">Any</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Loft">Loft</option>
                  <option value="Studio">Studio</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Square Ft</label>
                <Input
                  type="number"
                  placeholder="3000"
                  value={sqFtFilter ?? ""}
                  onChange={(e) =>
                    setSqFFilter(e.target.value ? parseInt(e.target.value) : null) }/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Rent</label>
                <Input
                  type="number"
                  placeholder="3000"
                  value={maxRentFilter ?? ""}
                  onChange={(e) =>
                    setMaxRentFilter(e.target.value ? parseInt(e.target.value) : null) }/>
              </div>
              <div className="space-y-2 col-span-5">
                <Button className="w-full" onClick={() => {
                   setBedroomFilter(null);
                   setBathroomFilter(null);
                   setPropertyTypeFilter(null);
                   setSqFFilter(null);
                   setMaxRentFilter(null);}}>
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Fields
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProperties.length} properties found
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleSaved(property.id)}>
                  <Heart className={`h-4 w-4 ${property.saved ? "fill-red-500 text-red-500" : ""}`}/>
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

                {/* Availability */}
                {property.availableDate && (
                  <div className="text-xs text-muted-foreground">
                    Available: {new Date(property.availableDate).toLocaleDateString()}
                  </div>
                )}

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

      {/* Empty State */}
      {properties.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties available</h3>
            <p className="text-muted-foreground text-center">
              Check back later for new listings
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
