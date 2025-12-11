import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "./route";

// Mock supabase before importing the route
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";

describe("/api/renter/profile", () => {
  const mockSupabaseClient: any = {
    auth: {
      getUser: vi.fn(),
      admin: {
        deleteUser: vi.fn(),
      },
      signOut: vi.fn(),
    },
    from: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as unknown as Mock).mockResolvedValue(mockSupabaseClient);
  });

  describe("GET", () => {
    it("returns 200 with user and tenant data when authenticated", async () => {
      const userData = {
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        phone_number: "1234567890",
      };

      const tenantData = {
        date_of_birth: "1990-01-01",
        address: "123 Main St",
        employment: { company: "Tech Corp", position: "Developer", income: 75000 },
        references: ["Jane Doe", "Bob Smith"],
      };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "user") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: userData,
              error: null,
            }),
          };
        } else if (table === "tenant") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: tenantData,
              error: null,
            }),
          };
        }
      });

      const req = new NextRequest("http://localhost/api/renter/profile");
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.email).toBe("john@example.com");
      expect(json.first_name).toBe("John");
      expect(json.date_of_birth).toBe("1990-01-01");
      expect(json.employment).toEqual(tenantData.employment);
      expect(json.references).toEqual(["Jane Doe", "Bob Smith"]);
    });

    it("returns 401 when not authenticated", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Not authenticated" },
      });

      const req = new NextRequest("http://localhost/api/renter/profile");
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe("Not authenticated");
    });

    it("returns 500 when user fetch fails", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      });

      const req = new NextRequest("http://localhost/api/renter/profile");
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe("Failed to load user data");
    });

    it("returns user data with default employment/references when tenant fetch fails", async () => {
      const userData = {
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        phone_number: "1234567890",
      };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "user") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: userData,
              error: null,
            }),
          };
        } else if (table === "tenant") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Tenant not found" },
            }),
          };
        }
      });

      const req = new NextRequest("http://localhost/api/renter/profile");
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.employment).toEqual({ company: "", position: "", income: 0 });
      expect(json.references).toEqual([]);
    });
  });

  describe("POST", () => {
    it("updates user and tenant data successfully", async () => {
      const body = {
        first_name: "Jane",
        last_name: "Smith",
        phone_number: "9876543210",
        email: "jane@example.com",
        date_of_birth: "1992-05-15",
        address: "456 Oak Ave",
        employment: { company: "New Corp", position: "Manager", income: 90000 },
        references: ["Alice", "Charlie"],
      };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "user") {
          return {
            upsert: vi.fn().mockReturnThis(),
            select: vi.fn().mockResolvedValue({
              data: [body],
              error: null,
            }),
          };
        } else if (table === "tenant") {
          return {
            upsert: vi.fn().mockReturnThis(),
            select: vi.fn().mockResolvedValue({
              data: [body],
              error: null,
            }),
          };
        }
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toBe("User updated successfully");
      expect(json.data).toBeDefined();
    });

    it("returns 400 when no fields to update", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe("No fields to update");
    });

    it("returns 401 when not authenticated", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Not authenticated" },
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "POST",
        body: JSON.stringify({ first_name: "Jane" }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe("Not authenticated");
    });

    it("returns 500 when user upsert fails", async () => {
      const body = { first_name: "Jane" };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Upsert failed" },
        }),
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe("Failed to update user data");
    });

    it("returns 500 when tenant upsert fails", async () => {
      const body = {
        first_name: "Jane",
        date_of_birth: "1992-05-15",
      };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "user") {
          return {
            upsert: vi.fn().mockReturnThis(),
            select: vi.fn().mockResolvedValue({
              data: [body],
              error: null,
            }),
          };
        } else if (table === "tenant") {
          return {
            upsert: vi.fn().mockReturnThis(),
            select: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Tenant upsert failed" },
            }),
          };
        }
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe("Failed to update tenant data");
    });
  });

  describe("DELETE", () => {
    it("deletes user and tenant data successfully", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });

      mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({
        data: null,
        error: null,
      });

      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null,
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "DELETE",
      });

      const res = await DELETE(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toBe("User deleted successfully");
      expect(mockSupabaseClient.auth.admin.deleteUser).toHaveBeenCalledWith("user-123");
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    });

    it("returns 401 when not authenticated", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Not authenticated" },
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "DELETE",
      });

      const res = await DELETE(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toBe("Not authenticated");
    });

    it("returns 500 when user delete fails", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      mockSupabaseClient.from.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Delete failed" },
        }),
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "DELETE",
      });

      const res = await DELETE(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe("Failed to delete user data");
    });

    it("returns 500 when tenant delete fails", async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      let callCount = 0;
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === "user" && callCount === 0) {
          callCount++;
          return {
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          };
        } else if (table === "tenant") {
          return {
            delete: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Tenant delete failed" },
            }),
          };
        }
      });

      const req = new NextRequest("http://localhost/api/renter/profile", {
        method: "DELETE",
      });

      const res = await DELETE(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.error).toBe("Failed to delete tenant data");
    });
  });
});