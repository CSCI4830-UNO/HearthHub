import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

