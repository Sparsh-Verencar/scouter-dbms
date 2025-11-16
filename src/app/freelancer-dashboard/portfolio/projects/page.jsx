import ProjectCard from '@/components/ui/ProjectCard';
import React from 'react';

const projects = [
  {
    title: "Personal Website",
    description: "A fully responsive website built with React and Tailwind CSS.",
    link: "https://sparsh-portfolio.com"
  },
  {
    title: "E-commerce Platform",
    description: "Developed an online store with MERN stack.",
    link: "https://github.com/sparsh/ecommerce-platform"
  },
  {
    title: "Freelance Dashboard",
    description: "A dashboard for freelancers to manage gigs and clients.",
    link: "https://github.com/sparsh/freelance-dashboard"
  },
  // add more projects here
];

const ProjectPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">My Projects</h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            link={project.link}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectPage;
