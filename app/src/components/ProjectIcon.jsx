import { BirdIcon, VaderIcon, WandIcon } from './FeaturedProjectIcons';
import { VerificationIcon, ChartIcon, CalendarIcon, CompressorIcon } from './SupportingProjectIcons';

const projectIcons = {
  project1: <BirdIcon />,
  project2: <VerificationIcon />,
  project3: <VaderIcon />,
  project4: <WandIcon />,
  project5: <ChartIcon />,
  project6: <CalendarIcon />,
  project7: <CompressorIcon />
};

const ProjectIcon = ({ projectId }) => (
  <div
    className={`project-visual project-visual-${projectId}`}
    aria-hidden="true"
  >
    {projectIcons[projectId]}
  </div>
);

export default ProjectIcon;
