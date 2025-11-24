/**
 * Check if property is available for applications
 */
export function isPropertyAvailable(status: string): boolean {
  return ['Available', 'available', 'Vacant', 'vacant'].includes(status);
}

/**
 * Validate and parse property ID
 */
export interface PropertyIdValidationResult {
  isValid: boolean;
  propertyId?: number;
  error?: string;
}

export function validatePropertyId(id: string | number): PropertyIdValidationResult {
  const propertyIdNum = typeof id === 'string' ? parseInt(id, 10) : id;
  
  if (isNaN(propertyIdNum)) {
    return {
      isValid: false,
      error: "Invalid property ID",
    };
  }

  return {
    isValid: true,
    propertyId: propertyIdNum,
  };
}

