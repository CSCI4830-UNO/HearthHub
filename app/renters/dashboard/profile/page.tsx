"use client";
import { useEffect, useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, FileText, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {

//Match up the variables to the ones the relevant database uses, order does not matter
const [userData, setUserData] = useState({
  email: "",
  first_name: "",
  last_name: "",
  phone_number: "",
  date_of_birth: "",
  address: "",
  employment: { company: "", position: "", income: 0 },
  references: []
  });
      // The fetch links to whatever folder the GET
      // You do NOT need "console.log" for the code to pull data but it helps to see what its pulling if you need to troubleshoot
      useEffect(() => {
        fetch("/api/renter/profile", { credentials: "include" })
          .then(response => response.json())
          .then(response => {
            console.log("Data received by React:", response);
            setUserData(prev => ({
              ...prev,
              ...response
            }));
          })
          .catch(error => console.error(error));
      }, []);


// This is your POST code that updates the user database entries
const handleSave = async () => {
    try {
      const response = await fetch("/api/renter/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...userData
        })
      });

      const result = await response.json();
      // You do NOT need "console.log" for the code to pull data but it helps to see what its pulling if you need to troubleshoot
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

// Code to update references
const handleReference = () => {
  setUserData({
    ...userData,
    references: [
      ...userData.references,
      { refName: "", refRelationship: "", refPhone: "" }
    ]
  });
};

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
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={userData.first_name}
                  onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
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
              <Label htmlFor="phone_number">Phone Number</Label>
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
          <Button onClick={handleSave}>Save Changes</Button>
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
          <Button onClick={handleSave}>Save Changes</Button>
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
            {userData.references.map((ref, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-sm font-medium">Name</span>
                  <Input
                    value={ref.refName}
                    onChange={(e) => {
                      const newRefs = [...userData.references];
                      newRefs[index].refName = e.target.value;
                      setUserData({ ...userData, references: newRefs });
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-sm font-medium">Relationship</span>
                  <Input
                    value={ref.refRelationship}
                    onChange={(e) => {
                      const newRefs = [...userData.references];
                      newRefs[index].refRelationship = e.target.value;
                      setUserData({ ...userData, references: newRefs });
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-sm font-medium">Phone</span>
                  <Input
                    value={ref.refPhone}
                    onChange={(e) => {
                      const newRefs = [...userData.references];
                      newRefs[index].refPhone = e.target.value;
                      setUserData({ ...userData, references: newRefs });
                    }}
                  />
                </div>

                {/* Remove button */}
                <Button
                  variant="destructive"
                  onClick={() => {
                    const newRefs = userData.references.filter((_, i) => i !== index);
                    setUserData({ ...userData, references: newRefs });
                  }}
                >
                  Remove Reference
                </Button>
              </div>
            ))}
          <Button variant="outline" onClick={handleReference}>Add Reference</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
      {/* Application Documents

          *** Not sure if this is necessary right now
          *** May be easier just to leave it out for now

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
*/}