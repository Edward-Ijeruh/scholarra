export function WeeklyScholarshipsEmail({
  name,
  scholarships,
}: {
  name: string;
  scholarships: {
    title: string;
    sourceURL: string;
    fundingType: string;
  }[];
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <p>Hey {name} </p>

      <p>
        Here are <strong>5 scholarships you should not miss this week</strong>:
      </p>

      <ul>
        {scholarships.map((sch, i) => (
          <li key={i} style={{ marginBottom: "12px" }}>
            <strong>{sch.title}</strong> ({sch.fundingType})
            <br />
            <a href={sch.sourceURL}>View details</a>
          </li>
        ))}
      </ul>

      <hr />

      <p>
        Instead of searching manually,{" "}
        <strong>Scholarra tracks and matches scholarships for you.</strong>
      </p>

      <p>
        Get full access: <a href="https://yourdomain.com">Use Scholarra</a>
      </p>
    </div>
  );
}
