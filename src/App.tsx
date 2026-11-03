import React from 'react';
import { JourneyProvider, useJourney } from './journey/JourneyProvider';
import { AudioProvider } from './audio/AudioProvider';
import { FXEngine } from './components/FXEngine';
import { TopNavigation } from './components/TopNavigation';
import { MiniPlayer } from './components/MiniPlayer';
import { CelestialAtmosphere } from './components/CelestialAtmosphere';

// Act I Sections
import { Entrance } from './sections/Entrance';
import { Countdown } from './sections/Countdown';
import { Cake } from './sections/Cake';
import { Blessing } from './sections/Blessing';

// Act II Sections
import { MusicRoom } from './sections/MusicRoom';
import { Scrapbook } from './sections/Scrapbook';
import { QuoteBreather } from './sections/QuoteBreather';
import { PenguinCorner } from './sections/PenguinCorner';
import { Flowers } from './sections/Flowers';
import { SurpriseArcade } from './sections/SurpriseArcade';
import { Letter } from './sections/Letter';
import { Kavithai } from './sections/Kavithai';
import { MyWish } from './sections/MyWish';
import { FinalUniverse } from './sections/FinalUniverse';

import './styles/global.css';

const AppContent: React.FC = () => {
  const { stage } = useJourney();

  return (
    <>
      {/* Living Celestial Atmosphere Background for all stages */}
      <div className="celestial-atmosphere-fixed" aria-hidden="true">
        <CelestialAtmosphere
          variant={stage === 'blessing' ? 'blessing' : 'universe'}
          showMoon={stage === 'entrance'}
          showShootingStar={true}
        />
      </div>

      {/* Shared FX Canvas for Hearts, Butterflies & Stardust */}
      <FXEngine />

      {/* Unified Top Navigation: Back Button (Top-Left) & Sound/Controls (Top-Right) */}
      <TopNavigation />

      {/* Main Journey Stages */}
      {stage === 'entrance' && <Entrance />}
      {stage === 'countdown' && <Countdown />}
      {stage === 'cake' && <Cake />}
      {stage === 'blessing' && <Blessing />}

      {/* Act II: The Full Universe */}
      {stage === 'universe' && (
        <main style={{ position: 'relative', zIndex: 1 }}>
          <MusicRoom />
          <Scrapbook />
          <QuoteBreather initialIndex={0} />
          <PenguinCorner />
          <Flowers />
          <SurpriseArcade />
          <QuoteBreather initialIndex={4} />
          <Letter />
          <Kavithai />
          <MyWish />
          <FinalUniverse />

          {/* Persistent Mini Player in Act II */}
          <MiniPlayer />
        </main>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <JourneyProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </JourneyProvider>
  );
};

export default App;
