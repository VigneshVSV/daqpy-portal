// Internal & 3rd party functional libraries
import { createContext, useRef, useState } from 'react';
import { Route, Router, RouterObject, useLocation, useRouter } from "wouter";
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
import { ApplicationState } from './mobx/state-container';



export type AppProps = {
    globalState : ApplicationState
    setGlobalLocation : Function 
    globalRouter : RouterObject
}

export const AppContext = createContext<null | AppProps>(null)


const App = () => {
    
    const packagedApp = useRef<boolean>(isElectron()) 
    const [_, setLocation] = useLocation()
    const globalRouter = useRouter()
    const [globalProps, __] = useState<AppProps>({
                                    globalState : globalAppState,
                                    globalRouter : globalRouter,
                                    setGlobalLocation : setLocation
                                })
    
    globalAppState.setGlobalLocation = setLocation 
    // not an observable, never make it observable otherwise this has to move to useEffect probably
   
    return (
        <Box id='main-layout' sx={{ display : 'flex', flexGrow : 1, alignItems : 'center'}}>
            <AppContext.Provider value={globalProps} >
                <ThemeProvider theme={theme}>      
                    <Router 
                        // @ts-ignore
                        hook={packagedApp.current ? useHashLocation : null}
                    >
                        <Route path='/'>
                            <SignIn />
                        </Route>
                        <Overview
                            baseRoute='/overview' 
                            globalState={globalAppState} 
                            setGlobalLocation={setLocation} 
                            globalRouter={globalRouter} 
                        />
                        <Route path='/dashboards/quick-view'>
                            <DashboardView globalState={globalAppState} />   
                        </Route> 
                        <Route path='/dashboards/:name'>
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
            </AppContext.Provider>
        </Box>
    )
}


export default App
