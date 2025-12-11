import CheckoutForm from '@/components/checkout'
import { stripe } from '@/lib/stripe'
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function IndexPage({ params }: PageProps) {
  
  const { id } = await params;
  const supabase = await createClient();
  
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      redirect("/auth/login");
    }

  const propertyId = parseInt(id, 10);

  if (isNaN(propertyId)) {
    notFound();
  }

  // Fetch property details
  const { data: property, error } = await supabase
    .from('property')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error || !property) {
    notFound();
  }

  // Fetch lease with user
  const { data: lease, error: leaseError } = await supabase
    .from('lease')
    .select(`*`)
    .eq('tenant_id', user.id)
    .eq('property_id', propertyId);

  if (leaseError) {
    console.error('Error fetching leased properties:', leaseError);
    return;
  }

  // Account for possible null values
  let userEmail: string = user.email ?? "Not Found";
  let userPhone: string = user.phone ?? "Not Found";
  let propertyName: string = property.name ?? "Not Found";
  let propertyAddress: string = property.address ?? "Not Found";

  // Aquire current month of payment and current date
  const currentDate = new Date();
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let dateName = month[currentDate.getMonth()];

  // Function compares lease move in date with current date
  function isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth();}

  // Compare lease move in date with current date
  const dateA = new Date(lease[0].move_in_date);

  // Stripe payments are penny increments, multiple by 100 to setup for Stripe
  let rentPayment = property.monthly_rent * 100
  let depositPayment = property.security_deposit * 100

  // Determine if payment is within same as current month
  const paymentWithDeposit: boolean = isSameMonth(dateA, currentDate)

  // Caluclate payment with or without deposit
  const calculatePaymentAmount = () => {
  
    // If current date is the same month as lease starts, apply deposit to payment
    if(paymentWithDeposit)
      {
        rentPayment += depositPayment
      }

    return rentPayment;
  };

  // Convert boolean to string for the metadata
  let depositBoolean: string = paymentWithDeposit.toString();

  // Create PaymentIntent as soon as the page loads
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    description: propertyName + propertyAddress,
    amount: calculatePaymentAmount(),
    currency: 'USD',
    metadata: {"Payment month:": dateName,
      "Deposit included:": depositBoolean, 
      "email:": userEmail,
      "Phone:" : userPhone,
    },
    receipt_email: userEmail,
    automatic_payment_methods: {enabled: true,},
  })

  return (
    <div id="checkout">
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  )
}