"use client";
import { useEffect, useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, FileText, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  {/* Match up the variables to the ones the relevant database uses, order does not matter*/}
const [userData, setUserData] = useState({
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  date_of_birth: "",
  address: "",
  employment: { company: "", position: "", income: 0, } // employment is passing an an obj???
  // , references: [] // This has to be an array
});
      {/* The fetch links to whatever folder the GET */}
      {/* You do NOT need "console.log" for the code to pull data but it helps to see what its pulling if you need to troubleshoot */}
      useEffect(() => {
        fetch("http://localhost:3000/api/renter/profile", { credentials: "include" })
          .then(response => response.json())
          .then(response => {
            console.log("You are pulling this data:", response);
            console.log("GET /api/renter/profile returning:", { ...userData, ...tenantData });
            setUserData(prev => ({
              ...prev,
              ...response,
              employment: response.employment || { company: "", position: "", income: 0 }
              //references: response.references || []
            }));
          })
          .catch(error => console.error(error));
      }, []);

   return (
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and rental profile
          </p>
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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="first_name"
                  value={userData.first_name}
                  onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="last_name"
                  value={userData.last_name}
                  onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={userData.phone_number}
                onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
              />
            </div>
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input 
              id="date_of_birth"
              type="date" 
              value={userData.date_of_birth}
              onChange={(e) => setUserData({ ...userData, date_of_birth: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Current Address</Label>
            <Input 
              id="address" 
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
          </div>
          <Button>Save Changes</Button>
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
                value={userData.employment.company}
                onChange={(e) => setUserData({
                  ...userData,
                  employment: { ...userData.employment, company: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                value={userData.employment.position}
                onChange={(e) => setUserData({
                  ...userData,
                  employment: { ...userData.employment, position: e.target.value }
                })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="income">Annual Income ($)</Label>
            <Input 
              id="income" 
              type="number" 
              value={userData.employment.income}
              onChange={(e) => setUserData({
                ...userData,
                employment: { ...userData.employment, income: parseFloat(e.target.value) || 0 }
              })}
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

{/*  temporarily removing references section to test a theory */}
      {/* References
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            References
          </CardTitle>
          <CardDescription>Your rental references</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userData.references.map((ref, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{ref.name}</h4>
                <Badge variant="outline">{ref.relationship}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {ref.phone}
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline">Add Reference</Button>
        </CardContent>
      </Card>
*/}
      {/* Application Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Application Documents</CardTitle>
          <CardDescription>Upload documents for your rental applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>ID Document</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              <Badge variant="outline">Uploaded</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Proof of Income</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              <Badge variant="outline">Uploaded</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Credit Report</Label>
            <div className="flex items-center gap-2">
              <Input type="file" accept=".pdf" />
              <Button variant="outline" size="sm">Upload</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

