import { describe, it, expect } from 'vitest';
import { isPropertyAvailable, validatePropertyId } from '@/lib/utils/property-utils';

// Tests for property functions used when applying
describe('Property Utilities (Application Context)', () => {
  // Check if property can accept applications
  describe('isPropertyAvailable', () => {
    it('should return true for "Available" status', () => {
      expect(isPropertyAvailable('Available')).toBe(true);
    });

    // Testing case sensitivity
    it('should return true for "available" status (lowercase)', () => {
      expect(isPropertyAvailable('available')).toBe(true);
    });

    it('should return true for "Vacant" status', () => {
      expect(isPropertyAvailable('Vacant')).toBe(true);
    });

    it('should return true for "vacant" status (lowercase)', () => {
      expect(isPropertyAvailable('vacant')).toBe(true);
    });

    // Testing unavailable statuses
    it('should return false for "occupied" status', () => {
      expect(isPropertyAvailable('occupied')).toBe(false);
    });

    it('should return false for "Occupied" status', () => {
      expect(isPropertyAvailable('Occupied')).toBe(false);
    });

    it('should return false for "rented" status', () => {
      expect(isPropertyAvailable('rented')).toBe(false);
    });

    // Edge cases
    it('should return false for empty string', () => {
      expect(isPropertyAvailable('')).toBe(false);
    });

    it('should return false for unknown status', () => {
      expect(isPropertyAvailable('unknown')).toBe(false);
    });
  });

  // Testing property ID validation for application submission
  describe('validatePropertyId', () => {
    // Test with valid string number
    // Test with a string that's a number
    it('should validate valid numeric string', () => {
      const result = validatePropertyId('123');
      
      expect(result.isValid).toBe(true);
      expect(result.propertyId).toBe(123);
      expect(result.error).toBeUndefined(); // no error should be set
    });

    // Test with actual number type
    it('should validate valid number', () => {
      const result = validatePropertyId(456);
      
      expect(result.isValid).toBe(true);
      expect(result.propertyId).toBe(456);
      expect(result.error).toBeUndefined();
    });

    // Testing invalid inputs
    it('should reject invalid string that cannot be parsed', () => {
      const result = validatePropertyId('abc');
      
      expect(result.isValid).toBe(false);
      expect(result.propertyId).toBeUndefined();
      expect(result.error).toBe('Invalid property ID');
    });

    it('should reject empty string', () => {
      const result = validatePropertyId('');
      
      expect(result.isValid).toBe(false);
      expect(result.propertyId).toBeUndefined();
      expect(result.error).toBe('Invalid property ID');
    });

    it('should reject string with only whitespace', () => {
      const result = validatePropertyId('   ');
      
      expect(result.isValid).toBe(false);
      expect(result.propertyId).toBeUndefined();
      expect(result.error).toBe('Invalid property ID');
    });

    // Edge cases
    it('should validate zero as valid ID', () => {
      const result = validatePropertyId('0');
      
      expect(result.isValid).toBe(true);
      expect(result.propertyId).toBe(0);
    });

    it('should validate negative numbers', () => {
      const result = validatePropertyId('-1');
      
      expect(result.isValid).toBe(true);
      expect(result.propertyId).toBe(-1);
    });

    // What happens with decimals?
    it('should validate decimal strings (truncated)', () => {
      const result = validatePropertyId('123.45');
      
      expect(result.isValid).toBe(true);
      expect(result.propertyId).toBe(123); // should just take the integer part
    });

    it('should handle very large numbers', () => {
      const result = validatePropertyId('999999999');
      
      expect(result.isValid).toBe(true);
      expect(result.propertyId).toBe(999999999);
    });
  });
});

