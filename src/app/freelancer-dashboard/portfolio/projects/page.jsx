"use client"
import ProjectCard from '@/components/ui/ProjectCard';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    
    fetchProjects();
  }, []);
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
  if (!projects.length) return <p className="text-center mt-12">No projects found.</p>;
  const handleAddProject = async (e) => {
    e.preventDefault();

    const form = e.target;

    const newProject = {
      project_title: form.title.value,
      project_description: form.description.value,
      project_link: form.link.value,
    };

    try {
      const res = await fetch("http://localhost:3001/api/projects/addProject", {
        method: "POST",
        credentials: "include", // sends cookies (auth)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) throw new Error("Failed to add project");

      const savedProject = await res.json();

      // Optional: Update UI instantly
      fetchProjects()

      form.reset();
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

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
          <Dialog>

            {/* Trigger opens the dialog */}
            <DialogTrigger asChild>
              <div>
                <h1 className='text-9xl hover:scale-105 transition-transform duration-300'>+</h1>
                <p>Add Projects</p>
              </div>
            </DialogTrigger>

            {/* Dialog Content contains the form */}
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddProject}>

                <DialogHeader>
                  <DialogTitle>Enter project details</DialogTitle>
                  <DialogDescription>
                    Adding projects can enhance your portfolio
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="title-1">Project Title</Label>
                    <Input id="title-1" name="title" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="description-1">Project Description</Label>
                    <Input id="description-1" name="description" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="link-1">Project Link</Label>
                    <Input id="link-1" name="link" />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <Button type="submit">Add Project</Button>
                </DialogFooter>

              </form>
            </DialogContent>

          </Dialog>
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
