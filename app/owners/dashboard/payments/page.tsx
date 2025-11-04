import { DollarSign, CheckCircle2, AlertCircle, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock payments data
const payments = [
  {
    id: 1,
    tenant: "John Doe",
    property: "Sunset Apartments - Unit 101",
    amount: 2500,
    dueDate: "2024-11-01",
    paidDate: "2024-10-28",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: 2,
    tenant: "Jane Smith",
    property: "Downtown Loft",
    amount: 3200,
    dueDate: "2024-11-01",
    paidDate: null,
    status: "overdue",
    method: null,
  },
  {
    id: 3,
    tenant: "Mike Johnson",
    property: "Riverside Condo - Unit 205",
    amount: 2800,
    dueDate: "2024-11-01",
    paidDate: "2024-10-30",
    status: "paid",
    method: "Credit Card",
  },
  {
    id: 4,
    tenant: "Sarah Williams",
    property: "Garden View Suite",
    amount: 4500,
    dueDate: "2024-12-01",
    paidDate: null,
    status: "pending",
    method: null,
  },
];

export default function PaymentsPage() {
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
            <CardDescription>Total Paid (This Month)</CardDescription>
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
            <CardDescription>Expected This Month</CardDescription>
            <CardTitle className="text-2xl">
              ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
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
                      Send Reminder
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

