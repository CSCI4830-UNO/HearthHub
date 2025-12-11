import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: landlordEmail,
      subject: `New Message from ${renterData?.first_name} - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>New Message from Tenant</h2>
          <p><strong>Property:</strong> ${property?.name}</p>
          <p><strong>Address:</strong> ${property?.address}</p>
          <p><strong>From:</strong> ${renterData?.first_name} ${renterData?.last_name}</p>
          <p><strong>Contact:</strong> <a href="mailto:${renterData?.email}">${renterData?.email}</a></p>
          <hr>
          <h3>Subject: ${subject}</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    });

    // Send confirmation to renter
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: renterData?.email,
      subject: "Message Sent - HearthHub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Message Sent Successfully</h2>
          <p>Your message about <strong>${property?.name}</strong> has been sent to your landlord.</p>
          <p>They will get back to you as soon as possible.</p>
          <hr>
          <h3>Your Message:</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
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