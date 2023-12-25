'use client'
// Internal & 3rd party functional libraries
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import dynamic from 'next/dynamic'
import React, { createContext } from 'react'
// Custom functional libraries
import { StateManager } from "mobx-render-engine/state-manager";

// Internal & 3rd party component libraries
import { ThemeProvider } from "@mui/material";
import { useRef } from "react";
import isElectron from "is-electron";
// Custom component libraries
import { theme } from "./overall-theme";
import { SignIn } from "./builtins/sign-in";
import { DashboardView } from "./builtins/dashboard-view";
import { globalAppState } from "./builtins/app-state";
import { UnsafeClient } from "./builtins/remote-object-client/view";
import { GlobalStateContext } from "./mobx/state-container";



export default function Home() {
    return (
        <GlobalStateContext.Provider value={globalAppState}>
            <SignIn />
        </GlobalStateContext.Provider>
    )
}
