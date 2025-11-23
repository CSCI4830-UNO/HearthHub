import { Home as HomeIcon, Search, MapPin} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";

const properties = [
  {
    id: 1,
    name: "Dundee Flats",
    address: "4835 Dodge St, Omaha, NE 68132",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 785,
    rent: 1000,
    status: "occupied",
    tenant: "John Doe",
    image: null,
  },
  {
    id: 2,
    name: "Juniper Rows",
    address: "12070 Kimball Plz, Omaha, NE 68142",
    type: "Suite",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    rent: 2300,
    status: "occupied",
    tenant: "Jane Smith",
    image: null,
  },
  {
    id: 3,
    name: "The Duo",
    address: "222 S 15th St, Omaha, NE 68102",
    type: "Flat",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 570,
    rent: 1020,
    status: "vacant",
    tenant: null,
    image: null,
  },
];

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      {/* <nav className="w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center p-4 px-6">
          <Link href={"/"} className="flex items-center gap-2 font-bold text-xl flex-1">
            <HomeIcon className="h-6 w-6 text-primary" />
            Hearth Hub
          </Link>
          <div className="flex items-center gap-4 justify-center flex-1">
            <Link href="/renters/dashboard" className="font-bold text-muted-foreground hover:text-foreground">For Renters</Link>
            <Link href="/owners/dashboard" className="font-bold text-muted-foreground hover:text-foreground">For Owners</Link>
          </div>
          <div className="flex items-center gap-4 justify-end flex-1">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </div>
      </nav> */}


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
                  <span className="text-muted-foreground">Sqft::</span>
                  <span className="font-medium">{property.sqft}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Rent:</span>
                  <span className="font-bold text-lg">${property.rent.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" className="flex-1" size="sm">
                    <Link href={`/apartments/${property.id}`}>
                      Make Payment
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

