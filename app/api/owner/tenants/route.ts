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
      .from('property')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone_number,
      `)
      .eq('id', authUser.id)
      .single();
      }
      catch (err) {
    console.error("Unhandled error in owner/tenants GET:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}



/*-- Assuming you have a lease table (not shown in schema) that links tenants to properties
SELECT 
  u.first_name || ' ' || u.last_name AS tenant_name,
  u.email,
  u.phone_number,
  t.id AS tenant_id,
  p.name AS property_name,
  p.monthly_rent,
  l.move_in_date,
  l.lease_end_date,
  l.status -- 'current', 'paid', etc.
FROM public.tenant t
JOIN public.user u ON t.id = u.id
JOIN public.lease l ON l.tenant_id = t.id  -- You'll need to create this table
JOIN public.property p ON l.property_id = p.id
WHERE t.id = $1  -- Replace with the specific tenant ID
  AND l.status = 'current';*/