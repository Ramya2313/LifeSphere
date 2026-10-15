export default function StatCard({ title, value, subtitle }) {
  return (
    <article className="stat">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{subtitle}</p>
    </article>
  );
}