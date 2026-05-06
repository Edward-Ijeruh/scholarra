export default function AppliedScholarshipEmail({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  return (
    <div>
      <p>Nice one, {name}</p>
      <p>
        You applied for <strong>{title}</strong>
      </p>
      <p>That’s a big step forward. We’re rooting for you</p>

      <p>Good luck!</p>
    </div>
  );
}
