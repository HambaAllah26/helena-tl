import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Motto from './components/Motto';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import SynopsisPage from './pages/Ponkotsu-syn';
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
          
          {/* Main content container with consistent styling */}
          <div className="page-content-wrapper">
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/synopsis" element={<SynopsisPage />} />
            </Routes>
          </div>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
