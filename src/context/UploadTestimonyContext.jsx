import { createContext, useState } from "react";


export const uploadTestContext = createContext()

function UploadTestContextProvider({children}) {
    const [uploadTestFn, setUploadTestFn] = useState(null)
    

    return (
        <uploadTestContext.Provider value={{uploadTestFn, setUploadTestFn}}>
            {children}
        </uploadTestContext.Provider>
    )
}

export default UploadTestContextProvider