import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';

// Components
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Feature Pages
import Feed from './features/unfinished/Feed';
import Lobby from './features/echoSwap/Lobby';
import SplitScreenSession from './features/echoSwap/SplitScreenSession';
import ConflictRoom from './features/middleGround/ConflictRoom';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background text-gray-200 font-sans selection:bg-fog selection:text-black flex flex-col">
        
        {/* Navigation Bar (Always Visible) */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow container mx-auto px-6 py-8 max-w-5xl">
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<LoginPage />} />

            {/* Protected/Feature Routes */}
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            
            {/* Unfinished Module */}
            <Route path={ROUTES.UNFINISHED} element={<Feed />} />

            {/* EchoSwap Module */}
            <Route path={ROUTES.ECHOSWAP} element={<Lobby />} />
            <Route path={ROUTES.ECHOSWAP_SESSION} element={<SplitScreenSession />} />

            {/* Middle Ground Module */}
            <Route path={ROUTES.CONFLICT} element={<ConflictRoom />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;