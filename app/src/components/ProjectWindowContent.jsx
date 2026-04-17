import React from 'react';

const ProjectWindowContent = ({ project }) => {
  const currentSize = project.imageSize || 'medium';

  const renderBulletPoints = (description) => {
    if (!description) return null;
    const lines = description.split('\n');
    return (
      <ul>
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <h2>{project.title}</h2>
      {renderBulletPoints(project.description)}
      <h3>Technologies Used:</h3>
      <p>{project.technologies}</p>
      
      {project.photos && project.photos.length > 0 && (
        <>
          <h3>Project Photos:</h3>
          <div className="photo-gallery">
            {project.photos.map((photo, index) => (
              <img 
                key={index}
                src={`/project_photos/${photo}`}
                alt={`${project.title} - Photo ${index + 1}`}
                className={`project-photo project-photo-${currentSize}`}
              />
            ))}
          </div>
        </>
      )}
      
      {project.miscLink && project.miscLink.displayName && project.miscLink.url && (
        <h3>
          <a href={project.miscLink.url} target="_blank" rel="noopener noreferrer">
            {project.miscLink.displayName}
          </a>
        </h3>
      )}
      
      {project.github && <h3><a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a></h3>}
    </>
  );
};

export default ProjectWindowContent;
