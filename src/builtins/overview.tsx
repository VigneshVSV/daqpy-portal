// Internal & 3rd party functional libraries
import { Route, useLocation, useRouter } from "wouter";
// Custom functional libraries
// Internal & 3rd party component libraries
import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
    useTheme, AppBar, Toolbar } from "@mui/material";
import * as IconsMaterial from '@mui/icons-material/';
// Custom component libraries 
import { ApplicationState } from "../mobx/state-container";
import { AddPage, ShowPages} from './pages';
import { AppSettings } from "./app-settings";
import { BackendServerWizard } from "./http-server-wizard/view";
import { RemoteObjectViewer } from "./remote-object-client/view";
import { RemoteObjectClientState } from "./remote-object-client/remote-object-client-state";



// const DrawerHeader = styled('div')(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     padding: theme.spacing(0, 1),
//     ...theme.mixins.toolbar, // necessary for content to be below app bar
//     justifyContent: 'flex-end',
// }));


const DrawerTitle = (props : any) => {
    const theme = useTheme()
    return (
        <List>           
            <ListItemText 
                primary={props.text} 
                primaryTypographyProps={{
                    noWrap : true, 
                    variant : 'overline',
                    fontSize : 15,
                    paddingLeft : 2,
                    color : theme.palette.grey[600]
                }}
                />
        </List>
    )
}


const DrawerGroup = (props : any) => {

    return (
        <List>
            {props.content.map((contentInfo : any) => (
                <ListItem key={contentInfo.text} disablePadding>
                    <ListItemButton 
                        sx = {{
                            '&:hover': { backgroundColor : '#EAF7FE'}
                        }} 
                        // onClick={() => {contentInfo.globalPath? props.setGlobalLocation(contentInfo.path) : setLocation(contentInfo.path)}}
                    > 
                        <ListItemIcon sx = {{
                            '&:hover': {
                            backgroundColor : '#EAF7FE'
                            }}}  
                        >
                                {contentInfo.icon}
                        </ListItemIcon>
                        <ListItemText primary={contentInfo.text} />
                    </ListItemButton>
                </ListItem>
                ))}
        </List>
    )
}


const Panels : any = {
    'Dashboard' : [
        {
            text : 'Pages',
            icon : <IconsMaterial.DashboardTwoTone />,
            path : '/pages'
    }],
    'App' : [
        {
            text : 'Settings',
            icon : <IconsMaterial.SettingsTwoTone />,
            path : '/settings'
        },
        {
            text : 'Log Viewer',
            icon : <IconsMaterial.TableChartTwoTone />,
            path : '/log-viewer'
    }], 
    'Python Servers' : [
        {
            text: 'HTTP Server Wizard',
            icon: <IconsMaterial.AccountTreeTwoTone />,
            path: '/servers'
        },
        {
            text: 'Remote Object Wizard',   
            icon: <IconsMaterial.TerminalTwoTone />,
            path: '/objects'
    }],
    'Account' : [
        {
            text: 'Logout',
            icon: <IconsMaterial.LogoutTwoTone />,
            path: '/',
            globalPath : true
        },
        {
            text : 'Account Information',
            icon : <IconsMaterial.AccountCircleTwoTone />,
            path : '/login-info'
    }]
}
  

// const styles = (theme : any) => ({
//     // Load app bar information from the theme
//     toolbar: theme.mixins.toolbar,
// });



type OverviewProps = {
    baseRoute : string
    globalState : ApplicationState
    setGlobalLocation : any
    globalRouter : any
}

const drawerWidth = 300

export const Overview = ( { baseRoute, globalState, setGlobalLocation, globalRouter} : OverviewProps ) => {
    const router = useRouter();
    const nestedBaseRoute = `${router.base}${baseRoute}`;
    const [parentLocation] = useLocation()

    if (!parentLocation.startsWith(nestedBaseRoute)) return null;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar 
                position="fixed"
                color = "inherit"
                elevation = {2}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>                
                </Toolbar>
            </AppBar>
            <Drawer
                variant   = "permanent"
                anchor    = "left"
                sx = {{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                {Object.keys(Panels).map((group, index)=> {
                    let info = Panels[group]
                    return (
                        <div key = {index}>
                            <DrawerTitle text={group}></DrawerTitle>
                            <DrawerGroup content={info} setGlobalLocation={setGlobalLocation}></DrawerGroup>
                        </div>
                    )
                }
                )}
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, alignItems : 'center' }}
            >
                <Toolbar /> 
                <Box
                    component="main"
                    sx={{ flexGrow: 1, alignItems : 'center' }}
                >
                    <Route path='/pages/add'>
                        <AddPage setGlobalLocation={setGlobalLocation}></AddPage>
                    </Route>
                    <Route path='/pages'>
                        <ShowPages globalState={globalState} setGlobalLocation={setGlobalLocation} globalRouter={globalRouter}></ShowPages>
                    </Route>
                    <Route path='/settings'>
                        <AppSettings globalState={globalState}></AppSettings>
                    </Route>
                    <Route path='/servers'>
                        <BackendServerWizard globalState={globalState}></BackendServerWizard>
                    </Route>
                    <Route path='/objects'>
                        <RemoteObjectViewer 
                            globalState={globalState} 
                            unsafeClient={false} 
                            clientState={new RemoteObjectClientState()}
                            // showSettings={false}
                            // setShowSettings={null}
                            setGlobalLocation={setGlobalLocation}
                        />
                    </Route>
                </Box>
            </Box>
        </Box>
    )
}


