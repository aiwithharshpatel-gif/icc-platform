import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-project.supabase.co";

  if (supabaseUrl.includes("mock-project.supabase.co")) {
    return {
      auth: {
        getUser: async () => {
          const cookie = cookieStore.get("icc_mock_session")?.value;
          return { data: { user: cookie ? JSON.parse(cookie) : null }, error: null };
        },
        signInWithPassword: async ({ email }: { email: string }) => {
          const mockUser = {
            id: email.includes("sameer") ? "admin-id" : "mock-user-server",
            email,
            user_metadata: { full_name: email.split("@")[0] }
          };
          cookieStore.set("icc_mock_session", JSON.stringify(mockUser), { path: "/" });
          return { data: { user: mockUser }, error: null };
        },
        signUp: async ({ email, options }: any) => {
          const mockUser = {
            id: email.includes("sameer") ? "admin-id" : "mock-user-server",
            email,
            user_metadata: options?.data || { full_name: email.split("@")[0] }
          };
          cookieStore.set("icc_mock_session", JSON.stringify(mockUser), { path: "/" });
          return { data: { user: mockUser }, error: null };
        },
        signOut: async () => {
          cookieStore.delete("icc_mock_session");
          return { error: null };
        },
        resetPasswordForEmail: async () => ({ data: {}, error: null })
      },
      from: (table: string) => {
        return {
          select: (columns: string) => {
            return {
              eq: (field: string, value: any) => {
                return {
                  single: async () => {
                    if (table === "admin_roles") {
                      const cookie = cookieStore.get("icc_mock_session")?.value;
                      const parsed = cookie ? JSON.parse(cookie) : null;
                      const role = parsed?.email?.includes("sameer") || parsed?.email?.includes("admin") ? "admin" : "member";
                      return { data: { role }, error: null };
                    }
                    return { data: null, error: { message: "Not found" } };
                  }
                };
              }
            };
          },
          update: () => ({
            eq: () => ({
              then: (fn: any) => fn({ error: null })
            })
          })
        };
      }
    } as any;
  }

  return createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored when called from Server Components during rendering
          }
        },
      },
    }
  );
};

