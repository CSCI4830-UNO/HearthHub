import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createClient();

		const url = new URL(request.url);
		const propertyId = url.searchParams.get("id");
		if (!propertyId) {
			return NextResponse.json({ error: "Missing property id (use ?id=<propertyId>)" }, { status: 400 });
		}

		const { data: property, error } = await supabase
			.from("property")
			.select("*")
			.eq("id", propertyId)
			.single();

		if (error) {
			console.error("Supabase error fetching property:", error);
			return NextResponse.json(
				{ error: "Failed to fetch property", details: String(error.message ?? error) },
				{ status: 500 }
			);
		}

		if (!property) {
			return NextResponse.json({ error: "Property not found" }, { status: 404 });
		}

		return NextResponse.json({ property }, { status: 200 });
	} catch (err) {
		console.error("Unhandled error in renter/properties GET:", err);
		return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
	}
}

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
        owner_id: authUser.id,
        images: body.images
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