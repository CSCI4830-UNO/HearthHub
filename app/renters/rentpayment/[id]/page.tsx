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

  console.log("USER: ", user)
  console.log("property: ", property)
  

  const calculatePaymentAmount = () => {

    let rentPayment = property.monthly_rent * 100
    let depositPayment = property.security_deposit * 100
    // if(newTenant)
    //   {
    //     rentPayment += depositPayment
    //   }

    return rentPayment;
  };

  let userEmail: string = user.email ?? "Not Found";
  let userPhone: string = user.phone ?? "Not Found";
  let propertyName: string = property.name ?? "Not Found";
  let propertyAddress: string = property.address ?? "Not Found";

  const currentDate = new Date();
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let dateName = month[currentDate.getMonth()];

  // Create PaymentIntent as soon as the page loads
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    description: propertyName + "\n" +propertyAddress,
    amount: calculatePaymentAmount(),
    currency: 'USD',
    metadata: {"Payment month": dateName, 
      "email": userEmail,
      "Phone" : userPhone,
    },
    receipt_email: user.email,
    
    automatic_payment_methods: {enabled: true,},
  })

  return (
    <div id="checkout">
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  )
}