import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();
        
        // Check if user exists
        const { data: existingUser, error: searchError } = await supabase
            .from('user')
            .select('*')
            .eq('id', body.id)
            .maybeSingle();

        console.log('Search result:', { existingUser, searchError });

        if (searchError && searchError.code !== 'PGNF') {
            return NextResponse.json(
                { error: 'Error checking user existence' },
                { status: 500 }
            );
        }

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists", data: existingUser },
                { status: 200 }
            );
        }

        // Create new user if doesn't exist
        const { data: newUser, error: insertError } = await supabase
            .from('user')
            .insert({
                email: body.email,
                first_name: body.firstName,
                last_name: body.lastName,
            });
            

        if (insertError) {
            return NextResponse.json(
                { error: 'Error creating new user' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "User created successfully", data: newUser },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}