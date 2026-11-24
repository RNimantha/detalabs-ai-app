export type Leader = {
  name: string;
  role: string;
  bio: string;
  image?: string;
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
      bio: "Lead AI Consultant at Avonet Technologies, with 6+ years in machine learning and deep learning. MSc in AI and Data Science from the University of Sri Jayewardenepura.",
      image: "/nimantha.jpg",
      profile: "https://nimantha.detalabsai.com/",
      github: "https://github.com/RNimantha",
      linkedin: "https://www.linkedin.com/in/nimantha-bandara-986192132/",
    },
    {
      name: "Dishara Hettiarachchi",
      role: "Co-Founder",
      bio: "Principal Engineer specializing in scalable AI systems. Msc in AI and Data Science in Sri J'Pura University.",
      image: "/dishara.jpeg",
      profile: "https://www.linkedin.com/in/disharahettiarachchi/",
      linkedin: "https://www.linkedin.com/in/disharahettiarachchi/",
    },
    {
      name: "Akila Vikum",
      role: "CTO",
      image: "/akila.jpg",
      bio: "Software engineer who leads how our products are designed, built, and shipped. Experienced in building modern web applications with Angular and JavaScript technologies. Studied at the University of Colombo.",
      profile:
        "https://www.linkedin.com/in/akila-vikum-wickramasinghe-374002204/",
      linkedin:
        "https://www.linkedin.com/in/akila-vikum-wickramasinghe-374002204/",
    },
  ] satisfies Leader[],
};
