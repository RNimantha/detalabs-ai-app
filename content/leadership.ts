export type Leader = {
  name: string;
  role: string;
  bio: string;
  image: string;
  profile: string;
  github?: string;
  linkedin: string;
};

export const leadership = {
  title: "Our leadership team",
  description: "Meet the people leading DetaLabs AI.",
  profileLabel: "Profile",
  githubLabel: "GitHub",
  linkedinLabel: "LinkedIn",
  members: [
    {
      name: "Nimantha Bandara",
      role: "Founder & CEO",
      bio: "Current FHTS AI Consultant with 6+ years in machine learning and deep learning. Msc in AI and Data Science in Sri J'Pura University.",
      image: "/nimantha.jpg",
      profile: "https://nimantha.detalabsai.com/",
      github: "https://github.com/RNimantha",
      linkedin: "https://www.linkedin.com/in/nimantha-bandara-986192132/",
    },
    {
      name: "Dishara Hettiarachchi",
      role: "CTO & Co-Founder",
      bio: "Principal Engineer specializing in scalable AI systems. Msc in AI and Data Science in Sri J'Pura University.",
      image: "/dishara.jpeg",
      profile: "https://www.linkedin.com/in/disharahettiarachchi/",
      linkedin: "https://www.linkedin.com/in/disharahettiarachchi/",
    },
  ] satisfies Leader[],
};
