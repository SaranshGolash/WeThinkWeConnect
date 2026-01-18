import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';

// Contexts
import { SocketProvider } from './context/SocketContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute'; 

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Feature Pages
import Feed from './features/unfinished/Feed';
import Lobby from './features/echoSwap/Lobby';
import SplitScreenSession from './features/echoSwap/SplitScreenSession';
import ConflictLobby from './features/middleGround/ConflictLobby';
import ConflictRoom from './features/middleGround/ConflictRoom';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SocketProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<LoginPage />} />

            {/* Protected Routes */}
            
            {/* Dashboard */}
            <Route 
              path={ROUTES.DASHBOARD} 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            {/* Core Feature 1: Unfinished */}
            <Route 
              path={ROUTES.UNFINISHED} 
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              } 
            />

            {/* Core Feature 2: EchoSwap */}
            <Route 
              path={ROUTES.ECHOSWAP} 
              element={
                <PrivateRoute>
                  <Lobby />
                </PrivateRoute>
              } 
            />
            <Route 
              path={ROUTES.ECHOSWAP_SESSION} 
              element={
                <PrivateRoute>
                  <SplitScreenSession />
                </PrivateRoute>
              } 
            />

            {/* Core Feature 3: Middle Ground */}
            <Route 
              path={ROUTES.CONFLICT} 
              element={
                <PrivateRoute>
                  <ConflictLobby />
                </PrivateRoute>
              } 
            />
            <Route 
              path={ROUTES.CONFLICT_SESSION} 
              element={
                <PrivateRoute>
                  <ConflictRoom />
                </PrivateRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </SocketProvider>
    </Router>
  );
}

export default App;