import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { AdsProvider } from './context/AdsContext';
import { ExperimentProvider } from './context/ExperimentContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
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

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AdsProvider>
          <ExperimentProvider>
            <DeepResearchProvider>
              <NotificationProvider>
                <Router>
                  <div className="flex h-screen w-screen bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300">
                    <DeepResearchStatus />
                    <Sidebar />
                    <div className="flex-1 overflow-y-auto flex flex-col">
                      <Routes>
                      <Route path="/" element={<ChatPage />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/projects/detail" element={<ProjectDetailPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/ads" element={<AdsManagementPage />} />
                      <Route path="/ads/campaigns/:id" element={<CampaignDetailPage />} />
                      <Route path="/experiments" element={<ExperimentsPage />} />
                      <Route path="/deep-research" element={<DeepResearchPage />} />
                      <Route path="/notification" element={<NotificationPage />} />
                      </Routes>
                    </div>
                  </div>
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
