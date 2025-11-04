import { User, Mail, Phone, MapPin, Calendar, FileText, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Mock profile data
const profileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  dateOfBirth: "1990-01-15",
  address: "123 Main St, San Francisco, CA 94102",
  employment: {
    company: "Tech Corp",
    position: "Software Engineer",
    income: 85000,
  },
  references: [
    {
      name: "Jane Smith",
      relationship: "Previous Landlord",
      phone: "(555) 987-6543",
    },
  ],
};

export default function ProfilePage() {
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
              <Input id="firstName" value={profileData.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={profileData.lastName} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={profileData.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={profileData.phone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input id="dateOfBirth" type="date" value={profileData.dateOfBirth} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Current Address</Label>
            <Input id="address" value={profileData.address} />
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
              <Input id="company" value={profileData.employment.company} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" value={profileData.employment.position} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="income">Annual Income ($)</Label>
            <Input id="income" type="number" value={profileData.employment.income} />
          </div>
          <Button>Save Changes</Button>
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
          {profileData.references.map((ref, index) => (
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

