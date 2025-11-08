import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {data} = await supabase.from('user').select('*');
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
