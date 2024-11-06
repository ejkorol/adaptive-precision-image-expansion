import { createContext, useContext, useState, useEffect, useRef } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorContextType {
  mousePos: CursorPosition;
  setMousePos: React.Dispatch<React.SetStateAction<CursorPosition>>;
  cursorRef: React.RefObject<HTMLDivElement>;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
  const [mousePos, setMousePos] = useState<CursorPosition>({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const handleMouse = (e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePos({ x: e.clientX, y: e.clientY });
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);

    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <CursorContext.Provider value={{ mousePos, setMousePos, cursorRef }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};
