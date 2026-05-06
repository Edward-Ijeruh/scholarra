export default function SavedScholarshipEmail({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  return (
    <div>
      <p>Hello {name},</p>
      <p>
        You saved <strong>{title}</strong>
      </p>
      <p>Don't forget to apply before the deadline.</p>
    </div>
  );
}
