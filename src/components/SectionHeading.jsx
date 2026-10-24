export default function SectionHeading({ label, title, description, headingId }) {
  return (
    <div className="section-heading">
      <p className="section-index"><span aria-hidden="true"></span>{label}</p>
      <div className="section-heading-copy">
        <h2 id={headingId}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
