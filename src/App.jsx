import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Motto from './components/Motto';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
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
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`content-area ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <Header />
        <Motto />
        <MainContent />
        <Footer />
      </div>
    </div>
  );
}

export default App;
