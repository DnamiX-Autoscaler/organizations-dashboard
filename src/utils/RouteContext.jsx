import React, { createContext, useContext, useState, useEffect } from 'react';

const RouteContext = createContext();

export const useRoute = () => {
    const context = useContext(RouteContext);
    if (!context) {
        throw new Error('useRoute must be used within a RouteProvider');
    }
    return context;
};

export const RouteProvider = ({ children }) => {
    const [activeMain, setActiveMain] = useState('overview');
    const [activeSub, setActiveSub] = useState('summary');

    // Load route from localStorage on mount
    useEffect(() => {
        const savedMain = localStorage.getItem('activeMain');
        const savedSub = localStorage.getItem('activeSub');

        if (savedMain) setActiveMain(savedMain);
        if (savedSub) setActiveSub(savedSub);
    }, []);

    // Save route to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('activeMain', activeMain);
        localStorage.setItem('activeSub', activeSub);
    }, [activeMain, activeSub]);

    const navigateTo = (main, sub) => {
        setActiveMain(main);
        setActiveSub(sub);
    };

    return (
        <RouteContext.Provider value={{ activeMain, activeSub, setActiveMain, setActiveSub, navigateTo }}>
            {children}
        </RouteContext.Provider>
    );
};
