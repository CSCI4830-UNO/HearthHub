"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath,
  Square,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageGallery from "@/components/image-gallery";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PropertyDetailsPage({ params }: PageProps) {
  const [property, setProperty] = useState<any>(null);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        // Get params
        const resolvedParams = await params;
        const propertyId = parseInt(resolvedParams.id, 10);
        
        if (isNaN(propertyId)) {
          setError("Invalid property ID");
          setLoading(false);
          return;
        }

        // Fetch property
        const { data: propertyData, error: propertyError } = await supabase
          .from('property')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (propertyError || !propertyData) {
          setError("Property not found");
          setLoading(false);
          return;
        }

        setProperty(propertyData);

        // Check for existing application
        const { data: application } = await supabase
          .from('rental_applications')
          .select('id, status')
          .eq('property_id', propertyId)
          .eq('user_id', user.id)
          .maybeSingle();

        setExistingApplication(application);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load property");
        setLoading(false);
      }
    };

    fetchData();
  }, [params, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading property...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/renters/dashboard/properties">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  // Parse images exactly like the browse properties page
  let images: string[] = [];
  if (property.images) {
    if (typeof property.images === "string") {
      images = JSON.parse(property.images);
    } else if (Array.isArray(property.images)) {
      images = property.images;
    }
  }

  const isAvailable = ['Available', 'available', 'Vacant', 'vacant'].includes(property.status);
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/renters/dashboard/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{property.name}</h1>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4" />
            {property.address}
          </p>
        </div>
        <Badge variant={isAvailable ? "default" : "secondary"} className="text-sm px-3 py-1">
          {property.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <ImageGallery images={images} propertyName={property.name} />

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bedrooms, Bathrooms, Square Feet */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Bed className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="text-lg font-semibold">{property.bedrooms || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Bath className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="text-lg font-semibold">{property.bathrooms || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Square className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Square Feet</p>
                    <p className="text-lg font-semibold">
                      {property.square_feet?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right side - pricing and actions */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-sm text-muted-foreground">Monthly Rent</span>
                  <span className="text-2xl font-bold">
                    ${property.monthly_rent?.toLocaleString() || '0'}
                  </span>
                </div>
                {property.security_deposit && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Security Deposit</span>
                    <span className="font-medium">
                      ${property.security_deposit.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Date Card */}
          {property.available_date && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Available Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {new Date(property.available_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Application Card */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              {existingApplication ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
                  <p className="text-sm font-medium text-green-800">✓ Application Submitted</p>
                  <p className="text-xs text-green-700 mt-1 capitalize">
                    Status: {existingApplication.status}
                  </p>
                </div>
              ) : (
                <Button 
                  asChild 
                  className="w-full" 
                  disabled={!isAvailable}
                >
                  <Link href={`/renters/dashboard/properties/${property.id}/apply`}>
                    Apply Now
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Contact the landlord for more information about this property.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

