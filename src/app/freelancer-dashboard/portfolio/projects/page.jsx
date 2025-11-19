// "use client"
// import ProjectCard from '@/components/ui/ProjectCard';
// import React, { useEffect, useState } from 'react';
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from '@/components/ui/button';
// import { Label } from '@radix-ui/react-dropdown-menu';
// import { Input } from '@/components/ui/input';

// const ProjectPage = () => {
//   const [projects, setProjects] = useState([]);
//   useEffect(() => {

//     fetchProjects();
//   }, []);
//   const fetchProjects = async () => {
//     try {
//       const res = await fetch('http://localhost:3001/api/projects/getProjects  ', {
//         credentials: 'include', // send cookies for auth
//       });
//       if (!res.ok) throw new Error('Failed to fetch projects');
//       const data = await res.json();
//       console.log(data)
//       setProjects(data);
//     } catch (err) {
//       console.error('Error fetching projects:', err);
//     }
//   };
  
//   const handleAddProject = async (e) => {
//     e.preventDefault();

//     const form = e.target;

//     const newProject = {
//       project_title: form.title.value,
//       project_description: form.description.value,
//       project_link: form.link.value,
//     };

//     try {
//       const res = await fetch("http://localhost:3001/api/projects/addProject", {
//         method: "POST",
//         credentials: "include", // sends cookies (auth)
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProject),
//       });

//       if (!res.ok) throw new Error("Failed to add project");


//       // Optional: Update UI instantly
//       fetchProjects()

//       form.reset();
//     } catch (err) {
//       console.error("Error adding project:", err);
//     }
//   };

//     return (
//   <div className="max-w-7xl mx-auto px-4 py-12">
//     <h1 className="text-4xl font-bold mb-8 text-center dark:text-white">My Projects</h1>

//     <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

//       {/* Always show Add Project card */}
//       <div className="
//         w-full 
//         aspect-square 
//         dark:bg-gray-900 bg-amber-50 
//         p-6 flex flex-col items-center justify-center 
//         rounded-2xl shadow-md 
//         hover:shadow-xl hover:scale-105 
//         transition-transform duration-300
//       ">
//         <Dialog>
//           <DialogTrigger asChild>
//             <div>
//               <h1 className='text-9xl hover:scale-105 transition-transform duration-300'>+</h1>
//               <p>Add Projects</p>
//             </div>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[425px]">
//             <form onSubmit={handleAddProject}>
//               <DialogHeader>
//                 <DialogTitle>Enter project details</DialogTitle>
//                 <DialogDescription>
//                   Adding projects can enhance your portfolio
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="grid gap-4">
//                 <div className="grid gap-3">
//                   <Label htmlFor="title-1">Project Title</Label>
//                   <Input id="title-1" name="title" />
//                 </div>

//                 <div className="grid gap-3">
//                   <Label htmlFor="description-1">Project Description</Label>
//                   <Input id="description-1" name="description" />
//                 </div>

//                 <div className="grid gap-3">
//                   <Label htmlFor="link-1">Project Link</Label>
//                   <Input id="link-1" name="link" />
//                 </div>
//               </div>

//               <DialogFooter>
//                 <DialogClose asChild>
//                   <Button variant="outline">Cancel</Button>
//                 </DialogClose>
//                 <Button type="submit">Add Project</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* If no projects → show nothing else */}
//       {projects.length === 0 ? (
//         <p className="text-center col-span-full mt-6 text-lg opacity-70">
//           No projects yet — add your first one!
//         </p>
//       ) : (
//         projects.map((project, index) => (
//           <ProjectCard
//             key={index}
//             title={project.project_title}
//             description={project.project_description}
//             link={project.project_link}
//           />
//         ))
//       )}

//     </div>
//   </div>
// );

// }

// export default ProjectPage;

"use client";

import ProjectCard from "@/components/ui/ProjectCard";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

/* ---------------------------------------------
   ✨ VISUAL THEME (same as Portfolio Page)
--------------------------------------------- */

const glowWrapper = `
  w-full relative rounded-3xl p-[2px]
  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
  shadow-[0_0_25px_rgba(99,102,241,0.4)]
  transition-all duration-500
  hover:shadow-[0_0_45px_rgba(168,85,247,0.7)]
  hover:scale-[1.02]
`;

const innerCardStyle = `
  w-full h-full rounded-3xl p-6
  bg-white/90 dark:bg-gray-900/80
  backdrop-blur-2xl shadow-xl
  transition-all duration-500
  hover:shadow-2xl
`;

const pageBg = `
  bg-gradient-to-br from-gray-100 via-white to-gray-200
  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
  transition-all duration-500
`;

const headerBar = `
  w-full py-6 text-center text-3xl font-bold tracking-wide
  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
  bg-clip-text text-transparent
  drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]
`;

/* ---------------------------------------------
   ✨ COMPONENT
--------------------------------------------- */

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/projects/getProjects",
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newProject = {
      project_title: form.title.value,
      project_description: form.description.value,
      project_link: form.link.value,
    };

    try {
      const res = await fetch(
        "http://localhost:3001/api/projects/addProject",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        }
      );

      if (!res.ok) throw new Error("Failed to add project");

      fetchProjects();
      form.reset();
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  return (
    <div className={`min-h-screen px-6 py-12 ${pageBg}`}>
      <div className={headerBar}>My Projects</div>

      {/* GRID */}
      <div className="grid gap-10 mt-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">

        {/* ADD PROJECT (Glow Card) */}
        <div className={glowWrapper}>
          <div className={`${innerCardStyle} flex flex-col items-center justify-center`}>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center">
                  <span className="text-8xl font-light mb-2 text-gray-700 dark:text-gray-200">+</span>
                  <p className="text-lg opacity-80">Add Project</p>
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddProject}>
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                    <DialogDescription>
                      Showcase your work — it enhances your portfolio.
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
        </div>

        {/* PROJECT LIST */}
        {projects.length === 0 ? (
          <p className="col-span-full text-center text-lg opacity-70 mt-4">
            No projects yet — add your first one!
          </p>
        ) : (
          projects.map((project, index) => (
            <div key={index} className={glowWrapper}>
              <div className={innerCardStyle}>
                <ProjectCard
                  title={project.project_title}
                  description={project.project_description}
                  link={project.project_link}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
