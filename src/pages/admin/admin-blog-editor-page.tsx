import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { blocksToHtml } from "@/lib/blocks-to-html";
import { AnimatedPage } from "@/components/admin/admin-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import BlogEditor from "@/components/admin/blog-editor";
import DraggableContentBlocks, {
  type ContentBlock,
} from "@/components/admin/draggable-content-blocks";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  status: "draft" | "published" | "archived";
  tags: string;
  contentBlocks: ContentBlock[];
}

const AdminBlogEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = id && id !== "new";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    status: "draft",
    tags: "",
    contentBlocks: [],
  });

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Článek nenalezen");
        navigate("/admin/blogs");
        return;
      }

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content?.html || "",
        featured_image: data.featured_image || "",
        status: data.status,
        tags: data.tags?.join(", ") || "",
        contentBlocks: (data.content?.blocks as ContentBlock[]) || [],
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Nepodařilo se načíst článek");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleSave = async (status?: "draft" | "published") => {
    if (!formData.title.trim()) {
      toast.error("Zadejte prosím název článku");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Zadejte prosím URL adresu (slug)");
      return;
    }

    try {
      setLoading(true);

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const generatedHtml =
        formData.contentBlocks.length > 0
          ? blocksToHtml(formData.contentBlocks)
          : formData.content;

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: {
          html: generatedHtml,
          blocks: formData.contentBlocks,
        },
        featured_image: formData.featured_image,
        status: status || formData.status,
        tags: tagsArray,
        author_id: user?.id,
        published_at:
          status === "published" && formData.status !== "published"
            ? new Date().toISOString()
            : undefined,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Článek byl úspěšně aktualizován");
      } else {
        const { data, error } = await supabase
          .from("blogs")
          .insert([blogData])
          .select()
          .single();

        if (error) throw error;
        toast.success("Článek byl úspěšně vytvořen");
        navigate(`/admin/blogs/edit/${data.id}`);
      }
    } catch (error: any) {
      console.error("Error saving blog:", error);
      if (error.code === "23505") {
        toast.error("Článek s touto URL adresou již existuje");
      } else {
        toast.error("Nepodařilo se uložit článek");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Načítání článku...</p>
      </div>
    );
  }

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blogs")}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Upravit článek" : "Nový článek"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Aktualizujte svůj článek" : "Vytvořte nový článek s bohatým obsahem"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={loading}
          >
            <Save className="mr-2 size-4" />
            Uložit koncept
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={loading}
          >
            <Eye className="mr-2 size-4" />
            Publikovat
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Obsah článku</CardTitle>
              <CardDescription>
                Napište obsah článku pomocí editoru níže
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Název</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Zadejte název článku"
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL adresa (slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="url-adresa-clanku"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Krátký popis</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Stručný popis článku pro náhled"
                  rows={3}
                />
              </div>

              <Tabs defaultValue="wysiwyg" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wysiwyg">Vizuální editor</TabsTrigger>
                  <TabsTrigger value="blocks">Bloky obsahu</TabsTrigger>
                </TabsList>
                <TabsContent value="wysiwyg" className="mt-6">
                  <div className="space-y-2">
                    <Label>Hlavní obsah</Label>
                    <BlogEditor
                      content={formData.content}
                      onChange={(content) =>
                        setFormData({ ...formData, content })
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="blocks" className="mt-6">
                  <div className="space-y-2">
                    <Label>Přetáhněte bloky obsahu</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Přidávejte a uspořádávejte bloky pro vytvoření rozvržení článku
                    </p>
                    <DraggableContentBlocks
                      blocks={formData.contentBlocks}
                      onChange={(blocks) =>
                        setFormData({ ...formData, contentBlocks: blocks })
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Nastavení</CardTitle>
                <CardDescription>Konfigurace článku</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Stav</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "draft" | "published" | "archived") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Koncept</SelectItem>
                      <SelectItem value="published">Publikováno</SelectItem>
                      <SelectItem value="archived">Archivováno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_image">URL náhledového obrázku</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) =>
                      setFormData({ ...formData, featured_image: e.target.value })
                    }
                    placeholder="https://example.com/obrazek.jpg"
                  />
                  {formData.featured_image && (
                    <div className="mt-2">
                      <img
                        src={formData.featured_image}
                        alt="Náhled"
                        className="w-full rounded-lg border object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Štítky</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="štítek1, štítek2, štítek3"
                  />
                  <p className="text-xs text-muted-foreground">
                    Štítky oddělujte čárkou
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AdminBlogEditorPage;
