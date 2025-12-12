"use client";
import { Users, Mail, Phone, Calendar, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTenants = async () => {
      try {
        const res = await fetch("/api/owner/tenants", { cache: "no-store" });
        if (!res.ok) {
          console.error("Failed to fetch tenants:", res.status, await res.text());
          return;
        }
        const data = await res.json();
        // route returns an array of lease rows (possibly nested property/user)
        const rows = Array.isArray(data) ? data : data.tenants || data;

        const mapped = (rows || []).map((r: any, idx: number) => ({
          id: r.id ?? r.tenant_id ?? `${r.user?.email ?? "tenant"}-${idx}`,
          name: `${r.user?.first_name || ""} ${r.user?.last_name || ""}`.trim() || "Unknown",
          email: r.user?.email || "No email",
          phone: r.user?.phone_number || "No phone",
          property: r.property?.name || r.property || "Unknown Property",
          moveInDate: r.move_in_date || "",
          rent: r.monthly_rent ?? 0,
          status: r.status || "",
          leaseEnd: r.lease_end_date || "",
        }));

        if (mounted) setTenants(mapped);
      } catch (err) {
        console.error("Error fetching tenants:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTenants();
    return () => {
      mounted = false;
    };
  }, []);

  const totalTenants = tenants.length;
  const currentTenants = tenants.filter(t => t.status === "current").length;
  const totalMonthlyRent = tenants.filter(t => t.status === "current").reduce((sum, t) => sum + t.rent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tenants</h1>
        <p className="text-muted-foreground">
          Manage your tenants and rental agreements
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tenants</CardDescription>
            <CardTitle className="text-2xl">{totalTenants}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Tenants</CardDescription>
            <CardTitle className="text-2xl text-green-600">{currentTenants}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Recurring Rent</CardDescription>
            <CardTitle className="text-2xl">${totalMonthlyRent.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>


      {/* Tenants List */}
      <div className="grid gap-4">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{tenant.name}</h3>
                    <Badge variant={tenant.status === "current" ? "default" : "secondary"}>
                      {tenant.status}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {tenant.phone}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Property:</span>
                        <span className="font-medium">{tenant.property}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Monthly Rent:</span>
                        <span className="font-bold">${tenant.rent.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Move-in:</span>
                        <span>{new Date(tenant.moveInDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Lease End:</span>
                        <span>{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}