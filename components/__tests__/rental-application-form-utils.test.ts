import { describe, it, expect } from 'vitest';
import { getErrorMessageFromCode } from '@/lib/utils/error-utils';

// Testing error handling function
describe('Error Handling Utilities', () => {
  describe('getErrorMessageFromCode', () => {
    // Test for table not found error
    it('should return correct message for error code 42P01 (table not found)', () => {
      const error = { code: '42P01', message: 'Table does not exist' };
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe("Database table not found. Please create the 'rental_applications' table in Supabase.");
    });

    it('should return correct message for error code 23503 (foreign key violation)', () => {
      const error = { code: '23503', message: 'Foreign key violation' };
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('Invalid property. Please select a valid property.');
    });

    it('should return correct message for error code 23505 (unique violation)', () => {
      const error = { code: '23505', message: 'Unique constraint violation' };
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('You have already submitted an application for this property.');
    });

    // Testing unknown error codes
    it('should return error message for unknown error code', () => {
      const error = { code: 'UNKNOWN', message: 'Some database error' };
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('Some database error');
    });

    // Edge cases
    it('should return default message when error has no code or message', () => {
      const error = {};
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('An error occurred');
    });

    it('should return default message when error has code but no message', () => {
      const error = { code: 'UNKNOWN' };
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('An error occurred');
    });

    it('should return message when error has message but no code', () => {
      const error = { message: 'Custom error message' };
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('Custom error message');
    });

    // Testing null/undefined handling
    it('should handle null error object', () => {
      const error = null as any;
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('An error occurred');
    });

    it('should handle undefined error object', () => {
      const error = undefined as any;
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('An error occurred');
    });

    // Make sure specific codes override generic messages
    it('should prioritize specific error code messages over generic messages', () => {
      const error = { 
        code: '23505', 
        message: 'Generic database error' 
      };
      const message = getErrorMessageFromCode(error);
      
      expect(message).toBe('You have already submitted an application for this property.');
    });
  });
});

