import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

/**
 * Get status badge component for application status
 */
export function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
    case "approved":
      return <Badge variant="default" className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

/**
 * Get status message for application status
 */
export function getStatusMessage(status: string): string {
  switch (status) {
    case "pending":
      return "Under review by property owner";
    case "approved":
      return "Congratulations! Your application has been approved.";
    case "rejected":
      return "Application was not approved at this time";
    default:
      return "";
  }
}

/**
 * Calculate application statistics
 */
export interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function calculateApplicationStats(applications: Array<{ status: string }>): ApplicationStats {
  const applicationsList = applications || [];
  return {
    total: applicationsList.length,
    pending: applicationsList.filter(a => a.status === "pending").length,
    approved: applicationsList.filter(a => a.status === "approved").length,
    rejected: applicationsList.filter(a => a.status === "rejected").length,
  };
}

/**
 * Prepare application data for database submission
 */
export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  currentStreet: string;
  currentCity: string;
  currentState: string;
  currentZip: string;
  monthlyRent: string;
  moveInDate: string;
  moveOutReason?: string;
  employerName: string;
  jobTitle: string;
  employerPhone: string;
  employmentStartDate: string;
  monthlyIncome: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  pets?: string;
  vehicles?: string;
  additionalNotes?: string;
}

export interface PreparedApplicationData {
  property_id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  ssn: string;
  current_street: string;
  current_city: string;
  current_state: string;
  current_zip: string;
  current_monthly_rent: number | null;
  move_in_date: string;
  move_out_reason: string | null;
  employer_name: string;
  job_title: string;
  employer_phone: string;
  employment_start_date: string;
  monthly_income: number | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  pets: string | null;
  vehicles: string | null;
  additional_notes: string | null;
  status: string;
  applied_date: string;
}

export function prepareApplicationData(
  formData: ApplicationFormData,
  propertyId: number,
  userId: string,
  userEmail?: string
): PreparedApplicationData {
  return {
    property_id: propertyId,
    user_id: userId,
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email || userEmail || '',
    phone: formData.phone,
    date_of_birth: formData.dateOfBirth,
    ssn: formData.ssn,
    current_street: formData.currentStreet,
    current_city: formData.currentCity,
    current_state: formData.currentState,
    current_zip: formData.currentZip,
    current_monthly_rent: formData.monthlyRent ? parseFloat(formData.monthlyRent) : null,
    move_in_date: formData.moveInDate,
    move_out_reason: formData.moveOutReason || null,
    employer_name: formData.employerName,
    job_title: formData.jobTitle,
    employer_phone: formData.employerPhone,
    employment_start_date: formData.employmentStartDate,
    monthly_income: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
    emergency_contact_name: formData.emergencyName,
    emergency_contact_phone: formData.emergencyPhone,
    emergency_contact_relationship: formData.emergencyRelationship,
    pets: formData.pets || null,
    vehicles: formData.vehicles || null,
    additional_notes: formData.additionalNotes || null,
    status: "pending",
    applied_date: new Date().toISOString(),
  };
}
