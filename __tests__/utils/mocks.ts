/**
 * Mock data factories and utilities for testing
 */

export interface MockApplication {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  applied_date: string;
  property_id: number;
  property?: {
    id: number;
    name: string;
    address: string;
    monthly_rent: number;
  };
}

export interface MockProperty {
  id: number;
  name: string;
  address: string;
  status: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
}

/**
 * Create a mock application
 */
export function createMockApplication(overrides?: Partial<MockApplication>): MockApplication {
  return {
    id: 1,
    status: 'pending',
    applied_date: new Date().toISOString(),
    property_id: 1,
    property: {
      id: 1,
      name: 'Test Property',
      address: '123 Test St',
      monthly_rent: 1500,
    },
    ...overrides,
  };
}

/**
 * Create a mock property
 */
export function createMockProperty(overrides?: Partial<MockProperty>): MockProperty {
  return {
    id: 1,
    name: 'Test Property',
    address: '123 Test St',
    status: 'available',
    monthly_rent: 1500,
    bedrooms: 2,
    bathrooms: 1,
    ...overrides,
  };
}

/**
 * Create multiple mock applications
 */
export function createMockApplications(count: number, status?: 'pending' | 'approved' | 'rejected'): MockApplication[] {
  return Array.from({ length: count }, (_, i) =>
    createMockApplication({
      id: i + 1,
      status: status || (i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'approved' : 'rejected'),
    })
  );
}

