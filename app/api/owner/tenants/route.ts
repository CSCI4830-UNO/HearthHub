import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();  

    // Get current authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    // Fetch tenants info for each property associated with the owner
    const { data, error } = await supabase
    
      .from('lease')
      .select(`
        move_in_date,
        lease_end_date,
        monthly_rent,
        security_deposit,
        status,
        property:property_id (
          name, 
          address, 
          property_type
        ),
        user:tenant_id (
            email,
            first_name,
            last_name, 
            phone_number
        )
      `)
      .eq('landlord_id', authUser.id)

    if (error) {
      console.error("Unhandled error in owner/tenants GET:", error);
      return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
    }
    return NextResponse.json(data);
  }
  catch (err) {
    console.error("Unhandled error in owner/tenants GET:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}



// select public.lease.move_in_date, public.lease.lease_end_date, public.lease.monthly_rent, public.lease.status, public.property.name, public.user.email, public.user.first_name, public.user.last_name
// FROM public.lease
// INNER JOIN public.tenant ON public.lease.tenant_id = public.tenant.id
// INNER JOIN public.user ON public.tenant.id = public.user.id
// INNER JOIN public.property ON public.lease.property_id = public.property.id;