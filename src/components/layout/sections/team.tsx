import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  slug: string;
  avatar_url: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

interface Team3Props {
  heading?: string;
  description?: string;
  className?: string;
}

const Team3 = ({
  heading = "Náš Tým",
  description = "Zkušení odborníci s letitými zkušenostmi připraveni vám pomoci.",
  className,
}: Team3Props) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('id, name, role, slug, avatar_url, github, twitter, linkedin')
        .eq('is_active', true)
        .order('order_index');
      setMembers(data ?? []);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <section
        className={cn(
          "bg-gradient-to-b from-background to-muted/20 py-24 lg:py-32",
          className,
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "bg-gradient-to-b from-background to-muted/20 py-24 lg:py-32",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="mb-20 text-center">
          <h2 className="mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent lg:text-6xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => navigate(`/tym/${member.slug}`)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-sky-100 dark:border-sky-900/30 bg-card p-8 transition-all duration-300 hover:-translate-y-2 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-2xl hover:shadow-sky-200/30 dark:hover:shadow-sky-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 dark:from-sky-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300/20 to-sky-200/10 blur-xl transition-all duration-300 group-hover:blur-2xl" />
                  <Avatar className="relative size-24 shadow-lg ring-4 ring-background transition-all duration-300 group-hover:ring-primary/20 lg:size-28">
                    <AvatarImage src={member.avatar_url} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-xl font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                    {member.name}
                  </h3>
                  <p className="inline-block rounded-full bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
                    {member.role}
                  </p>
                </div>

                <div className="flex gap-3">
                  {member.github && (
                    <a
                      href={member.github}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-xl bg-muted/80 p-3 transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:shadow-lg"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="size-5 text-muted-foreground transition-colors duration-300 hover:text-primary" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-xl bg-muted/80 p-3 transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:shadow-lg"
                      aria-label={`${member.name}'s twitter`}
                    >
                      <Twitter className="size-5 text-muted-foreground transition-colors duration-300 hover:text-primary" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-xl bg-muted/80 p-3 transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:shadow-lg"
                      aria-label={`${member.name}'s linkedin`}
                    >
                      <Linkedin className="size-5 text-muted-foreground transition-colors duration-300 hover:text-primary" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Team3 };
export const TeamSection = Team3;
