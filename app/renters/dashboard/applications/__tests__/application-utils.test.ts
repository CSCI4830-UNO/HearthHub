import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { getStatusBadge, getStatusMessage, calculateApplicationStats } from '@/lib/utils/application-utils';
import { createMockApplications } from '@/__tests__/utils/mocks';

// Testing the application utility functions
describe('Application Utilities', () => {
  describe('getStatusBadge', () => {
    // Test for pending status badge
    it('should return correct badge for pending status', () => {
      const badge = getStatusBadge('pending');
      const { container } = render(badge);
      
      // Check if it shows "Pending" text
      expect(container.textContent).toContain('Pending');
      // Make sure the badge element is actually rendered
      const badgeElement = container.querySelector('div');
      expect(badgeElement).toBeTruthy();
    });

    it('should return correct badge for approved status', () => {
      const badge = getStatusBadge('approved');
      const { container } = render(badge);
      
      expect(container.textContent).toContain('Approved');
      const badgeElement = container.querySelector('div');
      expect(badgeElement).toBeTruthy();
    });

    // Testing rejected status
    it('should return correct badge for rejected status', () => {
      const badge = getStatusBadge('rejected');
      const { container } = render(badge);
      
      expect(container.textContent).toContain('Rejected');
      const badgeElement = container.querySelector('div');
      expect(badgeElement).toBeTruthy();
    });

    // Edge case - what happens with unknown status?
    it('should return default badge for unknown status', () => {
      const badge = getStatusBadge('unknown');
      const { container } = render(badge);
      
      expect(container.textContent).toContain('unknown');
      const badgeElement = container.querySelector('div');
      expect(badgeElement).toBeTruthy();
    });
  });

  describe('getStatusMessage', () => {
    it('should return correct message for pending status', () => {
      const message = getStatusMessage('pending');
      expect(message).toBe('Under review by property owner');
    });

    it('should return correct message for approved status', () => {
      const message = getStatusMessage('approved');
      // This should show the success message
      expect(message).toBe('Congratulations! Your application has been approved.');
    });

    it('should return correct message for rejected status', () => {
      const message = getStatusMessage('rejected');
      expect(message).toBe('Application was not approved at this time');
    });

    // Testing edge case
    it('should return empty string for unknown status', () => {
      const message = getStatusMessage('unknown');
      expect(message).toBe('');
    });
  });

  describe('calculateApplicationStats', () => {
    // Test with empty array
    it('should calculate correct statistics for empty array', () => {
      const stats = calculateApplicationStats([]);
      
      expect(stats.total).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.approved).toBe(0);
      expect(stats.rejected).toBe(0);
    });

    // Test with mixed statuses
    it('should calculate correct statistics for applications with different statuses', () => {
      const applications = [
        { status: 'pending' },
        { status: 'pending' },
        { status: 'approved' },
        { status: 'approved' },
        { status: 'approved' },
        { status: 'rejected' },
      ];
      
      const stats = calculateApplicationStats(applications);
      
      // Should have 6 total
      expect(stats.total).toBe(6);
      expect(stats.pending).toBe(2);
      expect(stats.approved).toBe(3);
      expect(stats.rejected).toBe(1);
    });

    // Testing null/undefined cases
    it('should handle null/undefined applications array', () => {
      const stats1 = calculateApplicationStats(null as any);
      expect(stats1.total).toBe(0);
      
      const stats2 = calculateApplicationStats(undefined as any);
      expect(stats2.total).toBe(0);
    });

    it('should calculate statistics correctly with only pending applications', () => {
      const applications = createMockApplications(5, 'pending');
      const stats = calculateApplicationStats(applications);
      
      expect(stats.total).toBe(5);
      expect(stats.pending).toBe(5);
      expect(stats.approved).toBe(0);
      expect(stats.rejected).toBe(0);
    });

    it('should calculate statistics correctly with only approved applications', () => {
      const applications = createMockApplications(3, 'approved');
      const stats = calculateApplicationStats(applications);
      
      expect(stats.total).toBe(3);
      expect(stats.pending).toBe(0);
      expect(stats.approved).toBe(3);
      expect(stats.rejected).toBe(0);
    });

    it('should calculate statistics correctly with only rejected applications', () => {
      const applications = createMockApplications(2, 'rejected');
      const stats = calculateApplicationStats(applications);
      
      expect(stats.total).toBe(2);
      expect(stats.pending).toBe(0);
      expect(stats.approved).toBe(0);
      expect(stats.rejected).toBe(2);
    });
  });
});

