import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  _isNew?: boolean;
  _dirty?: boolean;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

const AdminCategories = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, display_order")
      .order("display_order");
    if (error) toast.error(error.message);
    setCats((data ?? []) as Category[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function update(idx: number, patch: Partial<Category>) {
    const n = [...cats];
    n[idx] = { ...n[idx], ...patch, _dirty: true };
    setCats(n);
  }

  function addNew() {
    setCats([
      ...cats,
      {
        id: crypto.randomUUID(),
        name: "",
        slug: "",
        description: "",
        display_order: cats.length,
        _isNew: true,
        _dirty: true,
      },
    ]);
  }

  async function remove(c: Category) {
    if (!confirm(`Delete "${c.name || "this category"}"?`)) return;
    if (c._isNew) {
      setCats(cats.filter((x) => x.id !== c.id));
      return;
    }
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Category deleted");
    void load();
  }

  async function saveAll() {
    setSaving(true);
    try {
      const dirty = cats.filter((c) => c._dirty && c.name);
      for (const c of dirty) {
        const slug = c.slug || slugify(c.name);
        if (c._isNew) {
          const { error } = await supabase.from("categories").insert({
            name: c.name,
            slug,
            description: c.description || null,
            display_order: c.display_order,
          });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("categories")
            .update({
              name: c.name,
              slug,
              description: c.description || null,
              display_order: c.display_order,
            })
            .eq("id", c.id);
          if (error) throw error;
        }
      }
      toast.success("Categories saved");
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
            Categories
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2">
            Organize your collection.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addNew} className="h-11">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
          <Button
            onClick={saveAll}
            disabled={saving}
            className="bg-foreground hover:bg-foreground/90 text-background h-11 px-6 font-sans text-xs tracking-ultra uppercase"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground font-sans text-sm">Loading...</p>
      ) : cats.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="font-sans text-sm text-muted-foreground mb-4">No categories yet.</p>
          <Button variant="outline" onClick={addNew}>Create your first category</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cats.map((c, idx) => (
            <div key={c.id} className="border border-border p-6 space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans text-xs tracking-wide uppercase">Name</Label>
                  <Input
                    value={c.name}
                    onChange={(e) => update(idx, { name: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs tracking-wide uppercase">Slug</Label>
                  <Input
                    placeholder={slugify(c.name)}
                    value={c.slug}
                    onChange={(e) => update(idx, { slug: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs tracking-wide uppercase">Order</Label>
                  <Input
                    type="number"
                    value={c.display_order}
                    onChange={(e) => update(idx, { display_order: Number(e.target.value) })}
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs tracking-wide uppercase">Description</Label>
                <Textarea
                  rows={2}
                  value={c.description ?? ""}
                  onChange={(e) => update(idx, { description: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(c)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
