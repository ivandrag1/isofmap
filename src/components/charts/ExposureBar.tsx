export function ExposureBar({ value }: { value: number }) {
  return (
    <div>
      <div className="meter"><div className="meterFill" style={{ width: `${value}%` }} /></div>
      <p className="muted">Тази оценка показва доколко задачите в професията могат да бъдат автоматизирани или подпомогнати от AI.</p>
    </div>
  );
}
