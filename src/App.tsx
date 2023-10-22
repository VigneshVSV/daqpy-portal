// Internal & 3rd party functional libraries
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'
// Custom functional libraries

// Internal & 3rd party component libraries
import { ThemeProvider } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
// Custom component libraries
import { Route, Router, useLocation, useRouter } from "wouter";
import { theme } from './OverallTheme';
import { SignIn } from './builtins/sign-in';
import { Home } from './builtins/home';
import { DashboardView } from './builtins/dashboard-view';
import { globalAppState } from './builtins/app-state';
import { UnsafeClient } from './builtins/remote-object-client/view';
import { StateManager } from './mobx/state-manager';



const App = () => {
    
    const [location, setLocation] = useLocation()
    const dashboardStateManager = useRef<StateManager | null>(null)
    const dashboardURL = useRef<string>('')
    const globalRouter = useRouter()

    return (
        <div>
            <ThemeProvider theme = {theme}>      
                <Router>
                    <Route path='/'>
                        <SignIn 
                            globalState={globalAppState} 
                            setGlobalLocation={setLocation} 
                            dashboardStateManager={dashboardStateManager}
                            dashboardURL={dashboardURL}
                        />
                    </Route>
                    <Home 
                        base='/home' 
                        globalState={globalAppState} 
                        setGlobalLocation={setLocation} 
                        globalRouter={globalRouter} 
                    />
                    <Route path='/view'>
                        <DashboardView 
                            givenStateManager={dashboardStateManager.current}
                            setGlobalLocation={setLocation} 
                            dashboardURL={dashboardURL.current}
                        />   
                    </Route> 
                    <Route path='/dashboard/:name'>
                        <div>Not Implemented Yet</div>  
                    </Route> 
                    <Route path='/client/remote-object/unsafe'>
                        <UnsafeClient setGlobalLocation={setLocation} />
                    </Route>
                </Router>
            </ThemeProvider>
        </div>
    )
}


export default App;

// Internal & 3rd party functional libraries
// Custom functional libraries
// Internal & 3rd party component libraries
// Custom component libraries