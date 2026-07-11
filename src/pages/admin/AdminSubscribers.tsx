import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Subscriber {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, status, created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setSubscribers((data ?? []) as Subscriber[]);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function remove(sub: Subscriber) {
    if (!confirm(`Remove ${sub.email} from the list?`)) return;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", sub.id);
    if (error) return toast.error(error.message);
    toast.success("Subscriber removed");
    void load();
  }

  function exportCsv() {
    const active = subscribers.filter((s) => s.status === "active");
    const csv = ["Email,Subscribed At", ...active.map((s) =>
      `${s.email},${new Date(s.created_at).toLocaleDateString()}`
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const active = subscribers.filter((s) => s.status === "active");

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
            Newsletter Subscribers
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2">
            {loading ? "Loading..." : `${active.length} active subscriber${active.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {active.length > 0 && (
          <Button
            variant="outline"
            onClick={exportCsv}
            className="h-11 font-sans text-xs tracking-wide uppercase"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground font-sans text-sm">Loading...</p>
      ) : subscribers.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <Mail className="h-8 w-8 mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-sans text-sm text-muted-foreground">No subscribers yet.</p>
          <p className="font-sans text-xs text-muted-foreground/60 mt-1">
            Subscribers will appear here when people sign up from the homepage.
          </p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {subscribers.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="font-sans text-sm truncate">{sub.email}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    Subscribed {new Date(sub.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className={`font-sans text-[10px] tracking-wide uppercase px-2 py-1 ${
                  sub.status === "active"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {sub.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(sub)}
                  className="text-destructive hover:text-destructive h-8 w-8 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;
