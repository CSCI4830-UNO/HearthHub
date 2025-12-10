import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: renterData } = await supabase
      .from("user")
      .select("email, first_name, last_name")
      .eq("id", user.id)
      .single();

    const { propertyId, subject, message, landlordEmail } = await request.json();

    if (!propertyId || !subject || !message || !landlordEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: property } = await supabase
      .from("property")
      .select("name, address")
      .eq("id", propertyId)
      .single();

    // Send to landlord
    await resend.emails.send({
      from: "HearthHub <onboarding@resend.dev>",
      to: "github@dadelarsen.com",
      subject: `New Message from ${renterData?.first_name} - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>New Message from Tenant</h2>
          <p><strong>Property:</strong> ${property?.name}</p>
          <p><strong>From:</strong> ${renterData?.first_name} ${renterData?.last_name}</p>
          <p><strong>Contact:</strong> ${renterData?.email}</p>
          <hr>
          <h3>${subject}</h3>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    // Send confirmation to renter
    await resend.emails.send({
      from: "HearthHub <onboarding@resend.dev>",
      to: "github@dadelarsen.com",
      subject: "Message Sent - HearthHub",
      html: `
        <p>Your message has been sent to your landlord.</p>
        <p>They will get back to you soon.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}