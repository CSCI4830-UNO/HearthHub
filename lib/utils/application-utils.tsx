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

