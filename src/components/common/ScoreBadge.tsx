export function ScoreBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="badge">
      <span>{label}</span>
      <strong>{value}/100</strong>
    </div>
  );
}
