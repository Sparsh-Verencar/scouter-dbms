import React from 'react';

const ProjectCard = ({
    title = "Ola Amigos",
    description = "Comes tas",
    link = "https://localhost"
}) => {
    return (
        <div className="
        w-full 
        aspect-square 
        dark:bg-gray-900 bg-amber-50 
        p-6 flex flex-col justify-between 
        rounded-2xl shadow-md 
        hover:shadow-xl hover:scale-105 
        transition-transform duration-300
        ">

            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                <p className="text-gray-700 dark:text-gray-300">{description}</p>
            </div>
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block px-5 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
            >
                View Project
            </a>
        </div>
    );
}

export default ProjectCard;
