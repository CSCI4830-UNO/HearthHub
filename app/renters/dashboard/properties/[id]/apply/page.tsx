import { RentalApplicationForm } from "@/components/rental-application-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  // Just use the property ID for now, will fetch property details later
  const propertyId = id;

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
      <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <p className="font-semibold">Property ID: {propertyId}</p>
          <p className="text-sm text-muted-foreground">
            Your application will be reviewed by the property owner
          </p>
        </div>
      </div>

      {/* Application Form */}
      <RentalApplicationForm propertyId={propertyId} />
    </div>
  );
}

