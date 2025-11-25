import { describe, it, expect } from 'vitest';
import { prepareApplicationData } from '@/lib/utils/application-utils';
import type { ApplicationFormData } from '@/lib/utils/application-utils';

// Testing application data prep function
describe('Application Data Preparation', () => {
  describe('prepareApplicationData', () => {
    // Making a test form data object to use in tests
    const sampleFormData: ApplicationFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-1234',
      dateOfBirth: '1990-01-15',
      ssn: '123-45-6789',
      currentStreet: '123 Main St',
      currentCity: 'Omaha',
      currentState: 'NE',
      currentZip: '68102',
      monthlyRent: '1200',
      moveInDate: '2024-06-01',
      moveOutReason: 'Looking for bigger place',
      employerName: 'Tech Corp',
      jobTitle: 'Software Developer',
      employerPhone: '555-5678',
      employmentStartDate: '2020-01-01',
      monthlyIncome: '5000',
      emergencyName: 'Jane Doe',
      emergencyPhone: '555-9999',
      emergencyRelationship: 'Spouse',
      pets: '1 dog',
      vehicles: '1 car',
      additionalNotes: 'Would like to move in ASAP',
    };

    // Test that all the fields get mapped correctly
    it('should prepare application data with all required fields', () => {
      const result = prepareApplicationData(sampleFormData, 123, 'user-123', 'john.doe@example.com');
      
      // Check basic fields
      expect(result.property_id).toBe(123);
      expect(result.user_id).toBe('user-123');
      expect(result.first_name).toBe('John');
      expect(result.last_name).toBe('Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.phone).toBe('555-1234');
      expect(result.status).toBe('pending'); // should always be pending for new apps
      expect(result.applied_date).toBeDefined(); // should have a date
    });

    // Test that rent gets converted from string to number
    it('should convert monthly rent string to number', () => {
      const result = prepareApplicationData(sampleFormData, 123, 'user-123');
      
      expect(result.current_monthly_rent).toBe(1200);
      expect(typeof result.current_monthly_rent).toBe('number'); // make sure it's actually a number
    });

    // Same for income
    it('should convert monthly income string to number', () => {
      const result = prepareApplicationData(sampleFormData, 123, 'user-123');
      
      expect(result.monthly_income).toBe(5000);
      expect(typeof result.monthly_income).toBe('number');
    });

    it('should handle empty monthly rent as null', () => {
      const formData = { ...sampleFormData, monthlyRent: '' };
      const result = prepareApplicationData(formData, 123, 'user-123');
      
      expect(result.current_monthly_rent).toBeNull();
    });

    it('should handle empty monthly income as null', () => {
      const formData = { ...sampleFormData, monthlyIncome: '' };
      const result = prepareApplicationData(formData, 123, 'user-123');
      
      expect(result.monthly_income).toBeNull();
    });

    it('should use user email when form email is empty', () => {
      const formData = { ...sampleFormData, email: '' };
      const result = prepareApplicationData(formData, 123, 'user-123', 'fallback@example.com');
      
      expect(result.email).toBe('fallback@example.com');
    });

    it('should use empty string when both emails are missing', () => {
      const formData = { ...sampleFormData, email: '' };
      const result = prepareApplicationData(formData, 123, 'user-123');
      
      expect(result.email).toBe('');
    });

    // Testing optional fields
    it('should handle optional move out reason', () => {
      const formData = { ...sampleFormData, moveOutReason: undefined };
      const result = prepareApplicationData(formData, 123, 'user-123');
      
      expect(result.move_out_reason).toBeNull();
    });

    it('should handle optional pets field', () => {
      const formData = { ...sampleFormData, pets: undefined };
      const result = prepareApplicationData(formData, 123, 'user-123');
      
      expect(result.pets).toBeNull();
    });

    it('should handle optional vehicles field', () => {
      const formData = { ...sampleFormData, vehicles: undefined };
      const result = prepareApplicationData(formData, 123, 'user-123');
      
      expect(result.vehicles).toBeNull();
    });

    it('should handle optional additional notes field', () => {
      const formData = { ...sampleFormData, additionalNotes: undefined };
      const result = prepareApplicationData(formData, 123, 'user-123');
      
      expect(result.additional_notes).toBeNull();
    });

    // Testing that the date gets set correctly
    it('should set applied_date to current ISO string', () => {
      const before = new Date().toISOString();
      const result = prepareApplicationData(sampleFormData, 123, 'user-123');
      const after = new Date().toISOString();
      
      // Check that date is between before and after (since it happens in between)
      expect(result.applied_date).toBeDefined();
      expect(result.applied_date >= before).toBe(true);
      expect(result.applied_date <= after).toBe(true);
    });

    // Check address fields are mapped right
    it('should correctly map address fields', () => {
      const result = prepareApplicationData(sampleFormData, 123, 'user-123');
      
      expect(result.current_street).toBe('123 Main St');
      expect(result.current_city).toBe('Omaha');
      expect(result.current_state).toBe('NE');
      expect(result.current_zip).toBe('68102');
    });

    // Check employment info
    it('should correctly map employment fields', () => {
      const result = prepareApplicationData(sampleFormData, 123, 'user-123');
      
      expect(result.employer_name).toBe('Tech Corp');
      expect(result.job_title).toBe('Software Developer');
      expect(result.employer_phone).toBe('555-5678');
      expect(result.employment_start_date).toBe('2020-01-01');
    });

    // Emergency contact stuff
    it('should correctly map emergency contact fields', () => {
      const result = prepareApplicationData(sampleFormData, 123, 'user-123');
      
      expect(result.emergency_contact_name).toBe('Jane Doe');
      expect(result.emergency_contact_phone).toBe('555-9999');
      expect(result.emergency_contact_relationship).toBe('Spouse');
    });

    // Make sure status is always pending for new applications
    it('should always set status to pending', () => {
      const result = prepareApplicationData(sampleFormData, 123, 'user-123');
      
      expect(result.status).toBe('pending'); // new apps should be pending
    });
  });
});

