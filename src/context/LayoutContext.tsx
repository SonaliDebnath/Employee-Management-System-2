import { createContext, useContext, useState, useEffect } from 'react';

type LayoutMode = 'modern' | 'classic';

interface LayoutContextType {
  layout: LayoutMode;
  setLayout: (mode: LayoutMode) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  layout: 'modern',
  setLayout: () => {},
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayoutState] = useState<LayoutMode>(() => {
    const saved = localStorage.getItem('layout-mode');
    return (saved === 'classic' || saved === 'modern') ? saved : 'modern';
  });

  const setLayout = (mode: LayoutMode) => {
    setLayoutState(mode);
    localStorage.setItem('layout-mode', mode);
  };

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
