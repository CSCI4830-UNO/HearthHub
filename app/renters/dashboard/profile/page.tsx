"use client";
import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, FileText, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Reference = {
  refName?: string;
  refRelationship?: string;
  refPhone?: string;
};

type Employment = {
  company?: string;
  position?: string;
  income?: number;
};

type UserData = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  address?: string;
  employment?: Employment;
  references?: Reference[];
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: new Date().toISOString().split("T")[0],
    address: "",
    employment: { company: "", position: "", income: 0 },
    references: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/renter/profile", { credentials: "include" });
        if (!res.ok) {
          console.error("Failed to fetch profile:", res.status, await res.text());
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        // Merge returned values safely
        setUserData((prev) => ({
          ...prev,
          ...data,
          employment: { ...prev.employment, ...(data.employment || {}) },
          references: Array.isArray(data.references) ? data.references : prev.references,
        }));
        console.log("Data received by React:", data);
      } catch (error) {
        console.error("Fetch profile error:", error);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/renter/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log("Here's what was posted to the db:", result);

      if (response.ok) {
        alert("Changes updated!");
      } else {
        alert("Failed to update: " + (result?.error ?? "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("Unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleReference = () => {
    setUserData((prev) => ({
      ...prev,
      references: [...(prev.references || []), { refName: "", refRelationship: "", refPhone: "" }],
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and rental profile</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Your basic personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={userData.first_name || ""}
                onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={userData.last_name || ""}
                onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userData.email || ""}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              type="tel"
              value={userData.phone_number || ""}
              onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={userData.date_of_birth || ""}
              onChange={(e) => setUserData({ ...userData, date_of_birth: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Current Address</Label>
            <Input
              id="address"
              value={userData.address || ""}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Employment Information
          </CardTitle>
          <CardDescription>Your employment and income details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={userData.employment?.company || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    employment: { ...(userData.employment || {}), company: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={userData.employment?.position || ""}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    employment: { ...(userData.employment || {}), position: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Annual Income ($)</Label>
            <Input
              id="income"
              type="number"
              value={userData.employment?.income ?? 0}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  employment: { ...(userData.employment || {}), income: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            References
          </CardTitle>
          <CardDescription>Your rental references</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(userData.references || []).map((ref, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-24 text-sm font-medium">Name</span>
                <Input
                  value={ref.refName || ""}
                  onChange={(e) => {
                    const newRefs = [...(userData.references || [])];
                    newRefs[index] = { ...(newRefs[index] || {}), refName: e.target.value };
                    setUserData({ ...userData, references: newRefs });
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-24 text-sm font-medium">Relationship</span>
                <Input
                  value={ref.refRelationship || ""}
                  onChange={(e) => {
                    const newRefs = [...(userData.references || [])];
                    newRefs[index] = { ...(newRefs[index] || {}), refRelationship: e.target.value };
                    setUserData({ ...userData, references: newRefs });
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-24 text-sm font-medium">Phone</span>
                <Input
                  value={ref.refPhone || ""}
                  onChange={(e) => {
                    const newRefs = [...(userData.references || [])];
                    newRefs[index] = { ...(newRefs[index] || {}), refPhone: e.target.value };
                    setUserData({ ...userData, references: newRefs });
                  }}
                />
              </div>

              <Button
                variant="destructive"
                onClick={() => {
                  const newRefs = (userData.references || []).filter((_, i) => i !== index);
                  setUserData({ ...userData, references: newRefs });
                }}
              >
                Remove Reference
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReference}>
              Add Reference
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}