/**
 * Map database error codes to user-friendly error messages
 */
export function getErrorMessageFromCode(error: { code?: string; message?: string } | null | undefined): string {
  if (!error) {
    return "An error occurred";
  }

  if (!error.code) {
    return error.message || "An error occurred";
  }

  switch (error.code) {
    case "42P01":
      return "Database table not found. Please create the 'rental_applications' table in Supabase.";
    case "23503":
      return "Invalid property. Please select a valid property.";
    case "23505":
      return "You have already submitted an application for this property.";
    default:
      return error.message || "An error occurred";
  }
}

