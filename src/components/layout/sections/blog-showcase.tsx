import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
}

interface BlogPostProps {
  title: string;
  slug: string;
  date: string;
  className?: string;
}

const BlogPost = ({ title, slug, date, className }: BlogPostProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[1.875rem] border-b py-10 lg:max-w-[28.125rem]",
        className,
      )}
    >
      <button
        onClick={() => navigate(`/blog/${slug}`)}
        className="group inline-block text-left text-2xl leading-[1.22] font-semibold hover:underline"
      >
        {title}
      </button>
      <div className="flex w-full flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground/60">
            by Fyzioterapie tým
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
      </div>
    </div>
  );
};

interface BlogShowcaseSectionProps {
  className?: string;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogShowcaseSection({ className }: BlogShowcaseSectionProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, featured_image, tags, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(4);

      setBlogs(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading || blogs.length === 0) {
    return null;
  }

  const topPost = blogs[0];
  const latestPosts = blogs.slice(1);

  return (
    <section className={cn("py-32", className)}>
      <div className="mx-4 sm:mx-6 lg:mx-10 rounded-2xl bg-muted/40 border border-sky-200/60 dark:border-sky-800/30 px-5 sm:px-8 lg:px-14 py-16">
        <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid grid-cols-[minmax(18.75rem,1fr)] items-start justify-start gap-2.5 md:mb-20 lg:mb-24 lg:grid-cols-[minmax(18.75rem,1fr)_minmax(12.5rem,28.125rem)] lg:gap-20">
          <h1 className="text-6xl leading-[1.22] font-bold md:text-[5rem] md:font-semibold lg:text-[7.5rem]">
            Blog
          </h1>
          <div className="pb-5">
            <p className="text-base text-foreground sm:text-lg">
              <span className="text-muted-foreground">
                Inspirace se setkává s inovací
              </span>
              <br />
              <strong>Blog Fyzioterapie</strong>
            </p>
            <div className="mt-6 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80"
                  alt="Author profile"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">Fyzioterapie tým</p>
                  <p className="text-xs text-muted-foreground">
                    Odborný obsah
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-[minmax(18.75rem,1fr)] gap-20 pb-[6.25rem] lg:grid-cols-[minmax(18.75rem,1fr)_minmax(12.5rem,28.125rem)]">
          <div>
            <div className="flex flex-col gap-[1.875rem]">
              <button
                onClick={() => navigate(`/blog/${topPost.slug}`)}
                className="group flex aspect-[1.736111111] w-full overflow-hidden rounded-[0.625rem]"
              >
                <AspectRatio
                  ratio={1.736111111}
                  className="m-auto overflow-hidden"
                >
                  <img
                    src={topPost.featured_image || '/demo-img.png'}
                    alt={topPost.title}
                    className="block size-full object-cover object-center"
                  />
                </AspectRatio>
              </button>
              <div className="flex w-full flex-col gap-5">
                <button
                  onClick={() => navigate(`/blog/${topPost.slug}`)}
                  className="group inline-block text-left text-2xl leading-[1.22] font-semibold hover:underline md:text-4xl"
                >
                  {topPost.title}
                </button>
                <p className="text-lg text-foreground">{topPost.excerpt}</p>
              </div>
              <div className="flex w-full flex-col gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground/60">
                    by Fyzioterapie tým
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(topPost.published_at || topPost.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="text-5xl leading-[1.2] font-semibold">Nejnovější</div>
            <div className="-mt-10 flex flex-col">
              {latestPosts.map((post, i) => (
                <BlogPost
                  key={`${post.id}-${i}`}
                  title={post.title}
                  slug={post.slug}
                  date={formatDate(post.published_at || post.created_at)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/blog')}
            size="lg"
            className="min-w-[200px]"
          >
            Zobrazit více článků
          </Button>
        </div>
        </div>
      </div>
    </section>
  );
}
