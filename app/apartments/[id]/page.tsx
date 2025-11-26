import CheckoutForm from '../../../components/checkout'
//import { stripe } from '../../../lib/stripe'


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

export function depositFee(a: number, b: number) 
{

  let deposit = a * b;
  deposit = deposit + a;
  return deposit
}

export default async function IndexPage() {

  const calculatePaymentAmount = (propertyId) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let totalPayment;
    let firstRentPayment;

    // Deposit percentage
    const depositPercentage = .4

    // rent payment
    const rentPayment = 2300;

    // late payment fee
    const latePaymentFee = 200;

    firstRentPayment = depositFee(rentPayment, depositPercentage);
    totalPayment = paymentSum(rentPayment, latePaymentFee);
    return (totalPayment);
  };


  // Create PaymentIntent as soon as the page loads
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    amount: calculatePaymentAmount([{ id: 'apartment' }]),
    currency: 'USD',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return (
    <div id="checkout">
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  )
}