"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RejectButtonProps {
  applicationId: number;
}

export default function RejectButton({ applicationId }: RejectButtonProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const router = useRouter();

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this application? This action cannot be undone.")) {
      return;
    }

    setIsRejecting(true);

    try {
      const response = await fetch(`/api/owner/applications?applicationId=${applicationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject application');
      }

      // Refresh the page to show updated list
      router.refresh();
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert(err instanceof Error ? err.message : "Failed to reject application");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-red-200 hover:bg-red-300 text-black"
      onClick={handleReject}
      disabled={isRejecting}
    >
      {isRejecting ? "Rejecting..." : "Reject"}
    </Button>
  );
}