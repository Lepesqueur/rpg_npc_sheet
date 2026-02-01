import React from 'react';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import CombatTab from './tabs/CombatTab';
import { CharacterProvider } from './context/CharacterContext';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <CharacterProvider>
        <div className="bg-scanline min-h-screen selection:bg-cyber-pink selection:text-white pb-20">
          <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
            <Header />
            <StatsGrid />

            <div className="min-h-[500px]">
              <CombatTab />
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
