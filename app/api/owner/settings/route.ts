import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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

    // Fetch user profile from database
    const { data: userData, error: fetchError } = await supabase
      .from('user')
      .select('email, first_name, last_name, phone_number')
      .eq('id', authUser.id)
      .single();

    if (fetchError) {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json(
        { error: "Failed to load user data" },
        { status: 500 }
      );
    }

    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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

    // Validate input
    if (!body?.first_name && !body?.last_name && !body?.phone_number && !body?.email) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Update user data
    const { data: updatedUser, error: updateError } = await supabase
      .from('user')
      .upsert({
        first_name: body.first_name,
        last_name: body.last_name,
        phone_number: body.phone_number,
        email: body.email
      })
      .eq('id', authUser.id)
      .select();

    // This code is not needed but it helps you troubleshoot what is being posted to the DB
    console.log("Here is the update sent via POST:", body);
    console.log("authUser.id:", authUser.id);
    console.log("updatedUser:", updatedUser);
    console.log("updateError:", updateError);

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: "Failed to update user data", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully", data: updatedUser },
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