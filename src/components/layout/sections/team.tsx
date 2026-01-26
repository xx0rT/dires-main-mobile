"use client";

import { motion } from "framer-motion";
import { memo, useState } from "react";

import { cn } from "@/lib/utils";

interface TeamMember {
  image: string;
  name: string;
  role: string;
  description: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  highlighted?: boolean;
}

const TeamMemberCard = memo(
  ({ member, highlighted = false }: TeamMemberCardProps) => {
    return (
      <div
        className={cn(
          "flex flex-col gap-4 px-2 md:px-5 md:pt-8",
          highlighted && "md:py-0 md:pb-4",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-2 pt-4 md:flex-row md:items-center",
            !highlighted && "border-b pb-4 md:border-b-2",
          )}
        >
          <img
            src={member.image}
            alt={`${member.name} Profile Picture`}
            className="size-full rounded border object-cover md:size-12"
          />

          <div className="flex flex-col gap-1 tracking-tight">
            <p className="line-clamp-1">{member.name}</p>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {member.role}
            </p>
          </div>
        </div>
        {highlighted && (
          <>
            <span className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500" />
            <p className="line-clamp-2 text-xs">{member.description}</p>
          </>
        )}
      </div>
    );
  },
);
TeamMemberCard.displayName = "TeamMemberCard";

interface Team11Props {
  heading?: string;
  description?: string;
  members?: TeamMember[];
  className?: string;
}

const Team11 = ({
  className,
  heading = "Meet Our Tech Team",
  description = "The innovative minds building the future of technology",
  members = [
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar1.jpg",
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      description:
        "Former Google engineer with 12 years in cloud architecture.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar2.jpg",
      name: "Marcus Rodriguez",
      role: "Lead Software Engineer",
      description: "Full-stack developer specializing in React and Node.js.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar3.jpg",
      name: "Emily Watson",
      role: "Product Manager",
      description: "Data-driven product strategist with UX design background.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar4.jpg",
      name: "David Kim",
      role: "DevOps Engineer",
      description:
        "Infrastructure automation expert making deployments seamless.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar5.jpg",
      name: "Lisa Thompson",
      role: "UX/UI Designer",
      description: "Creative designer passionate about user-centered design.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar6.jpg",
      name: "Alex Johnson",
      role: "Data Scientist",
      description: "Machine learning specialist turning data into insights.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar7.jpg",
      name: "Maria Garcia",
      role: "Frontend Developer",
      description:
        "React and TypeScript expert creating smooth user experiences.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg",
      name: "James Wilson",
      role: "Backend Developer",
      description: "API architect and database optimization specialist.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar9.jpg",
      name: "Rachel Park",
      role: "QA Engineer",
      description: "QA specialist ensuring products meet highest standards.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar10.jpg",
      name: "Ryan Foster",
      role: "Mobile Developer",
      description: "iOS and Android expert creating smooth mobile experiences.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar11.jpg",
      name: "Alexander Chen",
      role: "Security Engineer",
      description: "Cybersecurity expert protecting systems from threats.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar12.jpg",
      name: "Christian Mueller",
      role: "Technical Writer",
      description:
        "Documentation specialist making technical concepts accessible.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar13.jpg",
      name: "Sophie Anderson",
      role: "Marketing Manager",
      description: "Growth marketing expert driving user acquisition.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar13.jpg",
      name: "Joseph Gonzalez",
      role: "Sales Engineer",
      description:
        "Technical sales specialist helping clients understand solutions.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar14.jpg",
      name: "Michelle Dam",
      role: "Customer Success Manager",
      description: "Customer advocate ensuring clients achieve their goals.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar15.jpg",
      name: "Nima Motaghian",
      role: "Business Analyst",
      description:
        "Data analyst translating business requirements into solutions.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar16.jpg",
      name: "Jessica Liu",
      role: "HR Manager",
      description: "People operations specialist building company culture.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar17.jpg",
      name: "Kevin O'Brien",
      role: "Finance Manager",
      description: "Financial planning expert keeping business on track.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar18.jpg",
      name: "Amanda Torres",
      role: "Content Strategist",
      description: "Content marketing expert creating engaging tech stories.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar19.jpg",
      name: "Robert Kim",
      role: "Legal Counsel",
      description: "Technology lawyer navigating regulatory landscapes.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar20.jpg",
      name: "Jennifer Walsh",
      role: "Operations Manager",
      description: "Operations specialist ensuring smooth business functions.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar21.jpg",
      name: "Daniel Patel",
      role: "Research Engineer",
      description: "R&D specialist exploring cutting-edge technologies.",
    },
  ],
}: Team11Props) => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  return (
    <section id="team" className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col gap-14 items-center">
          <div className="flex flex-col gap-4 border-b-2 pb-6 text-center max-w-3xl">
            <h3 className="text-3xl font-light tracking-tight lg:text-6xl">
              {heading}
            </h3>
            <p className="text-sm tracking-tight text-muted-foreground lg:text-lg">
              {description}
            </p>
          </div>
          <ul
            onMouseLeave={() => setHoveredMember(null)}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center"
          >
            {members.map((member, index) => {
              return (
                <li
                  key={`team-11-member-${index}`}
                  onMouseEnter={() => setHoveredMember(index)}
                  className="relative"
                >
                  <TeamMemberCard member={member} />

                  {hoveredMember === index && (
                    <motion.div
                      layoutId="team-11-member-card"
                      transition={{
                        layout: {
                          duration: 0.2,
                          type: "spring",
                          bounce: 0.1,
                        },
                      }}
                      className="pointer-events-none absolute inset-0 z-10 hidden h-max rounded-2xl bg-background shadow-lg md:block dark:border"
                    >
                      <TeamMemberCard member={member} highlighted />
                    </motion.div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export { Team11 };
export const TeamSection = Team11;
