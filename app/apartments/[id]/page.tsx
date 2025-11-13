import CheckoutForm from '../../../components/checkout'
import { stripe } from '../../../lib/stripe'


interface PageProps 
{
  params: {
    id: string;
  };
}


export default async function IndexPage() {

  const calculateOrderAmount = (propertyId) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 230000;
  };


  // Create PaymentIntent as soon as the page loads
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    amount: calculateOrderAmount([{ id: 'apartment' }]),
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