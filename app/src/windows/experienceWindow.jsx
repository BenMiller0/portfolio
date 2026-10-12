import ExperienceList from '../components/ExperienceList';
import { workExperience } from '../data/experience';

const ExperienceContent = () => <ExperienceList entries={workExperience} />;
export const experienceWindow = {
  id: 'experienceWindow',
  title: 'Experience',
  label: 'experience.txt',
  color: '#facc15',
  component: ExperienceContent
};
