import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { AdsProvider } from './context/AdsContext';
import { ExperimentProvider } from './context/ExperimentContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DashboardPage from './pages/DashboardPage';
import NotificationPage from './pages/NotificationPage';
import AdsManagementPage from './pages/AdsManagementPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import ExperimentsPage from './pages/ExperimentsPage';
import DeepResearchPage from './pages/DeepResearchPage';
import DeepResearchStatus from './components/DeepResearchStatus';
import { DeepResearchProvider } from './context/DeepResearchContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

/* Shared layout for app pages (sidebar + content) */
function AppLayout({ children }) {
  return (
    <div className="flex h-screen w-screen bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300">
      <DeepResearchStatus />
      <Sidebar />
      <div className="flex-1 overflow-y-auto flex flex-col">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AdsProvider>
          <ExperimentProvider>
            <DeepResearchProvider>
              <NotificationProvider>
                <Router>
                  <Routes>
                    {/* Landing page — standalone, no sidebar */}
                    <Route path="/" element={<LandingPage />} />

                    {/* App pages — wrapped in sidebar layout */}
                    <Route path="/chat" element={<AppLayout><ChatPage /></AppLayout>} />
                    <Route path="/projects" element={<AppLayout><ProjectsPage /></AppLayout>} />
                    <Route path="/projects/detail" element={<AppLayout><ProjectDetailPage /></AppLayout>} />
                    <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
                    <Route path="/ads" element={<AppLayout><AdsManagementPage /></AppLayout>} />
                    <Route path="/ads/campaigns/:id" element={<AppLayout><CampaignDetailPage /></AppLayout>} />
                    <Route path="/experiments" element={<AppLayout><ExperimentsPage /></AppLayout>} />
                    <Route path="/deep-research" element={<AppLayout><DeepResearchPage /></AppLayout>} />
                    <Route path="/notification" element={<AppLayout><NotificationPage /></AppLayout>} />
                  </Routes>
                </Router>
              </NotificationProvider>
            </DeepResearchProvider>
          </ExperimentProvider>
        </AdsProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;

