import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

// Mock supabase before importing the route
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

describe("/api/user POST", () => {
  const mockSupabaseClient: any = {
    from: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as unknown as Mock).mockResolvedValue(mockSupabaseClient);
  });

  it("returns 200 with existing user data when user exists", async () => {
    const existingUser = {
      id: "user-123",
      email: "john@example.com",
      first_name: "John",
      last_name: "Doe",
    };

    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: existingUser,
        error: null,
      }),
    });

    const req = new NextRequest("http://localhost/api/user", {
      method: "POST",
      body: JSON.stringify({
        id: "user-123",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("User already exists");
    expect(json.data).toEqual(existingUser);
  });

  it("returns 201 and creates new user when user does not exist", async () => {
    const newUser = {
      id: "user-456",
      email: "jane@example.com",
      first_name: "Jane",
      last_name: "Smith",
    };

    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    // Second call for insert
    mockSupabaseClient.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    mockSupabaseClient.from.mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({
        data: newUser,
        error: null,
      }),
    });

    const req = new NextRequest("http://localhost/api/user", {
      method: "POST",
      body: JSON.stringify({
        id: "user-456",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Smith",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.message).toBe("User created successfully");
    expect(json.data).toEqual(newUser);
  });

  it("returns 500 when search error occurs (not PGNF)", async () => {
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: { code: "SOME_ERROR", message: "Database error" },
      }),
    });

    const req = new NextRequest("http://localhost/api/user", {
      method: "POST",
      body: JSON.stringify({
        id: "user-789",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Error checking user existence");
  });

  it("returns 500 when insert error occurs", async () => {
    mockSupabaseClient.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    mockSupabaseClient.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    mockSupabaseClient.from.mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      }),
    });

    const req = new NextRequest("http://localhost/api/user", {
      method: "POST",
      body: JSON.stringify({
        id: "user-999",
        email: "fail@example.com",
        firstName: "Fail",
        lastName: "User",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Error creating new user");
  });

  it("returns 500 on catch block exception", async () => {
    (createClient as unknown as Mock).mockRejectedValue(
      new Error("Client creation failed")
    );

    const req = new NextRequest("http://localhost/api/user", {
      method: "POST",
      body: JSON.stringify({
        id: "user-err",
        email: "err@example.com",
        firstName: "Error",
        lastName: "Test",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});