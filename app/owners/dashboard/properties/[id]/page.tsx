import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { 
  Building2, 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Shield,
  Heart,
  FileText,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Make sure user is logged in before they can see property details
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // The id comes as a string from the URL, need to convert it to a number
  const propertyId = parseInt(id, 10);
  
  // If it's not a valid number, show 404 page
  if (isNaN(propertyId)) {
    notFound();
  }

  // Get all the property info from the database
  const { data: property, error } = await supabase
    .from('property')
    .select('*')
    .eq('id', propertyId)
    .single();

  // If there's an error or property doesn't exist, show 404
  if (error || !property) {
    notFound();
  }

  // Check if the property is available for applications
  // Need to check different variations because the status might be capitalized differently
  const isAvailable = ['Available', 'available', 'Vacant', 'vacant'].includes(property.status);

  // See if the user already applied to this property
  // Using maybeSingle() because they might not have applied yet
  const { data: existingApplication } = await supabase
    .from('rental_applications')
    .select('id, status')
    .eq('property_id', propertyId)
    .eq('user_id', user.id)
    .maybeSingle();

  // Make sure amenities is an array, sometimes it might be null or something else
  // TODO: Maybe add a save/favorite button later, would need to use localStorage on client side
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/owners/dashboard/properties">
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

      {/* Main layout - using grid to split into left and right columns */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left side - shows the main property info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image placeholder - would add actual images later */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
                <Building2 className="h-24 w-24 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Only show description if it exists */}
          {property.description && (
            <Card>
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Using whitespace-pre-wrap to keep line breaks from the description */}
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {property.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Show all the property details like bedrooms, bathrooms, etc. */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Split into two columns on medium screens and up */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Property type */}
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      {/* Show N/A if property type doesn't exist */}
                      <p className="font-semibold">{property.property_type || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {/* Only show square feet if it exists in the database */}
                  {property.square_feet && (
                    <div className="flex items-center gap-3">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Square Feet</p>
                        {/* toLocaleString() adds commas to numbers like 1,200 */}
                        <p className="font-semibold">{property.square_feet.toLocaleString()} sq ft</p>
                      </div>
                    </div>
                  )}
                  {/* Show available date if it exists */}
                  {property.available_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Available Date</p>
                        <p className="font-semibold">
                          {/* Format the date to look nice */}
                          {new Date(property.available_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.city && property.state && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{property.city}, {property.state}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Show amenities if there are any */}
          {amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Display each amenity as a badge */}
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right side - pricing and action buttons */}
        <div className="space-y-6">
          {/* Show the rent and deposit */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Monthly Rent</span>
                </div>
                {/* Using optional chaining (?.) in case monthly_rent is null */}
                <span className="text-2xl font-bold">
                  ${property.monthly_rent?.toLocaleString() || '0'}
                </span>
              </div>
              {/* Only show security deposit if it exists */}
              {property.security_deposit && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Security Deposit</span>
                  </div>
                  <span className="text-lg font-semibold">
                    ${property.security_deposit.toLocaleString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* The apply button and application status */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              {/* If they already applied, show the status instead of apply button */}
              {existingApplication ? (
                <>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md mb-3">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Application Submitted</p>
                      {/* capitalize() makes the first letter uppercase */}
                      <p className="text-xs text-muted-foreground capitalize">
                        Status: {existingApplication.status}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/renters/dashboard/applications/${existingApplication.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Application
                    </Link>
                  </Button>
                </>
              ) : (
                // If they haven't applied, show the apply button
                <Button 
                  asChild 
                  className="w-full" 
                  disabled={!isAvailable}
                >
                  <Link href={`/renters/dashboard/properties/${propertyId}/apply`}>
                    Apply Now
                  </Link>
                </Button>
              )}
              {/* Show message if property isn't available and they haven't applied */}
              {!isAvailable && !existingApplication && (
                <p className="text-xs text-muted-foreground text-center">
                  This property is not currently accepting applications
                </p>
              )}
            </CardContent>
          </Card>

          {/* Just some extra info about the property */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property ID</span>
                <span className="font-medium">#{property.id}</span>
              </div>
              {property.created_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed</span>
                  <span className="font-medium">
                    {new Date(property.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

