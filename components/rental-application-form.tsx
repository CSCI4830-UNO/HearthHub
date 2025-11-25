"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessageFromCode } from "@/lib/utils/error-utils";
import { validatePropertyId } from "@/lib/utils/property-utils";
import { prepareApplicationData } from "@/lib/utils/application-utils";

interface RentalApplicationFormProps {
  propertyId: string;
  className?: string;
  disabled?: boolean;
}

export function RentalApplicationForm({
  propertyId,
  className,
  disabled = false,
  ...props
}: RentalApplicationFormProps & React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ssn, setSsn] = useState("");

  // Current Address
  const [currentStreet, setCurrentStreet] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [currentZip, setCurrentZip] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutReason, setMoveOutReason] = useState("");

  // Employment Information
  const [employerName, setEmployerName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");
  const [employmentStartDate, setEmploymentStartDate] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");

  // Additional Information
  const [pets, setPets] = useState("");
  const [vehicles, setVehicles] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled) {
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to submit an application");
      }

      // Validate and convert property_id to number
      const validation = validatePropertyId(propertyId);
      if (!validation.isValid) {
        throw new Error(validation.error || "Invalid property ID");
      }
      const propertyIdNum = validation.propertyId!;

      // Prepare application data
      const applicationData = prepareApplicationData({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        ssn,
        currentStreet,
        currentCity,
        currentState,
        currentZip,
        monthlyRent,
        moveInDate,
        moveOutReason,
        employerName,
        jobTitle,
        employerPhone,
        employmentStartDate,
        monthlyIncome,
        emergencyName,
        emergencyPhone,
        emergencyRelationship,
        pets,
        vehicles,
        additionalNotes,
      }, propertyIdNum, user.id, user.email);

      // Save application to Supabase
      const { error: insertError } = await supabase
        .from("rental_applications")
        .insert(applicationData);

      if (insertError) {
        const errorMessage = getErrorMessageFromCode(insertError);
        throw new Error(errorMessage);
      }

      setSuccess(true);
      // Redirect to applications page after 2 seconds
      setTimeout(() => {
        router.push("/renters/dashboard/applications");
        router.refresh();
      }, 2000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className={cn("", className)} {...props}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-bold">Application Submitted!</h3>
            <p className="text-muted-foreground">
              Your rental application has been submitted successfully. You will be redirected to your applications page shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Rental Application</CardTitle>
          <CardDescription>
            {disabled 
              ? "This application is not available at this time."
              : "Please fill out all required fields to complete your application"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security Number *</Label>
                  <Input
                    id="ssn"
                    type="text"
                    placeholder="XXX-XX-XXXX"
                    required
                    value={ssn}
                    onChange={(e) => setSsn(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Current Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Current Address</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStreet">Street Address *</Label>
                  <Input
                    id="currentStreet"
                    required
                    value={currentStreet}
                    onChange={(e) => setCurrentStreet(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentCity">City *</Label>
                    <Input
                      id="currentCity"
                      required
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentState">State *</Label>
                    <Input
                      id="currentState"
                      required
                      value={currentState}
                      onChange={(e) => setCurrentState(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentZip">ZIP Code *</Label>
                    <Input
                      id="currentZip"
                      required
                      value={currentZip}
                      onChange={(e) => setCurrentZip(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRent">Current Monthly Rent *</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      required
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moveInDate">Desired Move-In Date *</Label>
                    <Input
                      id="moveInDate"
                      type="date"
                      required
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moveOutReason">Reason for Moving</Label>
                    <Input
                      id="moveOutReason"
                      value={moveOutReason}
                      onChange={(e) => setMoveOutReason(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Employment Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employerName">Employer Name *</Label>
                  <Input
                    id="employerName"
                    required
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerPhone">Employer Phone *</Label>
                  <Input
                    id="employerPhone"
                    type="tel"
                    required
                    value={employerPhone}
                    onChange={(e) => setEmployerPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentStartDate">Employment Start Date *</Label>
                  <Input
                    id="employmentStartDate"
                    type="date"
                    required
                    value={employmentStartDate}
                    onChange={(e) => setEmploymentStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    required
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Emergency Contact</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Name *</Label>
                  <Input
                    id="emergencyName"
                    required
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone Number *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    required
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relationship *</Label>
                  <Input
                    id="emergencyRelationship"
                    required
                    value={emergencyRelationship}
                    onChange={(e) => setEmergencyRelationship(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pets">Pets (Number and Type)</Label>
                  <Input
                    id="pets"
                    placeholder="e.g., 1 dog, 2 cats"
                    value={pets}
                    onChange={(e) => setPets(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicles">Vehicles (Number and Type)</Label>
                  <Input
                    id="vehicles"
                    placeholder="e.g., 1 car, 1 motorcycle"
                    value={vehicles}
                    onChange={(e) => setVehicles(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <textarea
                  id="additionalNotes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Disabled overlay message */}
            {disabled && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">
                  This application cannot be submitted at this time.
                </p>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading || disabled}
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

