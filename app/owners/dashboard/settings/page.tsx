"use client"
import { useEffect, useState } from "react"
import { User, Bell, Shield, CreditCard, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

{/* Code to pull data from Database endpoint */}
export default function OwnerSettingsPage() {
{/* Match up the variables to the ones the relevant database uses, order does not matter*/}
  const [userData, setUserData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: ""
  });
    {/* The fetch links to whatever folder the GET */}
    {/* You do NOT need "console.log" for the code to pull data but it helps to see what its pulling if you need to troubleshoot */}
    useEffect(() => {
    fetch("http://localhost:3000/api/owner/settings", {credentials: "include"})
        .then(response => response.json())
        .then(response => {console.log("You are pulling this data:", response);
        setUserData(response);
        })
        .catch(error => console.error(error));
        }, []);

{/* This is your POST code that updates the user database entries */}
const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/owner/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      {/* You do NOT need "console.log" for the code to pull data but it helps to see what its pulling if you need to troubleshoot */}
      console.log("Here's what was posted to the db:", result);

      if (response.ok) {
        alert("Changes updated!");
      } else {
        alert("Failed to update: " + result.error);
        console.log("Update result:", result.error);
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("Unexpected error occurred.");
      console.log("Update result:", error);
    }
  };


  {/* This is your DELETE code that erases the user database entries */}
  const handleDelete = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/owner/settings", { method: "DELETE", credentials: "include" });
      const result = await response.json();

      if (response.ok) {
        alert("Your account has been deleted.");
        {/* Takes user back to main website while they're being logged out in /owner/settings/route */}
        window.location.href = "http://localhost:3000";
      } else {
        alert("Failed to delete account: " + result.error);
        console.log("Delete result:", result.error);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Unexpected error occurred.");
      console.log("Delete result:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              {/* Accepts the GET data from the .ts file PAY ATTENTION TO SNAKE CASE! */}
              <Input id="first_name"
              placeholder="John"
              value={userData.first_name}
              onChange={e => setUserData({ ...userData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              {/* Accepts the GET data from the .ts file PAY ATTENTION TO SNAKE CASE! */}
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name"
              placeholder="Doe"
              value={userData.last_name}
              onChange={e => setUserData({ ...userData, last_name: e.target.value })}/>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {/* Accepts the GET data from the .ts file PAY ATTENTION TO SNAKE CASE! */}
            <Input id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={userData.email}
            onChange={e => setUserData({ ...userData, email: e.target.value })}
             />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            {/* Accepts the GET data from the .ts file PAY ATTENTION TO SNAKE CASE! */}
            <Input id="phone_number"
            type="tel"
            placeholder="(402) 123-4567"
            value={userData.phone_number}
            onChange={e => setUserData({ ...userData, phone_number: e.target.value })}
             />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
             <CardDescription>Manage your privacy and security settings</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Change Password</Label>
              <p className="text-sm text-muted-foreground">
                Update your account password
              </p>
              <Button asChild>
                <Link href="/auth/update-password">Change Password</Link>
              </Button>
            </div>
      {/*
                // This idea can be implemented if we have the time to make it happen
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
      */}
              </CardContent>
            </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Delete Account</Label>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


      {/* This code doesn't do anything yet because the backend is not built in yet */}
      {/*
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your properties
              </p>
            </div>
            <Checkbox defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Applications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new rental applications are submitted
              </p>
            </div>
            <Checkbox defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders for overdue payments
              </p>
            </div>
            <Checkbox defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Requests</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when tenants submit maintenance requests
              </p>
            </div>
            <Checkbox defaultChecked />
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>
*/}