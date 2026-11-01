import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { JourneyStage } from '../types/content';

export type Stage = JourneyStage;

interface JourneyState {
  stage: JourneyStage;
  actIComplete: boolean;
  soundOn: boolean;
  calmMode: boolean;
  audioUnlocked: boolean;
}

export type JourneyAction =
  | { type: 'START_COUNTDOWN' }
  | { type: 'COUNTDOWN_COMPLETE' }
  | { type: 'BLOW_CANDLES' }
  | { type: 'OPEN_UNIVERSE' }
  | { type: 'REPLAY_UNIVERSE' }
  | { type: 'GO_TO'; stage: JourneyStage }
  | { type: 'COMPLETE_ACT_I' }
  | { type: 'SET_STAGE'; stage: JourneyStage }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_CALM' }
  | { type: 'SET_SOUND'; on: boolean }
  | { type: 'SET_CALM'; on: boolean }
  | { type: 'UNLOCK_AUDIO' }
  | { type: 'REPLAY' }
  | { type: 'GO_BACK' };

function loadFromStorage(): Partial<JourneyState> {
  try {
    const actIComplete = localStorage.getItem('subashree_bday_act_i_done') === 'true' || localStorage.getItem('actIComplete') === 'true';
    const soundOn = localStorage.getItem('subashree_bday_sound_on') !== 'false' && localStorage.getItem('soundOn') !== 'false';
    const calmMode = localStorage.getItem('subashree_bday_calm_mode') === 'true' || localStorage.getItem('calmMode') === 'true';
    return { actIComplete, soundOn, calmMode };
  } catch {
    return {};
  }
}

function saveToStorage(state: JourneyState) {
  try {
    localStorage.setItem('subashree_bday_act_i_done', String(state.actIComplete));
    localStorage.setItem('subashree_bday_sound_on', String(state.soundOn));
    localStorage.setItem('subashree_bday_calm_mode', String(state.calmMode));
  } catch {}
}

function getInitialStage(): JourneyStage {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const stageParam = params.get('stage') as JourneyStage;
      if (stageParam && ['entrance', 'countdown', 'cake', 'blessing', 'universe'].includes(stageParam)) {
        return stageParam;
      }
    } catch {}
  }
  // ALWAYS start from the beginning: Birthday letter, Countdown, Cake, Blessing!
  return 'entrance';
}

const saved = loadFromStorage();
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const initialState: JourneyState = {
  stage: getInitialStage(),
  actIComplete: false,
  soundOn: saved.soundOn ?? true,
  calmMode: saved.calmMode ?? prefersReducedMotion,
  audioUnlocked: false,
};

function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case 'START_COUNTDOWN':
    case 'GO_TO':
      return { ...state, stage: 'stage' in action ? action.stage : 'countdown' };
    case 'COUNTDOWN_COMPLETE':
      return { ...state, stage: 'cake' };
    case 'BLOW_CANDLES':
      return { ...state, stage: 'blessing' };
    case 'OPEN_UNIVERSE':
    case 'COMPLETE_ACT_I':
      return { ...state, actIComplete: true, stage: 'universe' };
    case 'REPLAY_UNIVERSE':
    case 'REPLAY':
      return { ...state, stage: 'entrance', audioUnlocked: false };
    case 'SET_STAGE':
      return { ...state, stage: action.stage };
    case 'TOGGLE_SOUND':
      return { ...state, soundOn: !state.soundOn };
    case 'TOGGLE_CALM':
      return { ...state, calmMode: !state.calmMode };
    case 'SET_SOUND':
      return { ...state, soundOn: action.on };
    case 'SET_CALM':
      return { ...state, calmMode: action.on };
    case 'UNLOCK_AUDIO':
      return { ...state, audioUnlocked: true };
    case 'GO_BACK': {
      if (state.stage === 'countdown') return { ...state, stage: 'entrance' };
      if (state.stage === 'cake') return { ...state, stage: 'countdown' };
      if (state.stage === 'blessing') return { ...state, stage: 'cake' };
      if (state.stage === 'universe') return { ...state, stage: 'blessing' };
      return state;
    }
    default:
      return state;
  }
}

export interface JourneyContextValue extends JourneyState {
  state: JourneyState;
  dispatch: React.Dispatch<JourneyAction>;
  goTo: (stage: JourneyStage) => void;
  goBack: () => void;
  completeActI: () => void;
  toggleSound: () => void;
  toggleCalm: () => void;
  unlockAudio: () => void;
  replay: () => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(journeyReducer, initialState);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  useEffect(() => {
    if (state.calmMode) {
      document.body.classList.add('calm-mode');
    } else {
      document.body.classList.remove('calm-mode');
    }
  }, [state.calmMode]);

  const value: JourneyContextValue = {
    ...state,
    state,
    dispatch,
    goTo: (stage) => dispatch({ type: 'GO_TO', stage }),
    goBack: () => dispatch({ type: 'GO_BACK' }),
    completeActI: () => dispatch({ type: 'COMPLETE_ACT_I' }),
    toggleSound: () => dispatch({ type: 'TOGGLE_SOUND' }),
    toggleCalm: () => dispatch({ type: 'TOGGLE_CALM' }),
    unlockAudio: () => dispatch({ type: 'UNLOCK_AUDIO' }),
    replay: () => dispatch({ type: 'REPLAY_UNIVERSE' }),
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
};

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) {
    throw new Error('useJourney must be used within JourneyProvider');
  }
  return ctx;
}
