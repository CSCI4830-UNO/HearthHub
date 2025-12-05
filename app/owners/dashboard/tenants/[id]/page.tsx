import { ArrowLeft, User, Mail, Phone, Calendar, DollarSign, Building2, Briefcase, Shield, FileText, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TenantDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user (owner)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Get all properties owned by this landlord to verify access
  const { data: properties, error: propertiesError } = await supabase
    .from('property')
    .select('id')
    .eq('landlord_id', user.id);

  if (propertiesError) {
    console.error('Error fetching properties:', propertiesError);
  }

  const propertyIds = (properties || []).map(p => p.id);

  // Get the lease for this tenant
  const { data: lease, error: leaseError } = await supabase
    .from('lease')
    .select(`
      id,
      tenant_id,
      property_id,
      move_in_date,
      lease_end_date,
      monthly_rent,
      security_deposit,
      status,
      created_at,
      property:property_id (
        id,
        name,
        address,
        property_type
      )
    `)
    .eq('tenant_id', id)
    .in('property_id', propertyIds.length > 0 ? propertyIds : [-1]) // Only if owner has properties
    .eq('status', 'current')
    .maybeSingle();

  if (leaseError) {
    console.error('Error fetching lease:', leaseError);
  }

  // If no lease found, redirect or show error
  if (!lease) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/owners/dashboard/tenants">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tenant Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              This tenant does not have an active lease with your properties.
            </p>
            <Button asChild>
              <Link href="/owners/dashboard/tenants">Back to Tenants</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get the rental application for this tenant and property
  const { data: application, error: appError } = await supabase
    .from('rental_applications')
    .select('*')
    .eq('user_id', id)
    .eq('property_id', lease.property_id)
    .eq('status', 'approved')
    .order('applied_date', { ascending: false })
    .maybeSingle();

  if (appError) {
    console.error('Error fetching application:', appError);
  }

  // Get user information
  const { data: userData, error: userError } = await supabase
    .from('user')
    .select('first_name, last_name, email, phone_number')
    .eq('id', id)
    .maybeSingle();

  if (userError) {
    console.error('Error fetching user data:', userError);
  }

  // Helper function to format dates
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not provided';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate lease days remaining
  const calculateDaysRemaining = (leaseEndDate: string | null) => {
    if (!leaseEndDate) return null;
    const dateStr = leaseEndDate;
    let leaseEnd: Date;
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      leaseEnd = new Date(year, month - 1, day);
    } else {
      leaseEnd = new Date(dateStr);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    leaseEnd.setHours(0, 0, 0, 0);
    const diffTime = leaseEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining(lease.lease_end_date);
  const property = lease.property as any;

  // Combine data sources - prefer application data, fall back to user data
  const tenantName = application 
    ? `${application.first_name || ''} ${application.last_name || ''}`.trim()
    : userData 
    ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
    : 'Unknown Tenant';

  const tenantEmail = application?.email || userData?.email || 'No email';
  const tenantPhone = application?.phone || userData?.phone_number || 'No phone';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/owners/dashboard/tenants">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{tenantName}</h1>
            <p className="text-muted-foreground">Tenant Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30 && (
            <Badge variant="outline" className="border-orange-500 text-orange-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              Lease Expiring Soon
            </Badge>
          )}
          {daysRemaining !== null && daysRemaining <= 0 && (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Lease Expired
            </Badge>
          )}
          {daysRemaining !== null && daysRemaining > 30 && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active Lease
            </Badge>
          )}
          <Button asChild variant="outline">
            <Link href={`/owners/dashboard/messages?tenant=${id}`}>
              Message Tenant
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{tenantName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium">{tenantEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </p>
                <p className="font-medium">{tenantPhone}</p>
              </div>
              {application?.date_of_birth && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </p>
                  <p className="font-medium">{formatDate(application.date_of_birth)}</p>
                </div>
              )}
              {application?.ssn && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    SSN
                  </p>
                  <p className="font-medium font-mono">***-**-{application.ssn.slice(-4)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Address */}
        {application && (application.current_street || application.current_city) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Current Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Street Address</p>
                <p className="font-medium">{application.current_street || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{application.current_city || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="font-medium">{application.current_state || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ZIP Code</p>
                <p className="font-medium">{application.current_zip || 'Not provided'}</p>
              </div>
              {application.current_monthly_rent && (
                <div>
                  <p className="text-sm text-muted-foreground">Current Monthly Rent</p>
                  <p className="font-medium">${application.current_monthly_rent.toLocaleString()}</p>
                </div>
              )}
              {application.move_out_reason && (
                <div>
                  <p className="text-sm text-muted-foreground">Reason for Moving</p>
                  <p className="font-medium">{application.move_out_reason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Employment Information */}
        {application && (application.employer_name || application.monthly_income) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.employer_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Employer</p>
                  <p className="font-medium">{application.employer_name}</p>
                </div>
              )}
              {application.job_title && (
                <div>
                  <p className="text-sm text-muted-foreground">Job Title</p>
                  <p className="font-medium">{application.job_title}</p>
                </div>
              )}
              {application.employer_phone && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Employer Phone
                  </p>
                  <p className="font-medium">{application.employer_phone}</p>
                </div>
              )}
              {application.employment_start_date && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Employment Start Date
                  </p>
                  <p className="font-medium">{formatDate(application.employment_start_date)}</p>
                </div>
              )}
              {application.monthly_income && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Monthly Income
                  </p>
                  <p className="font-medium">
                    ${application.monthly_income.toLocaleString()}/month
                    <span className="text-sm text-muted-foreground ml-2">
                      (${(application.monthly_income * 12).toLocaleString()}/year)
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact */}
        {application && (application.emergency_contact_name || application.emergency_contact_phone) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.emergency_contact_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{application.emergency_contact_name}</p>
                </div>
              )}
              {application.emergency_contact_phone && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </p>
                  <p className="font-medium">{application.emergency_contact_phone}</p>
                </div>
              )}
              {application.emergency_contact_relationship && (
                <div>
                  <p className="text-sm text-muted-foreground">Relationship</p>
                  <p className="font-medium">{application.emergency_contact_relationship}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Lease Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lease Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Move-in Date
              </p>
              <p className="font-medium">{formatDate(lease.move_in_date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Lease End Date
              </p>
              <p className="font-medium">{formatDate(lease.lease_end_date)}</p>
              {daysRemaining !== null && (
                <p className={`text-sm mt-1 ${daysRemaining <= 0 ? 'text-red-600' : daysRemaining <= 30 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {daysRemaining > 0 
                    ? `${daysRemaining} days remaining`
                    : `Expired ${Math.abs(daysRemaining)} days ago`
                  }
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Monthly Rent
              </p>
              <p className="font-medium text-lg">${lease.monthly_rent?.toLocaleString() || '0'}</p>
            </div>
            {lease.security_deposit && (
              <div>
                <p className="text-sm text-muted-foreground">Security Deposit</p>
                <p className="font-medium">${lease.security_deposit.toLocaleString()}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Lease Status</p>
              <Badge variant={lease.status === 'current' ? 'default' : 'secondary'}>
                {lease.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {property && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Property Name</p>
                  <p className="font-medium">{property.name || 'Unknown Property'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </p>
                  <p className="font-medium">{property.address || 'Not provided'}</p>
                </div>
                {property.property_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">{property.property_type}</p>
                  </div>
                )}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href={`/owners/dashboard/properties/${property.id}`}>
                    View Property Details
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        {application && (application.pets || application.vehicles || application.additional_notes) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.pets && (
                <div>
                  <p className="text-sm text-muted-foreground">Pets</p>
                  <p className="font-medium">{application.pets}</p>
                </div>
              )}
              {application.vehicles && (
                <div>
                  <p className="text-sm text-muted-foreground">Vehicles</p>
                  <p className="font-medium">{application.vehicles}</p>
                </div>
              )}
              {application.additional_notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Additional Notes</p>
                  <p className="font-medium whitespace-pre-wrap">{application.additional_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Application Details */}
        {application && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Application Date</p>
                  <p className="font-medium">{formatDate(application.applied_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Status</p>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

