"use client";

import { motion } from "framer-motion";
import { memo, useState } from "react";

import UserProfile6, { type User } from "@/components/team/user-profile-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TeamMember {
  image: string;
  name: string;
  role: string;
  description: string;
  company?: string;
  location?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  about?: string;
  experience?: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    tech: string[];
  }>;
}

interface TeamMemberCardProps {
  member: TeamMember;
  highlighted?: boolean;
  onClick?: () => void;
}

const TeamMemberCard = memo(
  ({ member, highlighted = false, onClick }: TeamMemberCardProps) => {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex flex-col gap-4 px-2 md:px-5 md:pt-8",
          highlighted && "md:py-0 md:pb-4",
          onClick && "cursor-pointer",
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
      company: "TechCorp",
      location: "San Francisco, CA",
      bio: "Passionate about cloud architecture and distributed systems.",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
      about:
        "With over 12 years of experience in cloud architecture, I've led teams at Google and now serve as CTO. My focus is on building scalable, resilient systems that power modern applications.",
      experience: [
        {
          title: "Chief Technology Officer",
          company: "TechCorp",
          period: "2021 - Present",
          description:
            "Leading technical strategy and engineering teams.",
        },
        {
          title: "Senior Engineer",
          company: "Google",
          period: "2015 - 2021",
          description: "Cloud infrastructure and architecture.",
        },
      ],
      projects: [
        {
          name: "Cloud Platform",
          description: "Scalable infrastructure for enterprise clients.",
          tech: ["Kubernetes", "AWS", "Terraform"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar2.jpg",
      name: "Marcus Rodriguez",
      role: "Lead Software Engineer",
      description: "Full-stack developer specializing in React and Node.js.",
      company: "TechCorp",
      location: "Austin, TX",
      bio: "Building elegant solutions with modern web technologies.",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
      about:
        "Full-stack engineer with a passion for creating seamless user experiences. I specialize in React, Node.js, and modern web development practices.",
      experience: [
        {
          title: "Lead Software Engineer",
          company: "TechCorp",
          period: "2020 - Present",
          description: "Leading frontend development initiatives.",
        },
      ],
      projects: [
        {
          name: "Web Application",
          description: "Modern SaaS platform serving 100k+ users.",
          tech: ["React", "Node.js", "PostgreSQL"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar3.jpg",
      name: "Emily Watson",
      role: "Product Manager",
      description: "Data-driven product strategist with UX design background.",
      company: "TechCorp",
      location: "New York, NY",
      bio: "Bridging the gap between user needs and technical solutions.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "Product manager focused on creating data-driven product strategies. With a background in UX design, I bring a user-centric approach to product development.",
      experience: [
        {
          title: "Product Manager",
          company: "TechCorp",
          period: "2019 - Present",
          description: "Leading product strategy and roadmap.",
        },
      ],
      projects: [
        {
          name: "Product Analytics",
          description: "Dashboard for tracking user engagement metrics.",
          tech: ["Analytics", "Data Visualization"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar4.jpg",
      name: "David Kim",
      role: "DevOps Engineer",
      description:
        "Infrastructure automation expert making deployments seamless.",
      company: "TechCorp",
      location: "Seattle, WA",
      bio: "Automating everything to make developers' lives easier.",
      socialLinks: {
        twitter: "https://twitter.com",
        github: "https://github.com",
      },
      about:
        "DevOps engineer specializing in CI/CD pipelines and infrastructure automation. I'm passionate about making deployments fast, reliable, and stress-free.",
      experience: [
        {
          title: "DevOps Engineer",
          company: "TechCorp",
          period: "2018 - Present",
          description: "Building and maintaining deployment infrastructure.",
        },
      ],
      projects: [
        {
          name: "CI/CD Pipeline",
          description: "Automated deployment system reducing release time by 80%.",
          tech: ["Jenkins", "Docker", "Kubernetes"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar5.jpg",
      name: "Lisa Thompson",
      role: "UX/UI Designer",
      description: "Creative designer passionate about user-centered design.",
      company: "TechCorp",
      location: "Portland, OR",
      bio: "Creating beautiful and intuitive user experiences.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "UX/UI designer with a passion for creating intuitive, beautiful interfaces. I believe great design is invisible and makes complex tasks feel simple.",
      experience: [
        {
          title: "UX/UI Designer",
          company: "TechCorp",
          period: "2017 - Present",
          description: "Designing user interfaces and experiences.",
        },
      ],
      projects: [
        {
          name: "Design System",
          description: "Comprehensive design system for consistent UX.",
          tech: ["Figma", "React", "Storybook"],
        },
      ],
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar5.jpg",
      name: "Lisa Thompson",
      role: "UX/UI Designer",
      description: "Creative designer passionate about user-centered design.",
      company: "TechCorp",
      location: "Portland, OR",
      bio: "Creating beautiful and intuitive user experiences.",
      socialLinks: {
        linkedin: "https://linkedin.com",
      },
      about:
        "UX/UI designer with a passion for creating intuitive, beautiful interfaces. I believe great design is invisible and makes complex tasks feel simple.",
      experience: [
        {
          title: "UX/UI Designer",
          company: "TechCorp",
          period: "2017 - Present",
          description: "Designing user interfaces and experiences.",
        },
      ],
      projects: [
        {
          name: "Design System",
          description: "Comprehensive design system for consistent UX.",
          tech: ["Figma", "React", "Storybook"],
        },
      ],
    },
  ],
}: Team11Props) => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const memberToUser = (member: TeamMember): User => ({
    name: member.name,
    avatar: member.image,
    role: member.role,
    company: member.company,
    location: member.location,
    bio: member.bio,
    socialLinks: member.socialLinks,
    about: member.about || member.description,
    experience: member.experience,
    projects: member.projects,
  });

  return (
    <>
      <section id="team" className={cn("py-32", className)}>
        <div className="container mx-auto">
          <div className="flex flex-col gap-14 items-center justify-center">
            <div className="flex flex-col gap-4 border-b-2 pb-6 text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-light tracking-tight lg:text-6xl">
                {heading}
              </h3>
              <p className="text-sm tracking-tight text-muted-foreground lg:text-lg">
                {description}
              </p>
            </div>
            <ul
              onMouseLeave={() => setHoveredMember(null)}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mx-auto max-w-6xl w-full"
            >
              {members.map((member, index) => {
                return (
                  <li
                    key={`team-11-member-${index}`}
                    onMouseEnter={() => setHoveredMember(index)}
                    className="relative"
                  >
                    <TeamMemberCard
                      member={member}
                      onClick={() => handleMemberClick(member)}
                    />

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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedMember?.name}</DialogTitle>
          </DialogHeader>
          {selectedMember && <UserProfile6 user={memberToUser(selectedMember)} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export { Team11 };
export const TeamSection = Team11;
