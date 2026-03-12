import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tests from './pages/Tests';
import Questions from './pages/Questions';
import Redesigner from './pages/Redesigner';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/redesigner" element={<Redesigner />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
