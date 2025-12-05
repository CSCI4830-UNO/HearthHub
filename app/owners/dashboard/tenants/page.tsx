import { Users, Mail, Phone, Calendar, DollarSign, AlertCircle, CheckCircle2, Building2, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TenantsPage() {
  const supabase = await createClient();

  // Get current user (owner)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // First, get all properties owned by this landlord
  // Need to know which properties belong to this owner so we can find tenants for those properties
  const { data: properties, error: propertiesError } = await supabase
    .from('property')
    .select('id')
    .eq('landlord_id', user.id);

  if (propertiesError) {
    console.error('Error fetching properties:', propertiesError);
  }

  // Extract just the property IDs into an array
  const propertyIds = (properties || []).map(p => p.id);

  // If no properties, show empty state
  if (propertyIds.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-muted-foreground">
            Manage your tenants and rental agreements
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create a property and approve applications to start managing tenants
            </p>
            <Button asChild>
              <Link href="/owners/dashboard/properties/create">Create Property</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get all leases for properties owned by this landlord
  // The relationship is: lease.tenant_id -> tenant.id, and tenant.id = user.id
  // So tenant_id in lease table matches both tenant.id and user.id
  const { data: leases, error: leasesError } = await supabase
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
    .in('property_id', propertyIds) // Only get leases for properties this owner owns
    .eq('status', 'current') // Only show current/active leases
    .order('move_in_date', { ascending: false }); // Show newest move-ins first

  if (leasesError) {
    console.error('Error fetching leases:', leasesError);
  }

  // Debug: Log the first lease to see what data structure we're getting
  if (leases && leases.length > 0) {
    console.log('Sample lease data:', JSON.stringify(leases[0], null, 2));
  }

  // Get unique tenant IDs from leases
  // Since tenant.id = user.id, we can query user table directly using tenant_id
  const tenantIds = [...new Set((leases || []).map(l => l.tenant_id))];

  // Get user information for all tenants
  // Since tenant.id = user.id, we can query user table directly with tenant_id values
  let tenantUsers: any[] = [];
  if (tenantIds.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from('user')
      .select('id, first_name, last_name, email, phone_number')
      .in('id', tenantIds); // tenant.id = user.id, so tenant_id matches user.id

    if (usersError) {
      console.error('Error fetching tenant users:', usersError);
    } else {
      tenantUsers = users || [];
    }
  }

  // Also try to get phone from rental_applications if not in user table
  // Sometimes phone number might be in the application but not in user table
  // Note: rental_applications uses user_id, and since tenant.id = user.id, tenant_id = user_id
  const { data: applications, error: appsError } = await supabase
    .from('rental_applications')
    .select('user_id, phone, email')
    .in('user_id', tenantIds);

  if (appsError) {
    console.error('Error fetching applications for phone numbers:', appsError);
  }

  // Create a map of tenant info (combining user table and application data)
  // Using a Map makes it easy to look up tenant info by ID later
  const tenantInfoMap = new Map();
  
  // First, add data from the user table
  // Since tenant.id = user.id, we can use tenant_id as the key
  tenantUsers.forEach(user => {
    tenantInfoMap.set(user.id, {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone_number || '',
    });
  });

  // Then, add/update with application data (for phone and email if missing from user table)
  // This fills in gaps - if phone isn't in user table, try to get it from application
  // Note: tenant.id = user.id, so tenant_id from lease matches user_id in applications
  (applications || []).forEach(app => {
    const existing = tenantInfoMap.get(app.user_id) || {};
    tenantInfoMap.set(app.user_id, {
      ...existing,
      email: existing.email || app.email || '', // Use application email if user table doesn't have it
      phone: existing.phone || app.phone || '', // Use application phone if user table doesn't have it
    });
  });

  // Combine lease data with tenant and property info
  // This is where we put everything together into one object for each tenant
  const tenantsWithDetails = (leases || []).map(lease => {
    // Get tenant info from our map
    const tenantInfo = tenantInfoMap.get(lease.tenant_id) || {};
    const property = lease.property as any;

    // Get dates from lease - make sure they exist and are valid
    const moveInDateStr = lease.move_in_date;
    const leaseEndDateStr = lease.lease_end_date;

    // Helper function to parse date without timezone issues
    // If the date is in YYYY-MM-DD format, parse it as local date to avoid timezone shifts
    const parseLocalDate = (dateStr: string) => {
      if (!dateStr) return null;
      // If it's already in YYYY-MM-DD format, parse it as local date
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
      }
      // Otherwise, parse normally
      return new Date(dateStr);
    };

    // Calculate days until lease ends
    // This helps show if a lease is expiring soon
    // Make sure the date exists before trying to create a Date object
    let daysUntilEnd = 0;
    if (leaseEndDateStr) {
      const leaseEndDate = parseLocalDate(leaseEndDateStr);
      const today = new Date();
      // Set today to midnight to avoid time-of-day affecting the calculation
      today.setHours(0, 0, 0, 0);
      // Calculate difference in milliseconds, then convert to days
      // Check if date is valid first
      if (leaseEndDate && !isNaN(leaseEndDate.getTime())) {
        leaseEndDate.setHours(0, 0, 0, 0); // Set to midnight for accurate day calculation
        daysUntilEnd = Math.ceil((leaseEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    // Determine payment/lease status (simplified - you can enhance this with actual payment data)
    // For now, we'll check if lease is expiring soon or if it's already expired
    // TODO: Add actual payment tracking to show if rent is overdue
    let paymentStatus = 'paid'; // Default - assume paid if lease is active
    if (daysUntilEnd < 30 && daysUntilEnd > 0) {
      paymentStatus = 'expiring_soon'; // Lease ends in less than 30 days
    } else if (daysUntilEnd < 0) {
      paymentStatus = 'expired'; // Lease has already ended
    }

    return {
      leaseId: lease.id,
      tenantId: lease.tenant_id,
      name: `${tenantInfo.first_name || ''} ${tenantInfo.last_name || ''}`.trim() || 'Unknown Tenant',
      email: tenantInfo.email || 'No email',
      phone: tenantInfo.phone || 'No phone',
      propertyId: property?.id,
      propertyName: property?.name || 'Unknown Property',
      propertyAddress: property?.address || '',
      propertyType: property?.property_type || '',
      moveInDate: moveInDateStr || '', // Store the raw date string
      leaseEndDate: leaseEndDateStr || '', // Store the raw date string
      monthlyRent: lease.monthly_rent,
      securityDeposit: lease.security_deposit,
      status: lease.status,
      daysUntilEnd,
      paymentStatus,
    };
  });

  // Calculate stats from real data
  const totalTenants = tenantsWithDetails.length;
  const currentTenants = tenantsWithDetails.filter(t => t.status === 'current').length;
  const overduePayments = tenantsWithDetails.filter(t => t.paymentStatus === 'overdue').length;
  const expiringSoon = tenantsWithDetails.filter(t => t.paymentStatus === 'expiring_soon').length;
  const totalMonthlyRent = tenantsWithDetails
    .filter(t => t.status === 'current')
    .reduce((sum, t) => sum + (t.monthlyRent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tenants</h1>
        <p className="text-muted-foreground">
          Manage your tenants and rental agreements
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tenants</CardDescription>
            <CardTitle className="text-2xl">{totalTenants}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Tenants</CardDescription>
            <CardTitle className="text-2xl text-green-600">{currentTenants}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Leases Expiring Soon</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{expiringSoon}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Rent Collected</CardDescription>
            <CardTitle className="text-2xl">${totalMonthlyRent.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search - TODO: Implement search functionality */}
      <Card>
        <CardHeader>
          <CardTitle>Search Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, phone, or property..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tenants List */}
      {tenantsWithDetails.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tenants yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Approve rental applications to start managing tenants
            </p>
            <Button asChild>
              <Link href="/owners/dashboard/applications">View Applications</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tenantsWithDetails.map((tenant) => (
            <Card key={tenant.leaseId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{tenant.name}</h3>
                      <Badge variant={tenant.status === "current" ? "default" : "secondary"}>
                        {tenant.status}
                      </Badge>
                      {tenant.paymentStatus === 'expiring_soon' && (
                        <Badge variant="outline" className="border-orange-500 text-orange-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Expiring Soon
                        </Badge>
                      )}
                      {tenant.paymentStatus === 'expired' && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Expired
                        </Badge>
                      )}
                      {tenant.paymentStatus === 'paid' && tenant.daysUntilEnd > 30 && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {tenant.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {tenant.phone}
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Property:</span>
                          <span className="font-medium">{tenant.propertyName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">
                          {tenant.propertyAddress}
                        </div>
                        {tenant.propertyType && (
                          <div className="text-xs text-muted-foreground ml-6">
                            {tenant.propertyType}
                          </div>
                        )}
                      </div>

                      {/* Lease Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Monthly Rent:</span>
                          <span className="font-bold">${tenant.monthlyRent?.toLocaleString() || '0'}</span>
                        </div>
                        {tenant.securityDeposit && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Security Deposit:</span>
                            <span className="font-medium">${tenant.securityDeposit.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Move-in:</span>
                          <span>
                            {tenant.moveInDate 
                              ? (() => {
                                  // Parse date as local to avoid timezone issues
                                  const dateStr = tenant.moveInDate;
                                  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
                                    const [year, month, day] = dateStr.split('-').map(Number);
                                    const date = new Date(year, month - 1, day);
                                    return date.toLocaleDateString();
                                  }
                                  return new Date(dateStr).toLocaleDateString();
                                })()
                              : 'Not set'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Lease End:</span>
                          <span>
                            {tenant.leaseEndDate 
                              ? (() => {
                                  // Parse date as local to avoid timezone issues
                                  const dateStr = tenant.leaseEndDate;
                                  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
                                    const [year, month, day] = dateStr.split('-').map(Number);
                                    const date = new Date(year, month - 1, day);
                                    return date.toLocaleDateString();
                                  }
                                  return new Date(dateStr).toLocaleDateString();
                                })()
                              : 'Not set'}
                          </span>
                        </div>
                        {tenant.daysUntilEnd > 0 && (
                          <div className="text-xs text-muted-foreground ml-6">
                            {tenant.daysUntilEnd} days remaining
                          </div>
                        )}
                        {tenant.daysUntilEnd <= 0 && (
                          <div className="text-xs text-red-600 ml-6 font-medium">
                            Lease expired {Math.abs(tenant.daysUntilEnd)} days ago
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/owners/dashboard/tenants/${tenant.tenantId}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/owners/dashboard/messages?tenant=${tenant.tenantId}`}>
                        Message
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
