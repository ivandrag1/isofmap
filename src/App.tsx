import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ProfessionsPage } from './pages/ProfessionsPage';
import { ProfessionDetailPage } from './pages/ProfessionDetailPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { ResultsPage } from './pages/ResultsPage';
import { ComparePage } from './pages/ComparePage';
import { MethodologyPage } from './pages/MethodologyPage';
import { DataPage } from './pages/DataPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/professions" element={<ProfessionsPage />} />
        <Route path="/professions/:id" element={<ProfessionDetailPage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
