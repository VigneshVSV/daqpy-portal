// Internal & 3rd party functional libraries
import { useRef } from 'react';
import { Route, Router, useLocation, useRouter } from "wouter";
// Custom functional libraries
import { useHashLocation } from './utils/routing';
// Internal & 3rd party component libraries
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box, ThemeProvider } from "@mui/material";
import isElectron from "is-electron";
// Custom component libraries
import { theme } from "./overall-theme";
import { SignIn } from "./builtins/sign-in";
import { globalAppState } from "./builtins/app-state";
import { Overview } from './builtins/overview';
import { UnsafeClient } from './builtins/remote-object-client/view';
import { DashboardView } from './builtins/dashboard/view';
import { ErrorBackdrop } from './builtins/reuse-components';



const App = () => {
    
    const packagedApp = useRef<boolean>(isElectron()) 
    const [_, setLocation] = useLocation()
    const globalRouter = useRouter()
    
    globalAppState.setGlobalLocation = setLocation 
    // not an observable, never make it observable otherwise this has to move to useEffect probably
   
    return (
        <Box id='main-layout' sx={{ display : 'flex', flexGrow : 1, alignItems : 'center'}}>
            <ThemeProvider theme={theme}>      
                <Router 
                    // @ts-ignore
                    hook={packagedApp.current ? useHashLocation : null}
                >
                    <Route path='/'>
                        <SignIn globalState={globalAppState} />
                    </Route>
                    <Overview
                        baseRoute='/home' 
                        globalState={globalAppState} 
                        setGlobalLocation={setLocation} 
                        globalRouter={globalRouter} 
                    />
                    <Route path='/dashboard-view'>
                        <DashboardView globalState={globalAppState} />   
                    </Route> 
                    <Route path='/dashboard/:name'>
                        <ErrorBackdrop 
                            message="404 - dashboard routing based on name not implemented yet" 
                            goBack={() => setLocation('/')}
                        />
                    </Route> 
                    <Route path='/clients/remote-object/unsafe'>
                        <UnsafeClient setGlobalLocation={setLocation} />
                    </Route>
                    <Route path='/clients/visualization/unsafe'>
                        <ErrorBackdrop 
                            message="404 - visualization client not implemented yet" 
                            goBack={() => setLocation('/')}    
                        />
                    </Route>
                </Router>
            </ThemeProvider>
        </Box>
    )
}


export default App
