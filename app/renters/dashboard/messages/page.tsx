"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";

interface Tenant {
  id: string;
  property_id: number;
  property_name: string;
  landlord_email: string;
  landlord_name: string;
  lease_status: string;
}

export default function MessagesPage() {
  const [tenancies, setTenancies] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenancy, setSelectedTenancy] = useState<Tenant | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenancies = async () => {
      try {
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get all leases where user is a tenant
        const { data: leases } = await supabase
          .from("lease")
          .select(`
            id,
            property_id,
            status,
            landlord_id,
            user:landlord_id(
              id,
              first_name,
              last_name,
              email
            ),
            property:property_id(
              id,
              name
            )
          `)
          .eq("tenant_id", user.id);

        if (leases) {
          const formattedTenancies = leases.map((lease: any) => ({
            id: lease.id,
            property_id: lease.property_id,
            property_name: lease.property?.name || "Unknown Property",
            landlord_email: lease.user?.email,
            landlord_name: `${lease.user?.first_name} ${lease.user?.last_name}`,
            lease_status: lease.status,
          }));
          setTenancies(formattedTenancies);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching tenancies:", err);
        setLoading(false);
      }
    };

    fetchTenancies();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenancy) return;

    setSendLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/renter/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          propertyId: selectedTenancy.property_id,
          subject,
          message,
          landlordEmail: selectedTenancy.landlord_email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSubject("");
        setMessage("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSendLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-2">Contact your landlords</p>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (tenancies.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-2">Contact your landlords</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                You don't have any active leases yet. Once you sign a lease, you'll be able to contact your landlord here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-2">Contact your landlords</p>
      </div>

      <div className="space-y-6">
        {/* Landlord List */}
        <div>
          <h2 className="font-semibold text-sm mb-3">Your Landlords</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tenancies.map((tenancy) => (
              <Card
                key={tenancy.id}
                className={`cursor-pointer transition-colors ${
                  selectedTenancy?.id === tenancy.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedTenancy(tenancy)}
              >
                <CardContent className="pt-4">
                  <p className="font-medium text-sm">{tenancy.landlord_name}</p>
                  <p className="text-xs text-muted-foreground">{tenancy.property_name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tenancy.landlord_email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Message Form */}
        {selectedTenancy ? (
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
              <CardDescription>
                Contact {selectedTenancy.landlord_name} about {selectedTenancy.property_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Maintenance Request, Question about lease..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    disabled={sendLoading}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    required
                    disabled={sendLoading}
                    rows={6}
                  />
                </div>

                {/* Success Message */}
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-green-800">
                      Message sent successfully! Your landlord will receive an email shortly.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={sendLoading || !subject || !message}
                >
                  {sendLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                Select a landlord from the list above to send a message
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}