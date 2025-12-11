import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    
      // Fetch applications for properties owned by this user
      // First get all properties owned by this user
      const { data: properties, error: propertiesError } = await supabase
        .from('property')
        .select('id')
        .eq('landlord_id', user.id);
    
      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
      }
    
      const propertyIds = (properties || []).map(p => p.id);


      const { data: applications, error } = await supabase
    .from('rental_applications')
    .select(`
      id,
      status,
      applied_date,
      first_name,
      last_name,
      email,
      monthly_income,
      move_in_date,
      property_id,
      property:property_id (
        id,
        name,
        address
      )
    `)
    .in('property_id', propertyIds)
    .order('applied_date', { ascending: false });

    if (error) {
    console.error('Error fetching applications:', error);
    }

    return NextResponse.json({ applications: applications || [] }, { status: 200 });
    } catch (err) {
    console.error("Unhandled error in owner/applications GET:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  } 
}


//this post is for if a specific application is approved, I will add a delete endpoint that will delete the application
// if the application is rejected
export async function POST(request: NextRequest) {
    try {
    const supabase = await createClient();
    const body = await request.json();
    
    const { data, error } = await supabase
        .from('lease')
        .insert(
            {
                tenant_id: body.tenant_id,
                property_id: body.property_id,
                move_in_date: body.move_in_date,
                lease_end_date: body.lease_end_date,
                monthly_rent: body.monthly_rent,
                security_deposit: body.security_deposit,
                status: 'current',
                landlord_id: body.landlord_id
            }
        )
        .select()
        .single();
    if (error) {
        console.error('Error creating lease:', error);
        return NextResponse.json({ error: 'Failed to create lease', details: String(error) }, { status: 500 });
    }

    return NextResponse.json({ lease: data }, { status: 201 });
    } catch (err) {
        console.error("Unhandled error in owner/applications POST:", err);
        return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
    }
}

//delete endpoint that will delete a rental application if it is rejected
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const applicationId = searchParams.get('applicationId');
        
        if (!applicationId) {
            return NextResponse.json({ error: 'applicationId is required' }, { status: 400 });
        }

        // Delete the application
        const { error } = await supabase
            .from('rental_applications')
            .delete()
            .eq('id', applicationId);
        
        if (error) {
            console.error('Error deleting application:', error);
            return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Application deleted successfully' }, { status: 200 });
        
    } catch (err) {
        console.error("Unhandled error in owner/applications DELETE:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}