import React from 'react';

const getSafeExternalUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

const ProjectWindowContent = ({ project }) => {
  const githubUrl = project.github ? getSafeExternalUrl(project.github) : null;
  const miscUrl = project.miscLink?.url ? getSafeExternalUrl(project.miscLink.url) : null;

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
                className={`project-photo project-photo-${project.imageSize || 'medium'} project-photo-${photo.replace(/\.[^/.]+$/, '')}`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </>
      )}
      
      {project.miscLink?.displayName && miscUrl && (
        <h3>
          <a href={miscUrl} target="_blank" rel="noopener noreferrer">
            {project.miscLink.displayName}
          </a>
        </h3>
      )}
      
      {githubUrl && <h3><a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a></h3>}
    </>
  );
};

export default ProjectWindowContent;
