import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    console.log("Received request to /api/user");

    const body = await request.json();

    return NextResponse.json({ message: "User API endpoint reached", data: body }, {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}