import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { AnimatedPage } from "@/components/admin/admin-motion";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  featured_image: string;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
}

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Nepodařilo se načíst články");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", blogToDelete);

      if (error) throw error;

      toast.success("Článek byl úspěšně smazán");
      fetchBlogs();
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Nepodařilo se smazat článek");
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Publikováno</Badge>;
      case "draft":
        return <Badge variant="secondary">Koncept</Badge>;
      case "archived":
        return <Badge variant="outline">Archivováno</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Správa blogu</h1>
          <p className="text-muted-foreground">
            Vytvářejte a spravujte blogové články
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/blogs/new">
            <Plus className="mr-2 size-4" />
            Nový článek
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Články</CardTitle>
            <CardDescription>
              Spravujte všechny své články na jednom místě
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute top-3 left-3 size-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat články..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="mr-2 size-4" />
                  <SelectValue placeholder="Filtrovat podle stavu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všechny stavy</SelectItem>
                  <SelectItem value="published">Publikováno</SelectItem>
                  <SelectItem value="draft">Koncept</SelectItem>
                  <SelectItem value="archived">Archivováno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Načítání článků...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2">
                <p className="text-muted-foreground">Žádné články nenalezeny</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/blogs/new">
                    <Plus className="mr-2 size-4" />
                    Vytvořit první článek
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Název</TableHead>
                      <TableHead>Stav</TableHead>
                      <TableHead>Zobrazení</TableHead>
                      <TableHead>Publikováno</TableHead>
                      <TableHead>Aktualizováno</TableHead>
                      <TableHead className="text-right">Akce</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {blog.featured_image && (
                              <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="size-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{blog.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {blog.excerpt}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(blog.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="size-4 text-muted-foreground" />
                            <span>{blog.view_count}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {blog.published_at ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="size-4 text-muted-foreground" />
                              {format(new Date(blog.published_at), "d. MMM yyyy", { locale: cs })}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Nepublikováno
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(blog.updated_at), "d. MMM yyyy", { locale: cs })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" size="sm">
                              <Link to={`/admin/blogs/edit/${blog.id}`}>
                                <Edit className="size-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setBlogToDelete(blog.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="size-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smazat článek</DialogTitle>
            <DialogDescription>
              Opravdu chcete smazat tento článek? Tuto akci nelze vrátit zpět.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Zrušit
            </Button>
            <Button variant="destructive" onClick={handleDeleteBlog}>
              Smazat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  );
};

export default AdminBlogsPage;
