import { Briefcase, Github, Linkedin, MapPin, Twitter } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface User {
  name: string;
  avatar?: string;
  role?: string;
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

interface UserProfile6Props {
  user?: User;
  className?: string;
}

const UserProfile6 = ({
  user = {
    name: 'Alex Morgan',
    avatar:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg',
    role: 'Senior Software Engineer',
    company: 'Vercel',
    location: 'San Francisco, CA',
    bio: 'Building the future of web development. Open source contributor and TypeScript enthusiast.',
    socialLinks: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
    about:
      "I'm a software engineer with 8+ years of experience building scalable web applications. I specialize in React, TypeScript, and Node.js. Currently focused on developer tools and improving the developer experience. Previously worked at Stripe and Google. I'm passionate about open source and have contributed to several popular projects including Next.js and Tailwind CSS.",
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Vercel',
        period: '2022 - Present',
        description:
          'Leading the development of Next.js features and improving build performance.',
      },
      {
        title: 'Software Engineer',
        company: 'Stripe',
        period: '2019 - 2022',
        description:
          'Built payment infrastructure serving millions of transactions daily.',
      },
      {
        title: 'Frontend Developer',
        company: 'Google',
        period: '2016 - 2019',
        description:
          'Developed user interfaces for Google Cloud Platform products.',
      },
    ],
    projects: [
      {
        name: 'DevTools Pro',
        description:
          'A browser extension for enhanced debugging with 50k+ active users.',
        tech: ['TypeScript', 'React', 'Chrome APIs'],
      },
      {
        name: 'API Gateway',
        description:
          'Open source API management solution for microservices architectures.',
        tech: ['Go', 'Kubernetes', 'gRPC'],
      },
      {
        name: 'Design System',
        description:
          'Component library used across 20+ internal applications.',
        tech: ['React', 'Storybook', 'Tailwind'],
      },
    ],
  },
  className,
}: UserProfile6Props) => {
  const [activeTab, setActiveTab] = useState('about');

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="size-20 border-2 border-border">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">
              {user.role}
              {user.company && (
                <span>
                  {' '}
                  at <span className="font-medium">{user.company}</span>
                </span>
              )}
            </p>
            {user.location && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {user.location}
              </p>
            )}
            {user.bio && (
              <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>
            )}
            <div className="mt-3 flex items-center gap-2">
              {user.socialLinks?.twitter && (
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <a
                    href={user.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="size-4" />
                  </a>
                </Button>
              )}
              {user.socialLinks?.linkedin && (
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="size-4" />
                  </a>
                </Button>
              )}
              {user.socialLinks?.github && (
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-6 w-full"
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {user.about}
            </p>
          </TabsContent>

          <TabsContent value="experience" className="mt-4">
            <div className="space-y-4">
              {user.experience?.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-2 border-border pl-4 pb-4 last:pb-0"
                >
                  <div className="flex items-start gap-2">
                    <Briefcase className="mt-0.5 size-4 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} · {exp.period}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-4">
            <div className="grid gap-4">
              {user.projects?.map((project, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-muted px-2 py-0.5 text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserProfile6;
export type { User };
