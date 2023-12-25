// Internal & 3rd party functional libraries
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// Custom functional libraries
import { StateManager } from "mobx-render-engine/state-manager";
// Internal & 3rd party component libraries
import { ThemeProvider } from "@mui/material";
import { useRef } from "react";
import { Route, Router, useLocation, useRouter } from "wouter";
import { useLocationProperty, navigate } from "wouter/use-location";
import isElectron from "is-electron";
// Custom component libraries
import { theme } from "./OverallTheme";
import { SignIn } from "./builtins/sign-in";
import { Home } from "./builtins/home";
import { DashboardView } from "./builtins/dashboard-view";
import { globalAppState } from "./builtins/app-state";
import { UnsafeClient } from "./builtins/remote-object-client/view";


// returns the current hash location in a normalized form - (excluding the leading '#' symbol)
// from wouter docs
const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to : string) => navigate("#" + to);

const useHashLocation = () => {
    const location = useLocationProperty(hashLocation);
    return [location, hashNavigate];
};


const App = () => {
    
    const packagedApp = useRef<boolean>(isElectron()) 
    const [location, setLocation] = useLocation()
    const dashboardStateManager = useRef<StateManager | null>(null)
    const dashboardURL = useRef<string>('')
    const globalRouter = useRouter()

    return (
        <div>
            <ThemeProvider theme = {theme}>      
                <Router 
                    // @ts-ignore
                    hook={packagedApp.current ? useHashLocation : null}
                >
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