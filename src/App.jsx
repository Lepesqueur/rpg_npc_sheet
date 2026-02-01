import React, { useState } from 'react';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import Navigation from './components/Navigation';
import AttributesTab from './tabs/AttributesTab';
import CombatTab from './tabs/CombatTab';
import FeatTab from './tabs/FeatTab';
import { CharacterProvider } from './context/CharacterContext';
import { ToastProvider } from './components/Toast';

function App() {
  const [activeTab, setActiveTab] = useState('attributes');

  const renderTab = () => {
    switch (activeTab) {
      case 'attributes': return <AttributesTab />;
      case 'combat': return <CombatTab />;
      case 'skills': return <FeatTab />;
      default: return <AttributesTab />;
    }
  };

  return (
    <ToastProvider>
      <CharacterProvider>
        <div className="bg-scanline min-h-screen selection:bg-cyber-pink selection:text-white pb-20">
          <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
            <Header />
            <StatsGrid />
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="min-h-[500px]">
              {renderTab()}
            </div>

            <footer className="mt-20 pt-8 border-t border-white/5 text-center">

            </footer>
          </div>
        </div>
      </CharacterProvider>
    </ToastProvider>
  );
}

export default App;
