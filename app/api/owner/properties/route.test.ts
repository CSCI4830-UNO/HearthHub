import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";




// Mock the Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

describe("/api/owner/properties POST", () => {
  const mockSupabaseClient: any = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as unknown as Mock).mockResolvedValue(mockSupabaseClient);
  });

  it("returns 200 and updated property when authenticated and upsert succeeds", async () => {
    const body = {
      id: "prop-1",
      name: "Test Property",
      address: "123 Main St",
      city: "Town",
      state: "ST",
      zipCode: "12345",
      propertyType: "House",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      monthlyRent: 1500,
      deposit: 1500,
      availableDate: "2025-12-01",
      description: "Nice place",
    };

    const { id, ...rest } = body;
    const updatedProperty = { id, ...rest };

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "owner-123" } },
      error: null,
    });

    mockSupabaseClient.from.mockReturnValue({
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: updatedProperty, error: null }),
    });

    const req = new NextRequest("http://localhost/api/owner/properties", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Property updated successfully");
    expect(json.data).toEqual(updatedProperty);
    // ensure createClient was called
    expect(createClient).toHaveBeenCalled();
  });

  it("returns 401 when not authenticated", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Not authenticated" },
    });

    const req = new NextRequest("http://localhost/api/owner/properties", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Not authenticated");
  });

  it("returns 500 when upsert/DB returns an error", async () => {
    const body = { id: "prop-1", name: "Test" };

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "owner-123" } },
      error: null,
    });

    mockSupabaseClient.from.mockReturnValue({
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: null, error: { message: "DB error" } }),
    });

    const req = new NextRequest("http://localhost/api/owner/properties", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to update property data");
    expect(json.details).toContain("DB error");
  });
});