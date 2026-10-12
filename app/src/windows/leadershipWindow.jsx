import ExperienceList from '../components/ExperienceList';
import { leadershipExperience } from '../data/experience';

const LeadershipContent = () => <ExperienceList entries={leadershipExperience} />;

export const leadershipWindow = {
  id: 'leadershipWindow',
  title: 'Leadership',
  label: 'leadership.txt',
  color: 'lightgreen',
  component: LeadershipContent
};
