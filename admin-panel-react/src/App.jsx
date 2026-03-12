import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tests from './pages/Tests';
import Questions from './pages/Questions';
import Analytics from './pages/Analytics';
import ImportQuestions from './pages/ImportQuestions';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/import" element={<ImportQuestions />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
