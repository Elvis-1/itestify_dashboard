import React, { useState, createContext } from "react";
import { ScriptureDetails } from "../data/Scriptures";
export const ScriptureProvider = createContext();
const ScriptureContext = ({ children }) => {
  const [scriptures, setScriptures] = useState(ScriptureDetails);
  return (
    <ScriptureProvider.Provider value={{ scriptures, setScriptures }}>
      {children}
    </ScriptureProvider.Provider>
  );
};

export default ScriptureContext;
