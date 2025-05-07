import React from 'react';
import Header from './components/Header';
import Motto from './components/Motto';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '240px' }}> {/* Push content to the right of sidebar */}
        <Header />
        <Motto />
        <MainContent />
      </div>
    </div>
  );
}

export default App;

