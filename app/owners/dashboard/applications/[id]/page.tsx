import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Calendar, User, FileText, CheckCircle2, XCircle, Clock, Phone } from "lucide-react";

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function ReviewApplicationPage({ params }: PageProps) {
	const supabase = await createClient();

	// Require auth
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/auth/login");

	const { id: applicationId } = await params;


	// Fetch application with joined property
	const { data: application, error } = await supabase
		.from("rental_applications")
		.select(
			`
			id,
			status,
			applied_date,
			user_id,
			property_id,
			property:property_id ( id, name, address, monthly_rent ),
			email,
            phone
		`
		)
		.eq("id", Number.isFinite(Number(applicationId)) ? Number(applicationId) : -1)
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
						<CardDescription>We couldn't locate this application.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild variant="outline">
							<Link href="/owners/dashboard/applications">Back to Applications</Link>
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

	const property = (application as any).property;
// No join to auth users; email/phone selected directly from application

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Review Application</h1>
					<p className="text-muted-foreground">Application ID: {application.id}</p>
				</div>
				{statusBadge(application.status)}
			</div>

			{/* Summary */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-4 w-4" /> Application Details
						</CardTitle>
						<CardDescription>
							Submitted {new Date(application.applied_date).toLocaleDateString()}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center gap-2 text-sm">
							<User className="h-4 w-4 text-muted-foreground" />
							<span className="text-muted-foreground">Applicant:</span>
							<span className="font-medium">{application.email ?? application.user_id}</span>
						</div>
						{application.phone && (
							<div className="flex items-center gap-2 text-sm">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<span className="text-muted-foreground">Phone:</span>
								<span className="font-medium">{application.phone}</span>
							</div>
						)}
						<div className="text-sm text-muted-foreground">
							Status: {application.status}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-4 w-4" /> Property
						</CardTitle>
						<CardDescription>{property?.name ?? "Property"}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin className="h-4 w-4" /> {property?.address ?? "—"}
						</div>
						<div className="flex items-center gap-2 text-sm">
							<DollarSign className="h-4 w-4 text-muted-foreground" />
							<span className="text-muted-foreground">Monthly Rent:</span>
							<span className="font-bold">${property?.monthly_rent?.toLocaleString?.() ?? "—"}</span>
						</div>
					</CardContent>
				</Card>
			</div>

			
			{/* Actions */}
			<div className="flex gap-2">
				<Button variant="outline" asChild>
					<Link href={`/owners/dashboard/applications`}>Back to Applications</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href={`/owners/dashboard/properties/${property?.id ?? application.property_id}`}>View Property</Link>
				</Button>
			</div>
		</div>
	);
}

