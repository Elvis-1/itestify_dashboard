import React, { useState, createContext, useEffect } from "react";
// import { ScriptureDetails } from "../data/Scriptures";
export const ScriptureContext = createContext();
const ScriptureContextProvider = ({ children }) => {
  const [scriptureUploadedDetails, setScriptureUploadedDetails] = useState([]);
  const [isScriptureDetails, setIsScriptureDetails] = useState(false);
  const [eachScripture, setEachScripture] = useState(null);
  const [scriptureUpload, setScriptureUpload] = useState(() => {
    const storedScriptures = localStorage.getItem("scriptureData");
    return storedScriptures
      ? JSON.parse(storedScriptures)
      : {
          selectedDate: "",
          selectedTime: "",
          selectedTimeFormat: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("scriptureData", JSON.stringify(scriptureUpload));
  }, [scriptureUpload]);

  const [deleteModal, setDeleteModal] = useState(false);
  const deleteScripture = (id) => {
    setScriptureUploadedDetails((prev) =>
      prev.filter((scripture) => scripture.id !== id)
    );
  };

  const editScripture = (id, updatedScripture) => {
    setScriptureUploadedDetails((prev) =>
      prev.map((scripture) =>
        scripture.id === id ? { ...scripture, ...updatedScripture } : scripture
      )
    );
  };
  const uploadScheduledScripture = (id, updatedScripture) => {
    setScriptureUploadedDetails((prev) =>
      prev.map((scripture) =>
        scripture.id === id ? { ...scripture, ...updatedScripture } : scripture
      )
    );
  };

  const viewScriptureModal = (id, scriptureStatus) => {
    const scriptureDetailsMatch = scriptureStatus.find((s) => s.id === id);
    if (scriptureDetailsMatch) {
      setEachScripture(scriptureDetailsMatch);
      setIsScriptureDetails(true);
      console.log(scriptureDetailsMatch);
    } else {
      console.error("Scripture not found");
    }
  };

  return (
    <ScriptureContext.Provider
      value={{
        scriptureUpload,
        setScriptureUpload,
        scriptureUploadedDetails,
        setScriptureUploadedDetails,
        deleteScripture,
        deleteModal,
        setDeleteModal,
        editScripture,
        isScriptureDetails,
        setIsScriptureDetails,
        viewScriptureModal,
        eachScripture,
        setEachScripture,
        uploadScheduledScripture,
      }}
    >
      {children}
    </ScriptureContext.Provider>
  );
};

export default ScriptureContextProvider;
