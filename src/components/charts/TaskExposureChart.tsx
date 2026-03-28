import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Task } from '../../types';

export function TaskExposureChart({ tasks }: { tasks: Task[] }) {
  const data = tasks.map((t) => ({
    name: t.name.length > 38 ? `${t.name.slice(0, 38)}...` : t.name,
    Автоматизация: Number((t.automationPotential * 20).toFixed(0)),
    'AI подпомагане': Number((t.augmentationPotential * 20).toFixed(0)),
    'Човешка зона': Number((((t.humanJudgment + t.socialNeed + t.physicalContext) / 3) * 20).toFixed(0)),
  }));

  return (
    <div style={{ width: '100%', height: 380 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={220} />
          <Tooltip />
          <Bar dataKey="Автоматизация" stackId="a" fill="#F76D7B" />
          <Bar dataKey="AI подпомагане" stackId="a" fill="#4449E0" />
          <Bar dataKey="Човешка зона" stackId="a" fill="#333" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
