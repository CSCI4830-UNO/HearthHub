import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
  }
  catch (error) {
    console.log("Error creating Supabase client:", error);
  }
}
