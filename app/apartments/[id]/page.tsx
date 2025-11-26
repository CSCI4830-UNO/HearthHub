import CheckoutForm from '../../../components/checkout'
import { stripe } from '../../../lib/stripe'
import { notFound } from "next/navigation";


interface PageProps 
{
  params: {
    id: string;
  };
}

export function paymentSum(a: number, b: number) 
{
  return a + b
}


export function advancedPayment(a: number, b: number) 
{
  return a * b
}

export function depositFee(a: number, b: number) 
{
  let deposit = a * b;
  deposit = deposit + a;
  return deposit
}

export function paymentIDToInt(a: string) 
{
  return parseInt(a)
}

export default async function IndexPage() 
{
  
  // Convert property ID to number and fetch property details
  const propertyId = parseInt(id, 10);
  
  if (isNaN(propertyId)) {
    notFound();
  }
  
  const isLate = false;
  const rentPayment = 2300;
  const paymentID = 2;
  const propertyID = 3;

  const calculatePaymentAmount = (propertyId: number, paymentID: number, rentPayment: number, latePayment: boolean) => {

    let totalPayment;
    propertyId;
    const depositPercentage = .4

    // late payment fee
    const latePaymentFee = 200;
    if(paymentID == 1)
      {
        totalPayment = depositFee(rentPayment, depositPercentage);
      }
    else
      {
        if(latePayment)
        {
          totalPayment = paymentSum(rentPayment, latePaymentFee);
        }
        else
        {
          totalPayment = rentPayment;
        }
      }
    
    return (totalPayment);
  };

  
  

  // Create PaymentIntent as soon as the page loads
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    amount: calculatePaymentAmount(propertyId, paymentID, rentPayment, isLate),
    currency: 'USD',
    automatic_payment_methods: 
    {
      enabled: true,
    },
  })

  return (
    <div id="checkout">
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  )
}