// Explicit slugs keep shared links stable when a project's display name changes.
export const findLinkedProject = (projects, { pathname, search }) => {
  let name;
  try {
    name = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '');
  } catch {
    return null;
  }

  // The query form also works on static hosts without an SPA path rewrite.
  if (!name) name = new URLSearchParams(search).get('project') ?? '';
  name = name.toLowerCase().replace(/_/g, '-');
  if (!name) return null;

  return projects.find(project => project.slug === name || project.id === name) ?? null;
};
