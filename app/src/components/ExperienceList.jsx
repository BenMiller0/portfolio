const ExperienceList = ({ entries }) => (
  <div className="experience-list">
    {entries.map(experience => (
      <section key={experience.role} className="experience-item">
        <h3>{experience.role}</h3>
        <p className="experience-dates">{experience.dates}</p>
        <ul>
          {experience.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
        </ul>
      </section>
    ))}
  </div>
);

export default ExperienceList;
