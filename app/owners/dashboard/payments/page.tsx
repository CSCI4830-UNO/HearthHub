import { DollarSign, CheckCircle2, AlertCircle, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

const payments = [
  {
    id: 1,
    tenant: "John Doe",
    email: "JohnD578@hotmail.com",
    property: "The Duke Omaha Apartments",
    amount: 2000,
    dueDate: "2025-12-01",
    paidDate: "2025-12-05",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: 2,
    tenant: "Jane Smith",
    email: "JaneS8765@hotmail.com",
    property: "Dundee Flats",
    amount: 1000,
    dueDate: "2025-11-01",
    paidDate: null,
    status: "overdue",
    method: null,
  },
  // {
  //   id: 3,
  //   tenant: "Mike Johnson",
  //   property: "The Duo",
  //   amount: 1500,
  //   dueDate: "2025-11-01",
  //   paidDate: "2025-10-30",
  //   status: "paid",
  //   method: "Credit Card",
  // },
  // {
  //   id: 4,
  //   tenant: "Sarah Williams",
  //   property: "Juniper Rows",
  //   amount: 2300,
  //   dueDate: "2025-12-01",
  //   paidDate: null,
  //   status: "pending",
  //   method: null,
  // },
];

export default async function PaymentsPage() {
  
  const supabase = await createClient();
    
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch properties for this landlord
  const { data: properties, error } = await supabase
    .from('property')
    .select('*')
    .eq('landlord_id', user.id);

  if (error) {
  console.error('Error fetching properties:', error);
  }

  
  
  // Add all monthly payment amounts for total expected for the month
  let totalToBePaid = 0;
  if(properties != null)
    {
      for(let i = 0; i < properties.length; i++)
        {
          totalToBePaid += properties[i].monthly_rent;
        }
    }

  
  
  // Aquire current month of payment and current date
  const currentDate = new Date();
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let monthName = month[currentDate.getMonth()];

  const expectedPaid = totalToBePaid;
  const totalPaid = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Track rent payments and manage finances
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Paid For {monthName}</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              ${totalPaid.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Payments</CardDescription>
            <CardTitle className="text-2xl text-orange-600">
              ${totalPending.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue Payments</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              ${totalOverdue.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expected For {monthName}</CardDescription>
            <CardTitle className="text-2xl">
              ${expectedPaid.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Payment history and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{payment.tenant}</h3>
                    <Badge
                      variant={
                        payment.status === "paid"
                          ? "default"
                          : payment.status === "overdue"
                          ? "destructive"
                          : "secondary"
                      }
                      className="flex items-center gap-1"
                    >
                      {payment.status === "paid" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Paid
                        </>
                      ) : payment.status === "overdue" ? (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          Overdue
                        </>
                      ) : (
                        "Pending"
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {payment.property}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </span>
                    {payment.paidDate && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Paid: {new Date(payment.paidDate).toLocaleDateString()}
                      </span>
                    )}
                    {payment.method && (
                      <span>Method: {payment.method}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${payment.amount.toLocaleString()}</div>
                  {payment.status === "overdue" && (
                    <Button variant="outline" size="sm" className="mt-2">
                      <Link href="/renters/dashboard/messages">Send Reminder</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

