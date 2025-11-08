import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.schema('public').from('user').select('*');

    if (error) {
      console.log("Error fetching users:", error);
    }

    console.log(data);
    return NextResponse.json({ message: data }, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
  }
  catch (error) {
    console.log("Error creating Supabase client:", error);
  }
  
  
}
