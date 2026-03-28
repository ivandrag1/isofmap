import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StudentProfile } from '../../types';

const labels: Record<keyof StudentProfile, string> = {
  analytical: 'Аналитичност',
  creative: 'Креативност',
  social: 'Социалност',
  practical: 'Практичност',
  organized: 'Организираност',
  digitalCuriosity: 'Дигитално любопитство',
  ambiguityTolerance: 'Толерантност към неяснота',
  persistence: 'Постоянство',
  communicationConfidence: 'Уверена комуникация',
};

export function StrengthsChart({ profile }: { profile: StudentProfile }) {
  const data = Object.entries(profile).map(([k, v]) => ({ име: labels[k as keyof StudentProfile], стойност: Number((v * 20).toFixed(0)) }));
  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis type="category" dataKey="име" width={190} />
          <Tooltip />
          <Bar dataKey="стойност" fill="#4449E0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
