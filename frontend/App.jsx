import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Motto from './components/Motto';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import PonkotsuSyn from './pages/Ponkotsu-syn';
import Chapter from './pages/Chapter';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className={`content-area ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
          <Header />
          <Motto />
          
          <div className="page-content-wrapper">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/PonkotsuSyn" element={<PonkotsuSyn />} />
              <Route path="/novel/:novelId/chapter/:chapterNumber" element={<Chapter />} />
              <Route path="/novel/:novelId" element={<PonkotsuSyn />} />
            </Routes>
          </div>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
