import { RentalApplicationForm } from "@/components/rental-application-form";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Building2, ArrowLeft, MapPin, DollarSign, Bed, Bath } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplyPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Convert property ID to number and fetch property details
  const propertyId = parseInt(id, 10);
  
  if (isNaN(propertyId)) {
    notFound();
  }

  // Fetch property details
  const { data: property, error } = await supabase
    .from('property')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error || !property) {
    notFound();
  }

  // Check if property is available
  const isAvailable = ['Available', 'available', 'Vacant', 'vacant'].includes(property.status);

  // Check if user already applied for this property
  const { data: existingApplication } = await supabase
    .from('rental_applications')
    .select('id, status')
    .eq('property_id', propertyId)
    .eq('user_id', user.id)
    .single();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/renters/dashboard/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Apply for Property</h1>
          <p className="text-muted-foreground">
            Complete the application form below
          </p>
        </div>
      </div>

      {/* Property Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{property.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {property.address}
              </CardDescription>
            </div>
            <Badge variant={isAvailable ? "default" : "secondary"}>
              {property.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <p className="font-semibold">${property.monthly_rent?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="font-semibold">{property.bedrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Application Warning */}
      {existingApplication && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  You already have an application for this property
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Status: <span className="font-medium capitalize">{existingApplication.status}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Not Available Warning */}
      {!isAvailable && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardContent className="pt-6">
            <p className="text-orange-900 dark:text-orange-100">
              This property is currently not available for applications.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Application Form */}
      <RentalApplicationForm 
        propertyId={propertyId.toString()} 
        disabled={!isAvailable || !!existingApplication}
      />
    </div>
  );
}

