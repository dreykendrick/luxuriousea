import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(1, "Required").max(100),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  useEffect(() => {
    if (!loading && user) navigate("/account", { replace: true });
  }, [user, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            data: { full_name: parsed.data.fullName },
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
        if (error) throw error;
        
        if (data?.session) {
          toast.success("Account created successfully!");
          navigate("/account");
        } else {
          toast.success("Check your email", {
            description: "Click the confirmation link we sent to finish creating your account.",
          });
        }
      } else {
        const parsed = signInSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back");
        navigate("/account");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("ratelimit")) {
        toast.error("Email rate limit exceeded", {
          description: "Supabase's built-in email service is limited. To bypass this, configure a custom SMTP provider or disable 'Confirm Email' in your Supabase Dashboard under Authentication -> Providers.",
          duration: 10000,
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24 min-h-screen">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                Account
              </p>
              <h1
                className="font-serif text-4xl lg:text-5xl font-light"
                style={{ letterSpacing: "-0.02em" }}
              >
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </h1>
            </div>

            <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
              <TabsList className="grid grid-cols-2 mb-8 bg-secondary/50">
                <TabsTrigger value="signin" className="font-sans text-xs tracking-ultra uppercase">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="font-sans text-xs tracking-ultra uppercase">
                  Create Account
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                <TabsContent value="signup" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-sans text-xs tracking-wide uppercase">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="h-12"
                      required={mode === "signup"}
                    />
                  </div>
                </TabsContent>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-sans text-xs tracking-wide uppercase">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-sans text-xs tracking-wide uppercase">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="h-12"
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full h-14 bg-foreground hover:bg-foreground/90 text-background text-xs tracking-ultra uppercase font-sans font-normal"
                >
                  {busy ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </form>
            </Tabs>

            <p className="text-center mt-8 font-sans text-xs text-muted-foreground">
              By continuing you agree to our{" "}
              <Link to="/terms" className="text-foreground underline underline-offset-4">
                Terms
              </Link>{" "}
              &{" "}
              <Link to="/privacy" className="text-foreground underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
