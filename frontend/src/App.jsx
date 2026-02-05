import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import { AdsProvider } from './context/AdsContext';
import { ExperimentProvider } from './context/ExperimentContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import ProjectsPage from './pages/ProjectsPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import AdsManagementPage from './pages/AdsManagementPage';
import ExperimentsPage from './pages/ExperimentsPage';
import DeepResearchPage from './pages/DeepResearchPage';
import DeepResearchStatus from './components/DeepResearchStatus';
import { DeepResearchProvider } from './context/DeepResearchContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AdsProvider>
          <ExperimentProvider>
            <DeepResearchProvider>
              <Router>
                <div className="flex h-screen w-screen bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300">
                  <DeepResearchStatus />
                  <Sidebar />
                  <div className="flex-1 overflow-y-auto flex flex-col">
                    <Routes>
                      <Route path="/" element={<ChatPage />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/ads" element={<AdsManagementPage />} />
                      <Route path="/experiments" element={<ExperimentsPage />} />
                      <Route path="/deep-research" element={<DeepResearchPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </div>
                </div>
              </Router>
            </DeepResearchProvider>
          </ExperimentProvider>
        </AdsProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
