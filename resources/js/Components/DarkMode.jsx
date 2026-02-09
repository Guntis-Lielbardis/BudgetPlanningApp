import { createContext, useEffect, useState, useContext } from "react";
import React from 'react';
import axios from 'axios';
import {usePage} from '@inertiajs/react';

export const DarkMode = createContext();

export function DarkModeProvider({ children }) {
    const isBrowser = typeof window !== 'undefined';
    let page = {};
    try {
        page = usePage();
    } catch (e) {
        console.warn("Lapa ielādējas");
    }

    const auth = page?.props?.auth;
    const [darkMode, setDarkMode] = useState(() => {
        if (isBrowser) {
            return localStorage.getItem("darkMode") === "true";
        }
        return false;
    });

    useEffect(() => {
        if (isBrowser && auth?.user) {
            axios.get("/user/theme")
                .then((res) => {
                    setDarkMode(res.data.dark_mode);
                })
                .catch((error) => {
                    if (error.response?.status !== 401) {
                        console.error("Failed to fetch theme:", error);
                    }
                });
        } else if (isBrowser && !auth?.user) {
            setDarkMode(localStorage.getItem("darkMode") === "true");
        }
    }, [auth?.user]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        if (isBrowser) localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    return (
        <DarkMode.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </DarkMode.Provider>
    );
}