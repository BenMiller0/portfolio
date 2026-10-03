import React, { useState } from 'react';

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
      <h3>Technologies</h3>
      <p>{project.technologies}</p>

      {(project.miscLink?.displayName && miscUrl) || githubUrl ? (
        <div className="project-actions" aria-label="Project links">
          {project.miscLink?.displayName && miscUrl && (
            <a className="project-action-link project-action-primary" href={miscUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
              {project.miscLink.displayName}
            </a>
          )}
          {githubUrl && (
            <a className="project-action-link" href={githubUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
              GitHub
            </a>
          )}
        </div>
      ) : null}
      
      {project.photos && project.photos.length > 0 && (
        <>
          <h3>Gallery</h3>
          <div className="photo-gallery">
            {project.photos.map((photo, index) => (
              <ProjectImage
                key={photo}
                photo={photo}
                projectTitle={project.title}
                index={index}
                total={project.photos.length}
                imageSize={project.imageSize}
              />
            ))}
          </div>
        </>
      )}
      
    </>
  );
};

const ProjectImage = ({ photo, projectTitle, index, total, imageSize }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="project-photo-fallback">Image unavailable</div>;
  }

  return (
    <img
      src={`/project_photos/${encodeURIComponent(photo)}`}
      alt={`${projectTitle}, view ${index + 1} of ${total}`}
      className={`project-photo project-photo-${imageSize || 'medium'} project-photo-${photo.replace(/\.[^/.]+$/, '')}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};

export default ProjectWindowContent;
