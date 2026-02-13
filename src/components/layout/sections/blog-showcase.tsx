import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
}

export function BlogShowcaseSection({ className }: { className?: string }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, featured_image, tags")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3);

      setBlogs(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading || blogs.length === 0) {
    return null;
  }

  const [featuredBlog, ...otherBlogs] = blogs;

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto flex justify-center">
        <div className="border border-border max-w-7xl w-full">
          <div
            onClick={() => navigate(`/blog/${featuredBlog.slug}`)}
            className="group grid gap-4 overflow-hidden px-6 transition-colors duration-500 ease-out hover:bg-muted/40 lg:grid-cols-2 xl:px-28 cursor-pointer"
          >
            <div className="flex flex-col justify-between gap-4 pt-8 md:pt-16 lg:pb-16">
              <div className="flex items-center gap-2 text-2xl font-medium">
                Blog
              </div>
              <div>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {featuredBlog.tags?.[0] || "Fyzioterapie"}
                </span>
                <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                  {featuredBlog.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-5">
                  {featuredBlog.excerpt}
                </p>
                <div className="flex items-center gap-2 font-medium">
                  Přečíst článek
                  <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                </div>
              </div>
            </div>
            <div className="relative isolate py-16">
              <div className="relative isolate h-full border border-border bg-background p-2">
                <div className="h-full overflow-hidden">
                  <img
                    src={featuredBlog.featured_image || '/demo-img.png'}
                    alt={featuredBlog.title}
                    className="aspect-14/9 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-t border-border">
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
            <div className="grid lg:grid-cols-2">
              {otherBlogs.map((blog, idx) => (
                <div
                  key={blog.id}
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  className={`group flex flex-col justify-between gap-12 border-border bg-background px-6 py-8 transition-colors duration-500 ease-out hover:bg-muted/40 md:py-16 lg:pb-16 xl:gap-16 cursor-pointer ${
                    idx === 0
                      ? "xl:border-l xl:pl-8"
                      : "border-t lg:border-t-0 lg:border-l xl:border-r xl:pl-8"
                  }`}
                >
                  <div className="flex items-center gap-2 text-2xl font-medium">
                    Blog
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {blog.tags?.[0] || "Fyzioterapie"}
                    </span>
                    <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                      {blog.title}
                    </h2>
                    <div className="flex items-center gap-2 font-medium">
                      Přečíst článek
                      <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
