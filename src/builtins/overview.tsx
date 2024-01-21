// Internal & 3rd party functional libraries
import { Route, Router, useLocation, useRouter } from "wouter";
// Custom functional libraries
// Internal & 3rd party component libraries
import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, useTheme } from "@mui/material";
import * as IconsMaterial from '@mui/icons-material/';
// Custom component libraries
import { ApplicationState } from "../mobx/state-container";
import { Pages} from './pages';
import { AppSettings } from "./app-settings";
import { ServerWizard } from "./http-server-wizard/view";
import { RemoteObjectViewer } from "./remote-object-client/view";
import { RemoteObjectClientState } from "./remote-object-client/remote-object-client-state";
import { useContext } from "react";
import { AppContext, AppProps } from "../App";



// const DrawerHeader = styled('div')(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     padding: theme.spacing(0, 1),
//     ...theme.mixins.toolbar, // necessary for content to be below app bar
//     justifyContent: 'flex-end',
// }));


type DrawerOptionProps = {
    text : string 
    icon : JSX.Element 
    path : string
    globalPath? : boolean
    onClick? : (globalState : ApplicationState) => void | null
}

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

const DrawerGroup = ({ content } : { content : DrawerOptionProps[] }) => {

    const { setGlobalLocation, globalState } = useContext(AppContext) as AppProps 

    return (
        <List>
            {content.map((contentInfo : DrawerOptionProps) => (
                <ListItem key={contentInfo.text} disablePadding>
                    <ListItemButton
                        sx = {{
                            '&:hover': { backgroundColor : '#EAF7FE'}
                        }}
                        onClick={() => {
                            if(contentInfo.onClick)
                                contentInfo.onClick(globalState)
                            let path = contentInfo.globalPath? '/overview' + contentInfo.path : contentInfo.path
                            setGlobalLocation(path)}
                        }
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




const Panels : { [key : string] : DrawerOptionProps[] } = {
    'Dashboard' : [
        {
            text : 'Pages/Dashboards',
            icon : <IconsMaterial.DashboardTwoTone />,
            path : '/overview/pages',
        }
    ],
    'App' : [
        {
            text : 'Settings',
            icon : <IconsMaterial.SettingsTwoTone />,
            path : '/overview/settings',
        },
    ],
    'Python Servers' : [
        {
            text: 'Remote Object Wizard',
            icon: <IconsMaterial.TerminalTwoTone />,
            path: '/objects'
        },
        {
            text: 'HTTP Server Wizard',
            icon: <IconsMaterial.AccountTreeTwoTone />,
            path: '/servers'
        },
        {
            text: 'Log Viewer',
            icon: <IconsMaterial.TableChartTwoTone />,
            path: '/log-viewer'
        }
    ],
    'Account' : [
        {
            text: 'Logout',
            icon: <IconsMaterial.LogoutTwoTone />,
            path: '/',
            onClick : (globalState : ApplicationState) => { globalState.loggedIn = false }
        },
    //     {
    //         text : 'Account Information',
    //         icon : <IconsMaterial.AccountCircleTwoTone />,
    //         path : '/login-info'
    //     },
    ]
}



type OverviewProps = {
    baseRoute : string   
}

const drawerWidth = 300

export const Overview = ( { baseRoute } : OverviewProps ) => {

    const router = useRouter();
    const nestedBaseRoute = `${router.base}${baseRoute}`;
    const [ parentLocation ] = useLocation()
    const { globalState, setGlobalLocation } = useContext(AppContext) as AppProps 
   
    if (!parentLocation.startsWith(nestedBaseRoute)) return null;
    
    return (
        <Router base={nestedBaseRoute} key={nestedBaseRoute}>
            <Box sx={{ display : 'flex', flexGrow : 1 }}>
                <CssBaseline />
                <Drawer
                    variant="permanent"
                    anchor="left"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {Object.keys(Panels).map((group, index)=> {
                        let info : DrawerOptionProps[] = Panels[group]
                        return (
                            <div key={index}>
                                <DrawerTitle text={group} />
                                <DrawerGroup content={info} />
                            </div>
                        )
                    }
                    )}
                </Drawer>
                <Box
                    id='overview-components-area'
                    component="main"
                    sx={{ display : 'flex', flexGrow : 1, p : 3 }}
                >
                    <Route path='/pages'>
                        <Pages />
                    </Route>
                    <Route path='/settings'>
                        <AppSettings globalState={globalState}></AppSettings>
                    </Route>
                    <Route path='/servers'>
                        <ServerWizard globalState={globalState}></ServerWizard>
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
        </Router>
    )
}


