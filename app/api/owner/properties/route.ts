import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    const body = await request.json();
    // Update property in database
    const { data: updatedProperty, error: propertyError } = await supabase
      .from('property')
      .upsert({
        basic_information: {
            name: body.name, 
            address: body.address, 
            city: body.city, 
            state: body.state, 
            zipCode: body.zipCode
        },
        property_details: {
            type: body.propertyType,
            bedrooms: body.bedrooms,
            bathrooms: body.bathrooms,
            squareFeet: body.squareFeet
        },
        rental_information: {
            monthlyRent: body.monthlyRent,
            deposit: body.deposit,
            availableDate: body.availableDate
        },
        description: body.description,
        owner_id: authUser.id
      })
      .eq('id', body.id)
      .select();

    if (propertyError) {
      console.error('Error updating property:', propertyError);
      return NextResponse.json(
        { error: "Failed to update property data", details: propertyError.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Property updated successfully", data: updatedProperty },
      { status: 200 }
    );
} catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}