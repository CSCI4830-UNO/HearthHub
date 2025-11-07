import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Test 1: Check if client was created
    if (!supabase) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to create Supabase client" 
        },
        { status: 500 }
      );
    }

    // Test 2: Try to fetch current user (tests auth)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Test 3: Try a simple database query (tests database connection)
    // This queries the auth.users table metadata
    const { data: dbTest, error: dbError } = await supabase
      .from('user') // Replace with an actual table name from your schema
      .select('first_name') // Replace with an actual column name
      .limit(1);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        clientCreated: true,
        auth: {
          working: !userError,
          authenticated: !!user,
          userId: user?.id || null,
          error: userError?.message || null
        },
        database: {
          working: !dbError,
          error: dbError?.message || null,
          note: dbError?.message?.includes('relation') 
            ? "Table 'users' not found - update with your actual table name"
            : null
        }
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}