// app/api/test-db/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Simple connection test
    const { data: { user }, error } = await supabase.auth.getUser();
    
    return NextResponse.json({ 
      success: true, 
      message: '✅ Supabase connected successfully!',
      hasUser: !!user,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: '❌ Failed to connect to Supabase',
      details: error.message
    }, { status: 500 });
  }
}