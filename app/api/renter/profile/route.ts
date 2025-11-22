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
    const { data: userData, error: fetchUserError } = await supabase
      .from('user')
      .select('email, first_name, last_name, phone_number')
      .eq('id', authUser.id)
      .single();

    console.log("Data from the API:", userData);

    if (fetchUserError) {
      console.error('Error fetching user:', fetchUserError);
      return NextResponse.json(
        { error: "Failed to load user data" },
        { status: 500 }
      );
    }

    const { data: tenantData, error: fetchTenantError } = await supabase
      .from("tenant")
      .select("date_of_birth, address, employment")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (fetchTenantError) {
      console.warn("Tenant fetch error:", fetchTenantError);
    }

    return NextResponse.json(
      {
        ...userData,
        ...tenantData,
        employment: tenantData?.employment || { company: "", position: "", income: 0 },
        references: tenantData?.references || []
      },
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
    const { data: updatedUser, error: userError } = await supabase
      .from('user')
      .upsert({
        first_name: body.first_name,
        last_name: body.last_name,
        phone_number: body.phone_number,
        email: body.email
      })
      .eq('id', authUser.id)
      .select();

    

    if (userError) {
      console.error('Error updating user:', userError);
      return NextResponse.json(
        { error: "Failed to update user data", details: userError.message },
        { status: 500 }
      );
    }


    const {data : updatedTenant, error: tenantError} = await supabase
      .from('tenant')
      .upsert({
        date_of_birth: body.date_of_birth, // Dade you will never live down suddenly switching from snake-Case to camelCase LOL!
        address: body.address,
        employment: body.employment
        //, references: body.references  // taking this out just for now
      })
      .eq('user_id', authUser.id)
      .select();

      if (tenantError) {
        console.error('Error updating tenant:', tenantError);
        return NextResponse.json(
          { error: "Failed to update tenant data", details: tenantError.message },
          { status: 500 }
        );
      }


    // This code is not needed but it helps you troubleshoot what is being posted to the DB
    console.log("Here is the update sent via POST:", body);
    console.log("authUser.id:", authUser.id);
    console.log("updatedUser:", updatedUser);
    console.log("userError:", userError);
    console.log("updatedTenant:", updatedTenant);
    console.log("tenantError:", tenantError);
    
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

//delete user account
export async function DELETE(request: NextRequest) {
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

    // Delete user profile from database
    const { error: deleteUserError } = await supabase
      .from('user')
      .delete()
      .eq('id', authUser.id);

    if (deleteUserError) {
      console.error('Error deleting user:', deleteUserError);
      return NextResponse.json(
        { error: "Failed to delete user data" },
        { status: 500 }
      );
    }

    const { error: deleteTenantError } = await supabase
      .from('tenant')
      .delete()
      .eq('user_id', authUser.id);

    if (deleteTenantError) {
      console.error('Error deleting tenant:', deleteTenantError);
      return NextResponse.json(
        { error: "Failed to delete tenant data" },
        { status: 500 }
      );
    }

    // This code is necessary to sign the user out to prevent stale cookies form leaving the user in site
    await supabase.auth.admin.deleteUser(authUser.id)
    await supabase.auth.signOut();
    //console.log("authUser.id:", authUser.id);
    //console.log("updatedUser:", deleteError);
    
    return NextResponse.json(
      { message: "User deleted successfully" },
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