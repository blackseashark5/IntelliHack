import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LeadManagement } from './pages/LeadManagement';
import { Dashboard } from './pages/Dashboard';
import { HelpSupport } from './pages/HelpSupport';
import { Calendar } from './pages/Calendar';
import { Communications } from './pages/Communications';
import { RevenueAnalytics } from './pages/RevenueAnalytics';
import { Email } from './pages/Email';
import { JiraBoard } from './pages/JiraBoard';
import { Confluence } from './pages/Confluence';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<LeadManagement />} />
              <Route path="/support" element={<HelpSupport />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/communications" element={<Communications />} />
              <Route path="/analytics" element={<RevenueAnalytics />} />
              <Route path="/email" element={<Email />} />
              <Route path="/jira" element={<JiraBoard />} />
              <Route path="/confluence" element={<Confluence />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;