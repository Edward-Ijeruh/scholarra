export function NewScholarshipEmailTemplate({
  name,
  title,
  url,
}: {
  name: string;
  title: string;
  url: string;
}) {
  return (
    <div>
      <p>Hello {name},</p>
      <p>A new scholarship has been added that might interest you:</p>
      <p>
        <strong>{title}</strong>
      </p>
      <a href={url}>View Scholarship</a>
      <p>Stay consistent this could be the one.</p>
    </div>
  );
}
