import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Calendar, User, FileText, CheckCircle2, XCircle, Clock, Phone, Building2, Briefcase, ArrowLeft } from "lucide-react";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function ApplicationDetailsPage({ params }: PageProps) {
	const supabase = await createClient();

	// Require auth
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/auth/login");

	const { id: applicationId } = await params;

	// Fetch application with joined property - ensure it belongs to current user
	const { data: application, error } = await supabase
		.from("rental_applications")
		.select(
			`
			id,
			status,
			applied_date,
			user_id,
			property_id,
			first_name,
			last_name,
			email,
			phone,
			date_of_birth,
			monthly_income,
			current_monthly_rent,
			move_in_date,
			employer_name,
			job_title,
			employment_start_date,
			additional_notes,
			property:property_id ( id, name, address, monthly_rent )
		`
		)
		.eq("id", Number.isFinite(Number(applicationId)) ? Number(applicationId) : -1)
		.eq("user_id", user.id)
		.single();

	if (error) {
		console.error("Error fetching application:", error);
	}

	if (!application) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Application Not Found</CardTitle>
						<CardDescription>We couldn't locate this application or you don't have permission to view it.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild variant="outline">
							<Link href="/renters/dashboard/applications">Back to Applications</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const statusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge variant="secondary" className="flex items-center gap-1">
						<Clock className="h-3 w-3" /> Pending
					</Badge>
				);
			case "approved":
				return (
					<Badge variant="default" className="flex items-center gap-1">
						<CheckCircle2 className="h-3 w-3" /> Approved
					</Badge>
				);
			case "rejected":
				return (
					<Badge variant="destructive" className="flex items-center gap-1">
						<XCircle className="h-3 w-3" /> Rejected
					</Badge>
				);
			default:
				return <Badge>{status}</Badge>;
		}
	};

	const getStatusMessage = (status: string) => {
		switch (status) {
			case "pending":
				return "Your application is currently under review by the property owner.";
			case "approved":
				return "Congratulations! Your application has been approved. The property owner will contact you soon.";
			case "rejected":
				return "Unfortunately, your application was not approved at this time.";
			default:
				return "";
		}
	};

	const property = (application as any).property;
	const applicantName = `${application.first_name || ""} ${application.last_name || ""}`.trim();
	const annualIncome = application.monthly_income ? application.monthly_income * 12 : null;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/renters/dashboard/applications">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div className="flex-1">
					<h1 className="text-3xl font-bold">Application Details</h1>
					<p className="text-muted-foreground">Application ID: {application.id}</p>
				</div>
				{statusBadge(application.status)}
			</div>

			{/* Status Message */}
			<Card className={
				application.status === "approved" 
					? "border-green-500 bg-green-50 dark:bg-green-950" 
					: application.status === "rejected"
					? "border-red-500 bg-red-50 dark:bg-red-950"
					: "border-orange-500 bg-orange-50 dark:bg-orange-950"
			}>
				<CardContent className="pt-6">
					<p className={
						application.status === "approved"
							? "text-green-900 dark:text-green-100"
							: application.status === "rejected"
							? "text-red-900 dark:text-red-100"
							: "text-orange-900 dark:text-orange-100"
					}>
						{getStatusMessage(application.status)}
					</p>
				</CardContent>
			</Card>

			{/* Property Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building2 className="h-4 w-4" /> Property Details
					</CardTitle>
					<CardDescription>Property you applied for</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<div>
						<div className="text-sm text-muted-foreground">Property Name</div>
						<div className="font-medium text-lg">{property?.name ?? "—"}</div>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<MapPin className="h-4 w-4 text-muted-foreground" />
						<span className="text-muted-foreground">Address:</span>
						<span className="font-medium">{property?.address ?? "—"}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<DollarSign className="h-4 w-4 text-muted-foreground" />
						<span className="text-muted-foreground">Monthly Rent:</span>
						<span className="font-bold">${property?.monthly_rent?.toLocaleString?.() ?? "—"}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span className="text-muted-foreground">Applied:</span>
						<span className="font-medium">{new Date(application.applied_date).toLocaleDateString()}</span>
					</div>
				</CardContent>
			</Card>

			{/* Your Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-4 w-4" /> Your Information
					</CardTitle>
					<CardDescription>Information you provided in the application</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-3">
							<div>
								<div className="text-sm text-muted-foreground">Full Name</div>
								<div className="font-medium text-lg">{applicantName || "Not provided"}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Date of Birth</div>
								<div className="font-medium">
									{application.date_of_birth 
										? new Date(application.date_of_birth).toLocaleDateString()
										: "Not provided"}
								</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Email</div>
								<div className="font-medium">{application.email || "Not provided"}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Phone</div>
								<div className="font-medium">{application.phone || "Not provided"}</div>
							</div>
						</div>
						<div className="space-y-3">
							<div>
								<div className="text-sm text-muted-foreground">Monthly Income</div>
								<div className="font-medium">
									{application.monthly_income 
										? `$${application.monthly_income.toLocaleString()}/mo` 
										: "Not provided"}
								</div>
								{annualIncome && (
									<div className="text-xs text-muted-foreground">
										${annualIncome.toLocaleString()}/year
									</div>
								)}
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Current Monthly Rent</div>
								<div className="font-medium">
									{application.current_monthly_rent 
										? `$${application.current_monthly_rent.toLocaleString()}/mo` 
										: "Not provided"}
								</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Desired Move-in Date</div>
								<div className="font-medium">
									{application.move_in_date 
										? new Date(application.move_in_date).toLocaleDateString()
										: "Not provided"}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Employment Information */}
			{(application.employer_name || application.job_title || application.employment_start_date) && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Briefcase className="h-4 w-4" /> Employment Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-3 gap-6">
							<div>
								<div className="text-sm text-muted-foreground">Employer Name</div>
								<div className="font-medium">{application.employer_name || "Not provided"}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Job Title</div>
								<div className="font-medium">{application.job_title || "Not provided"}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Employment Start Date</div>
								<div className="font-medium">
									{application.employment_start_date 
										? new Date(application.employment_start_date).toLocaleDateString()
										: "Not provided"}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Additional Notes */}
			{application.additional_notes && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-4 w-4" /> Additional Notes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-sm whitespace-pre-wrap text-muted-foreground">
							{application.additional_notes}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Actions */}
			<div className="flex gap-2">
				<Button variant="outline" asChild>
					<Link href="/renters/dashboard/applications">Back to Applications</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href={`/renters/dashboard/properties/${property?.id ?? application.property_id}`}>View Property</Link>
				</Button>
			</div>
		</div>
	);
}
