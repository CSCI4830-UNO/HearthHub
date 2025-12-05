"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const propertyTypes = [
  "Apartment",
  "House",
  "Condo",
  "Townhouse",
  "Loft",
  "Studio",
  "Duplex",
  "Other",
];

const amenities = [
  "Parking",
  "Laundry",
  "Air Conditioning",
  "Heating",
  "Dishwasher",
  "Microwave",
  "Refrigerator",
  "Balcony/Patio",
  "Gym/Fitness Center",
  "Pool",
  "Elevator",
  "Pet Friendly",
  "Furnished",
  "Internet Included",
  "Cable Included",
];

export default function AddPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);  // Array of Strings to hold public URLS

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    monthlyRent: "",
    deposit: "",
    description: "",
    availableDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Method to handle the upload of an Image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("User not authenticated");
      return;
    }
    // Building an Array for multiple Images converted into an Object
    const files = Array.from(e.target.files);
    const urls: string[] = [];

    // Iterates through Image files
    for (const file of files) {
      const filePath = `public/${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("Images") // bucket name
        .upload(filePath, file);

      if (error) {
        console.log("Error uploading file:", error , data);
        setError(error.message);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("Images")
        .getPublicUrl(filePath);

      // After each upload the public URL array is updated
      urls.push(publicUrlData.publicUrl);
    }
    // React state updated
    setUploadedImages(urls);
  };


  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const propertyData = {
        name: formData.name,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        property_type: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        square_feet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
        monthly_rent: parseFloat(formData.monthlyRent),
        security_deposit: formData.deposit ? parseFloat(formData.deposit) : null,
        description: formData.description,
        amenities: selectedAmenities,
        available_date: formData.availableDate || null,
        landlord_id: user.id,
        status: 'available',
        images: uploadedImages,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('property')
        .insert([propertyData]);

      if (error) throw error;

      router.push("/owners/dashboard/properties");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/owners/dashboard/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <p className="text-muted-foreground">
            Create a new property listing for rent
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the basic details about your property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Sunset Apartments - Unit 101"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main Street"
                required
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="San Francisco"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="CA"
                  required
                  maxLength={2}
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="94102"
                  required
                  pattern="[0-9]{5}"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>
              Specify the property type and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <select
                id="propertyType"
                name="propertyType"
                required
                value={formData.propertyType}
                onChange={handleInputChange}
                className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">Select property type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  placeholder="2"
                  required
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="1.5"
                  required
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFeet">Square Feet</Label>
                <Input
                  id="squareFeet"
                  name="squareFeet"
                  type="number"
                  min="0"
                  placeholder="1200"
                  value={formData.squareFeet}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Information */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Information</CardTitle>
            <CardDescription>
              Set the rent amount and availability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent ($) *</Label>
                <Input
                  id="monthlyRent"
                  name="monthlyRent"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="2500.00"
                  required
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Security Deposit ($)</Label>
                <Input
                  id="deposit"
                  name="deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="2500.00"
                  value={formData.deposit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableDate">Available Date</Label>
              <Input
                id="availableDate"
                name="availableDate"
                type="date"
                value={formData.availableDate}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>
              Provide a detailed description of your property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Property Description *</Label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                placeholder="Describe your property, its features, neighborhood, and any other relevant information..."
                value={formData.description}
                onChange={handleInputChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>
              Select the amenities available in your property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <Label
                    htmlFor={amenity}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code to add an image to a Property */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
            <CardDescription>
              Upload photos of your property (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <Label htmlFor="images" className="cursor-pointer">
                <span className="text-sm font-medium text-primary hover:underline">
                  Click to upload
                </span>
                <span className="text-sm text-muted-foreground">
                  {" "}or drag and drop
                </span>
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
            {/* Code to Preview a Thumbnail image */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((url) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt="Property preview"
                      className="h-32 w-full object-cover rounded-md border"
                    />
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Upload images to showcase your property
            </p>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isLoading}
          >
            <Link href="/owners/dashboard/properties">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Property..." : "Create Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}

