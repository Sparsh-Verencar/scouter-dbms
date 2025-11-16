"use client"
import ProjectCard from '@/components/ui/ProjectCard';
import React, { useEffect, useState } from 'react';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/projects/getProjects  ', {
          credentials: 'include', // send cookies for auth
        });
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        console.log(data)
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);
  if (!projects.length) return <p className="text-center mt-12">No projects found.</p>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">My Projects</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/*add project card*/}
      <div className="
        w-full 
        aspect-square 
        dark:bg-gray-900 bg-amber-50 
        p-6 flex flex-col items-center justify-center 
        rounded-2xl shadow-md 
        hover:shadow-xl hover:scale-105 
        transition-transform duration-300
        ">
          <h1 className='rounded-2xl shadow-md 
        hover:shadow-xl hover:scale-105 
        transition-transform duration-300
        text-9xl'>+</h1>
        <p>Add Projects</p>
        </div>
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.project_title}
            description={project.project_description}
            link={project.project_link}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectPage;
