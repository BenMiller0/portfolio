export const MAIN_PROJECT_IDS = ['project1', 'project3', 'project4'];
export const MORE_PROJECTS_DIRECTORY = 'More Projects';

export const getProjectGroups = (projects) => ({
  mainProjects: MAIN_PROJECT_IDS
    .map(id => projects.find(project => project.id === id))
    .filter(Boolean),
  moreProjects: projects.filter(project => !MAIN_PROJECT_IDS.includes(project.id))
});
