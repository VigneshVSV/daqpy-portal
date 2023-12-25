'use client'
// Internal & 3rd party functional libraries
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from 'react'
// Custom functional libraries
// Internal & 3rd party component libraries
import { ThemeProvider } from "@mui/material";
import isElectron from "is-electron";
// Custom component libraries
import { theme } from "./overall-theme";
import { SignIn } from "./builtins/sign-in";
import { DashboardView } from "./builtins/dashboard-view";
import { globalAppState } from "./builtins/app-state";
import { GlobalStateContext } from "./mobx/state-container";



export default function Home() {
    return (
        <ThemeProvider theme={theme}>      
            <GlobalStateContext.Provider value={globalAppState}>
                <SignIn />
            </GlobalStateContext.Provider>
        </ThemeProvider>
    )
}


// Internal & 3rd party functional libraries
// Custom functional libraries
// Internal & 3rd party component libraries
// Custom component libraries 