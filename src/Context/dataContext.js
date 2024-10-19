import { createContext, useContext } from "react";
import { useLocalStorage } from "../Hooks/useLocalStorage";

export const DataContext = createContext();

export function DataContextProvider(props) {
    const [logged, setLogged] = useLocalStorage('log', false);
    const [infoTkn, setInfoTkn] = useLocalStorage('tkn', '');
    const url = 'https://apimoneymover-pruebas.up.railway.app';
    const value = {
        logged, setLogged,
        infoTkn, setInfoTkn,
        url
    };

    return (
        <DataContext.Provider value={value}>
            {props.children}
        </DataContext.Provider>
    );
}

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataContextProvider');
    }
    return context;
}