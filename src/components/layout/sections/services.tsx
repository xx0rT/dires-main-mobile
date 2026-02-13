import { useEffect, useState } from 'react';
import { CaseStudies3 } from '@/components/ui/case-studies-3';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

export const ServicesSection = () => {
    const [featuredBlog, setFeaturedBlog] = useState<any>(null);
    const [otherBlogs, setOtherBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data } = await supabase
                .from('blog_posts')
                .select('id, slug, title, excerpt, featured_image, category, published_at')
                .eq('status', 'published')
                .order('published_at', { ascending: false })
                .limit(3);

            if (data && data.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.length);
                const featured = data[randomIndex];
                const others = data.filter((_, idx) => idx !== randomIndex).slice(0, 2);

                const titleParts = featured.title.split(':');
                const mainTitle = titleParts[0]?.trim() || featured.title;
                const subtitle = titleParts[1]?.trim() || '';

                setFeaturedBlog({
                    logo: "/logo.svg",
                    company: "Nedávné Články",
                    tags: `${featured.category.toUpperCase()} / ${format(new Date(featured.published_at), 'd. MMMM yyyy', { locale: cs }).toUpperCase()}`,
                    title: mainTitle,
                    subtitle: subtitle,
                    image: featured.featured_image || "https://images.pexels.com/photos/6111597/pexels-photo-6111597.jpeg",
                    link: `/blog/${featured.slug}`,
                });

                setOtherBlogs(others.map(blog => {
                    const titleParts = blog.title.split(':');
                    const mainTitle = titleParts[0]?.trim() || blog.title;
                    const subtitle = titleParts[1]?.trim() || '';

                    return {
                        logo: "/logo.svg",
                        company: "Blog",
                        tags: `${blog.category.toUpperCase()} / ${format(new Date(blog.published_at), 'd. MMMM yyyy', { locale: cs }).toUpperCase()}`,
                        title: mainTitle,
                        subtitle: subtitle,
                        image: blog.featured_image || "https://images.pexels.com/photos/6111597/pexels-photo-6111597.jpeg",
                        link: `/blog/${blog.slug}`,
                    };
                }));
            }

            setLoading(false);
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <section id="services" className="w-full py-32 overflow-visible">
                <div className="container mx-auto flex justify-center">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="services" className="w-full py-0 overflow-visible">
            <CaseStudies3
                featuredCasestudy={featuredBlog}
                casestudies={otherBlogs}
            />
        </section>
    );
};
