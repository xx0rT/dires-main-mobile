const site_url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const site = {
  name: "Czech Physio Academy",
  description: "Professional physiotherapy courses taught by certified Czech practitioners",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  logo: "/logo.svg",
  mailSupport: "info@czechphysio.cz",
  mailFrom: process.env.MAIL_FROM || "noreply@czechphysio.cz",
  links: {
    twitter: "https://twitter.com/czechphysio",
    github: "https://github.com/czechphysio",
    linkedin: "https://www.linkedin.com/company/czech-physio-academy/",
  }
} as const;