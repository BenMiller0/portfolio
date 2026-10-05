import { useState } from 'react';
import ProjectIcon from '../components/ProjectIcon';
import '../assets/project-details.css';

const projectSummaries = {
  project1: 'Turning live speech into animatronic movement.',
  project2: 'Flash, observe, and verify firmware on physical hardware remotely.',
  project3: 'Embedded audio and lighting for a full-size Darth Vader suit.',
  project4: 'From a wand gesture to a real-world response.',
  project5: 'Exploring what theme park wait times reveal about guest demand.',
  project6: 'A place to discover and organize campus events.',
  project7: 'Faster file compression through parallel processing.'
};

const photoCaptions = {
  'Taro.png': 'Taro, the interactive animatronic',
  'vader_suit.jpg': 'The finished Darth Vader suit',
  'vader_embedded.jpg': 'Inside the embedded electronics',
  'wand_spell_caster.jpg': 'The spell-casting wand',
  'full_wand_system.jpg': 'The full spell-casting system',
  'VIS-SSH-ON1.png': 'Remote verification system - view 1',
  'VIS-SSH-ON2.png': 'Remote verification system - view 2',
  'ML_theme_park_wait_times_predictions.png': 'Theme park wait-time predictions',
  'campus_events_planner.png': 'The campus events planner'
};

const getSafeExternalUrl = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

const ExternalArrow = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5 15 15 5M5 5h10v10" /></svg>
);

const ProjectWindowContent = ({ project }) => {
  const githubUrl = project.github ? getSafeExternalUrl(project.github) : null;
  const miscUrl = project.miscLink?.url ? getSafeExternalUrl(project.miscLink.url) : null;
  const technologies = (project.technologies || '').split(',').map(item => item.trim()).filter(Boolean);
  const description = (project.description || '').split('\n').map(line => line.trim()).filter(Boolean);
  const photos = project.photos || [];

  return (
    <article className={`project-detail project-detail-${project.id}`}>
      <header className="project-detail-hero">
        <div className="project-detail-heading">
          <h2>{project.title}</h2>
          {projectSummaries[project.id] && <p className="project-detail-summary">{projectSummaries[project.id]}</p>}
        </div>
        <div className="project-detail-emblem"><ProjectIcon projectId={project.id} /></div>
        {(githubUrl || (miscUrl && project.miscLink?.displayName)) && (
          <nav className="project-detail-links" aria-label="Project links">
            {miscUrl && project.miscLink?.displayName && (
              <a className="project-detail-link" href={miscUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
                {project.miscLink.displayName}<ExternalArrow />
              </a>
            )}
            {githubUrl && (
              <a className="project-detail-link" href={githubUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
                Source on GitHub<ExternalArrow />
              </a>
            )}
          </nav>
        )}
      </header>
      <div className="project-detail-body">
        {description.length > 0 && <section className="project-detail-overview">
          <h3>About</h3>
          <div className="project-detail-story">{description.map((line, index) => <p key={index}>{line}</p>)}</div>
        </section>}
        {technologies.length > 0 && <section className="project-detail-stack">
          <h3>Technologies used</h3>
          <p className="project-detail-technologies">{technologies.join(', ')}</p>
        </section>}
        {photos.length > 0 && (
          <section className="project-detail-gallery">
            <h3>Photo Gallery</h3>
            <div className={`project-detail-photos${photos.length === 1 ? ' project-detail-photos-single' : ''}`}>
              {photos.map((photo, index) => (
                <ProjectImage key={photo} photo={photo} projectTitle={project.title} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

const ProjectImage = ({ photo, projectTitle, index }) => {
  const [failed, setFailed] = useState(false);
  const src = `/project_photos/${encodeURIComponent(photo)}`;
  const caption = photoCaptions[photo] || `${projectTitle}, view ${index + 1}`;
  return (
    <figure className="project-detail-photo-card">
      {failed ? <div className="project-detail-photo-fallback">Image unavailable</div> : <a className="project-detail-photo-link" href={src} target="_blank" rel="noopener noreferrer" aria-label={`View full-size image: ${caption} (opens in a new tab)`}>
        <img src={src} alt={caption} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      </a>}
      <figcaption>{caption}</figcaption>
    </figure>
  );
};

export default ProjectWindowContent;
