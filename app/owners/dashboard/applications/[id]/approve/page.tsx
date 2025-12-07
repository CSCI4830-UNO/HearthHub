"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Building2, User, Calendar, DollarSign, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ApproveApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state for lease details
  const [formData, setFormData] = useState({
    move_in_date: "",
    lease_end_date: "",
    monthly_rent: "",
    security_deposit: "",
  });
  
  // Store tenant_id and property_id from application (not shown in form)
  const [tenantId, setTenantId] = useState<string>("");
  const [propertyId, setPropertyId] = useState<number | null>(null);
  
  // Application details for display
  const [application, setApplication] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);

  // Fetch application details when page loads
  useEffect(() => {
    if (!applicationId) return;
    
    const fetchApplication = async () => {
      setIsFetching(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        // Get the application with user_id, property_id, move_in_date, and property details
        const { data: appData, error: appError } = await supabase
          .from('rental_applications')
          .select(`
            id,
            user_id,
            property_id,
            first_name,
            last_name,
            email,
            move_in_date,
            property:property_id (
              id,
              name,
              address,
              monthly_rent,
              security_deposit
            )
          `)
          .eq('id', Number(applicationId))
          .single();

        if (appError) {
          setError(appError.message);
          setIsFetching(false);
          return;
        }

        if (!appData) {
          setError("Application not found");
          setIsFetching(false);
          return;
        }

        // Set the application and property data
        setApplication(appData);
        setProperty(appData.property);
        
        // Automatically get tenant_id and property_id from the application
        // These are not needed from the owner - they come from the application automatically
        setTenantId(appData.user_id || "");
        setPropertyId(appData.property_id || null);
        
        // Pre-fill the form with available data
        // Format move_in_date from application if it exists
        let moveInDate = "";
        if (appData.move_in_date) {
          // Convert to YYYY-MM-DD format for date input
          moveInDate = new Date(appData.move_in_date).toISOString().split('T')[0];
        }
        
        // Pre-fill monthly_rent and security_deposit from property if available
        const propertyData = Array.isArray(appData.property) ? appData.property[0] : appData.property;
        setFormData({
          move_in_date: moveInDate,
          lease_end_date: "", // Owner needs to set this
          monthly_rent: propertyData?.monthly_rent?.toString() || "",
          security_deposit: propertyData?.security_deposit?.toString() || "",
        });
        
        setIsFetching(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsFetching(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Helper function to calculate lease end date (1 year from move-in date)
  const calculateLeaseEndDate = (moveInDate: string) => {
    if (!moveInDate) return "";
    const date = new Date(moveInDate);
    date.setFullYear(date.getFullYear() + 1); // Add 1 year
    return date.toISOString().split('T')[0];
  };
  
  // Auto-calculate lease end date when move-in date changes
  const handleMoveInDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      move_in_date: value,
      // Auto-fill lease end date if it's empty (1 year from move-in)
      lease_end_date: prev.lease_end_date || calculateLeaseEndDate(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.move_in_date || !formData.lease_end_date) {
      setError("Move-in date and lease end date are required");
      return;
    }
    
    if (!formData.monthly_rent) {
      setError("Monthly rent is required");
      return;
    }
    
    // tenant_id and property_id are automatically pulled from the application
    // No need to validate them - they're always available from the application data

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Get current user to verify they're the owner
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Verify the property belongs to this owner
      const { data: propertyData, error: propError } = await supabase
        .from('property')
        .select('landlord_id')
        .eq('id', propertyId)
        .single();

      if (propError || !propertyData) {
        throw new Error("Property not found");
      }

      if (propertyData.landlord_id !== user.id) {
        throw new Error("You don't have permission to approve applications for this property");
      }

      // Update the application status to approved
      const { error: updateError } = await supabase
        .from('rental_applications')
        .update({ status: 'approved' })
        .eq('id', Number(applicationId));

      if (updateError) {
        throw new Error(`Failed to update application: ${updateError.message}`);
      }

      // Create the lease using the API endpoint
      // tenant_id and property_id are automatically included from the application
      // Owner only needs to provide the lease details (dates, rent, deposit)
      const response = await fetch('/api/owner/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId, // Automatically from application.user_id
          property_id: propertyId, // Automatically from application.property_id
          move_in_date: formData.move_in_date,
          lease_end_date: formData.lease_end_date,
          monthly_rent: parseFloat(formData.monthly_rent),
          security_deposit: formData.security_deposit ? parseFloat(formData.security_deposit) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lease');
      }

      setSuccess(true);
      
      // Redirect back to applications page after 2 seconds
      setTimeout(() => {
        router.push('/owners/dashboard/applications');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!applicationId) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-destructive">No application ID provided.</p>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto">
        <p>Loading application...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
              <h3 className="text-2xl font-bold">Application Approved!</h3>
              <p className="text-muted-foreground">
                The lease has been created successfully. Redirecting to applications page...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/owners/dashboard/applications">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Approve Application</h1>
          <p className="text-muted-foreground">
            Set up lease details for the approved application
          </p>
        </div>
      </div>

      {/* Application Info Card */}
      {application && (
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Applicant</p>
                  <p className="font-semibold">
                    {application.first_name} {application.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{application.email}</p>
                </div>
              </div>
              {property && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-semibold">{property.name}</p>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Lease Setup</CardTitle>
          <CardDescription>
            Enter the lease details for the approved application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="move_in_date">Move-In Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="move_in_date"
                    name="move_in_date"
                    type="date"
                    required
                    value={formData.move_in_date}
                    onChange={handleMoveInDateChange}
                    className="bg-background text-foreground pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  When the tenant will move in (pre-filled from application if available)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lease_end_date">Lease End Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lease_end_date"
                    name="lease_end_date"
                    type="date"
                    required
                    value={formData.lease_end_date}
                    onChange={handleInputChange}
                    className="bg-background text-foreground pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  When the lease will end (auto-filled as 1 year from move-in if empty)
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthly_rent">Monthly Rent ($) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="monthly_rent"
                    name="monthly_rent"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.monthly_rent}
                    onChange={handleInputChange}
                    placeholder="2500.00"
                    className="bg-background text-foreground pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly rent amount (pre-filled from property if available)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="security_deposit">Security Deposit ($)</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="security_deposit"
                    name="security_deposit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.security_deposit}
                    onChange={handleInputChange}
                    placeholder="2500.00"
                    className="bg-background text-foreground pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Security deposit amount (optional, pre-filled from property if available)
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={isLoading}
              >
                <Link href="/owners/dashboard/applications">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Approving..." : "Approve & Create Lease"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

