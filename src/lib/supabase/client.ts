/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBrowserClient } from "@supabase/ssr";

const createMockSupabase = () => {
  return {
    auth: {
      getUser: async () => {
        if (typeof window === "undefined") return { data: { user: null }, error: null };
        const u = localStorage.getItem("icc_mock_user");
        return { data: { user: u ? JSON.parse(u) : null }, error: null };
      },
      signInWithPassword: async ({ email }: { email: string }) => {
        if (typeof window === "undefined") return { data: { user: null }, error: null };
        const users = JSON.parse(localStorage.getItem("icc_mock_users") || "[]");
        let found = users.find((u: any) => u.email === email);
        if (!found) {
          found = {
            id: email.includes("sameer") ? "admin-id" : "mock-user-" + Math.random().toString(36).substr(2, 9),
            email,
            user_metadata: { full_name: email.split("@")[0] }
          };
          users.push(found);
          localStorage.setItem("icc_mock_users", JSON.stringify(users));
        }
        localStorage.setItem("icc_mock_user", JSON.stringify(found));
        document.cookie = `icc_mock_session=${JSON.stringify(found)}; path=/`;
        return { data: { user: found }, error: null };
      },
      signUp: async ({ email, options }: any) => {
        if (typeof window === "undefined") return { data: { user: null }, error: null };
        const users = JSON.parse(localStorage.getItem("icc_mock_users") || "[]");
        const newUser = {
          id: email.includes("sameer") ? "admin-id" : "mock-user-" + Math.random().toString(36).substr(2, 9),
          email,
          user_metadata: options?.data || { full_name: email.split("@")[0] }
        };
        users.push(newUser);
        localStorage.setItem("icc_mock_users", JSON.stringify(users));
        localStorage.setItem("icc_mock_user", JSON.stringify(newUser));
        document.cookie = `icc_mock_session=${JSON.stringify(newUser)}; path=/`;
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("icc_mock_user");
          document.cookie = "icc_mock_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
        return { error: null };
      },
      onAuthStateChange: (callback: any) => {
        if (typeof window !== "undefined") {
          const u = localStorage.getItem("icc_mock_user");
          callback("SIGNED_IN", u ? { user: JSON.parse(u) } : null);
        }
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      resetPasswordForEmail: async () => ({ data: {}, error: null })
    },
    from: (table: string) => {
      return {
        select: (_columns: string) => {
          return {
            eq: (_field: string, _value: any) => {
              return {
                single: async () => {
                  if (table === "admin_roles") {
                    const u = typeof window !== "undefined" ? localStorage.getItem("icc_mock_user") : null;
                    const parsed = u ? JSON.parse(u) : null;
                    const role = parsed?.email?.includes("sameer") || parsed?.email?.includes("admin") ? "admin" : "member";
                    return { data: { role }, error: null };
                  }
                  return { data: null, error: { message: "Not found" } };
                },
                then: (fn: any) => {
                  if (table === "admin_roles") {
                    const u = typeof window !== "undefined" ? localStorage.getItem("icc_mock_user") : null;
                    const parsed = u ? JSON.parse(u) : null;
                    const role = parsed?.email?.includes("sameer") || parsed?.email?.includes("admin") ? "admin" : "member";
                    fn({ data: { role }, error: null });
                  } else {
                    fn({ data: null, error: { message: "Not found" } });
                  }
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
};

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";
  if (supabaseUrl.includes("mock-project.supabase.co")) {
    return createMockSupabase();
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createClient();

