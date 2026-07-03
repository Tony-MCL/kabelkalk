export default function ProjectHeader({ project, onEditProject }) {
  return (
    <section className="project-header compact">
      <div>
        <p className="eyebrow">Prosjekt</p>
        <h1>{project.name || 'Nytt prosjekt'}</h1>
        <p className="lead">
          {project.customer || 'Kunde ikke angitt'}
          {project.facility ? ` · ${project.facility}` : ''}
        </p>
      </div>
    </section>
  )
}