import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Autocomplete, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, 
        Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, Tooltip,
       } from '@mui/material';
import { useLocation } from 'wouter';
import { observer } from 'mobx-react-lite';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SettingsEthernetTwoToneIcon from '@mui/icons-material/SettingsEthernetTwoTone';
import TimelineTwoToneIcon from '@mui/icons-material/TimelineTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import GitHubIcon from '@mui/icons-material/GitHub';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import OpenInNewTwoToneIcon from '@mui/icons-material/OpenInNewTwoTone';

import { ApplicationState } from '../mobx/state-container';
import { ErrorViewer, useAutoCompleteOptionsFromLocalStorage, useDashboard } from './reuse-components';
import { createStateManager } from './component-registration';
import { StateManager } from '../mobx/state-manager';



function Footer(props: any) {
    const text = props.text
    const link = props.link
    return (
        <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            {...props}
        >
            <Link 
                color="inherit" 
                onClick={()=>window.open(link, '_blank')} 
                underline="hover" 
                sx={{cursor:'pointer'}} 
                rel="noopener noreferrer"
            >
                    {text}
            </Link>
        </Typography>
  );
}



type SignInProps = {
    globalState : ApplicationState
    dashboardURL : React.MutableRefObject<string>
    dashboardStateManager : React.MutableRefObject<StateManager | null>
    setGlobalLocation : any
}

export const SignIn = observer(({ globalState, dashboardURL, dashboardStateManager, setGlobalLocation } : SignInProps) => {

    const [primaryHostServerAlive, setPrimaryHostServerAlive] = useState<boolean>(false)
    const [hostServerMessage, setHostServerMessage] = useState<string>('')
    const [loginDisabled, setLoginDisabled] = useState<boolean>(false)
    const [location, setLocation] = useLocation()
    const [openDashboardDialog, setOpenDashboardDialog] = useState<boolean>(false)

    const handleDashboardMenuOpen = useCallback(() => {
        setOpenDashboardDialog(true)
    }, [])
       
    useEffect(() => {
        const updateGlobalState = async () => {
            let primaryHostAlive = false, loginDisabled = false, errMsg = ''
            if(process.env.REACT_APP_PRIMARY_HOST_SERVER) {
                try {
                    await globalState.setPrimaryHostServer(process.env.REACT_APP_PRIMARY_HOST_SERVER)
                    if(globalState.primaryHostServer) {
                        primaryHostAlive = true
                        await globalState.fetchServerData()
                        if(process.env.REACT_APP_ADDITIONAL_HOST_SERVERS)
                        globalState.additionalHostServers = JSON.parse(process.env.REACT_APP_ADDITIONAL_HOST_SERVERS)
                    }
                } catch(error : any) {
                    loginDisabled = true
                    if(error.response) 
                        errMsg = `host server fetch failed - ${error.message} - response status - ${error.response.status}`
                    else 
                        errMsg = `host server fetch failed - ${error.message}`
                }
            }
            else
                errMsg = 'Please define env variable REACT_APP_PRIMARY_HOST_SERVER in a .env file in the same folder as the app'
            setPrimaryHostServerAlive(primaryHostAlive)
            setLoginDisabled(loginDisabled)
            setHostServerMessage(errMsg)
        }
        updateGlobalState()
    }, [])
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        globalState.login()
    }

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            disabled={loginDisabled}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            disabled={loginDisabled}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" disabled={loginDisabled} />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={()=>setLocation('/home')}
                            disabled={loginDisabled}
                        >
                            {loginDisabled? "Select Primary Host Server To Sign In" : "Sign In"}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    {loginDisabled? "" : "Forgot password?" }
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {loginDisabled? "" : "Don't have an account? Sign Up" }
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            {
                primaryHostServerAlive?  null : 
                <Container 
                    disableGutters
                    maxWidth="sm"
                    sx={{ flexGrow : 1, display : 'flex'}}
                >
                    <Stack sx={{ flexGrow : 1, pt : 5, display : 'flex'}}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={[]}
                        renderInput={(params) => <TextField 
                            {...params} 
                            label="Primary Host Server"
                            variant='standard'
                            />}
                        sx={{ flexGrow : 1, display : 'flex'}}
                    />
                    <Box sx={{flexGrow : 1, display: 'flex'}} >
                        <Typography 
                            variant="caption"
                            fontSize={16} 
                            sx={{flexGrow : 1, display: 'flex', pt : 2, alignContent : "center"}}
                        >
                            {hostServerMessage}
                        </Typography>
                    </Box>
                    </Stack>
                </Container>   
            }
            <Grid container direction ='column' spacing={5} >
                <Grid item>
                    {/* give empty space */}
                </Grid>
                <Grid container item direction='row' spacing={5} justifyContent='center'>
                    <Grid item>
                        <Tooltip title="RemoteObject client">
                            <IconButton
                                size="large"    
                                onClick={()=>setLocation('/client/remote-object/unsafe')}
                                >
                                <SettingsEthernetTwoToneIcon fontSize='large'/>
                            </IconButton>                
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="viewer for visualization parameter">
                            <IconButton
                                size="large"    
                                onClick={()=>setLocation('/client/visualization/unsafe')}
                                >
                                <TimelineTwoToneIcon fontSize='large'/>
                            </IconButton>                
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title='quick dashboard view'>
                            <IconButton
                                size="large"
                                onClick={handleDashboardMenuOpen}
                                >
                                <DashboardTwoToneIcon fontSize='large'/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title='goto daqpy repository at GitHub'>
                            <IconButton
                                size="large"    
                                onClick={()=>window.open('https://github.com/holoviz/param')}
                                >
                                <GitHubIcon fontSize='large'/>
                            </IconButton>                
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid item>
                    {globalState.appsettings.loginDisplayFooter ? 
                        <Footer 
                            sx={{ mt: 4, mb: 4 }} 
                            text={globalState.appsettings.loginFooter} 
                            link={globalState.appsettings.loginFooterLink} 
                        /> : null 
                    }
                </Grid>
            </Grid>
            <DashboardURLDialog
                open={openDashboardDialog}
                dashboardURLRef={dashboardURL}
                dashboardStateManager={dashboardStateManager}
                setGlobalLocation={setGlobalLocation}
                setOpen={setOpenDashboardDialog}
            />
        </>
    );
})



type DashboardURLDialogProps = {
    open : boolean 
    dashboardURLRef : React.MutableRefObject<string>
    dashboardStateManager : React.MutableRefObject<StateManager | null>
    setGlobalLocation : any
    setOpen : any
}

const dashboardAutocompleteFieldInLocalStorage = 'DashboardURLDialogOptions'
const DashboardURLDialog = (props : DashboardURLDialogProps) => {

    const [autocompleteShowDeleteIcon, setAutocompleteShowDeleteIcon] = useState<string>('')
    const [fetchSuccessful, setFetchSuccessful] = useState<boolean>(true)
    const [autocompleteOptions, modifyOptions] = useAutoCompleteOptionsFromLocalStorage(dashboardAutocompleteFieldInLocalStorage)
    const [dashboardURL, setDashboardURL] = useState<string>(autocompleteOptions[0]? autocompleteOptions[0] : '')
    const [loading, errorMessage, errorTraceback, fetchData] = useDashboard(dashboardURL, props.dashboardStateManager)

    const updateDashboardURL = (value : string) => {
        setDashboardURL(value)
        props.dashboardURLRef.current = value
    }
    const handleDashboardMenuClose = useCallback(() => {
        props.setOpen(false)
    }, [])

    const openDashboard = useCallback(async () => {
        if(props.dashboardStateManager.current)
            props.dashboardStateManager.current.reset()
        props.dashboardStateManager.current = createStateManager('quick-dashboard-view', 'INFO', {
            setGlobalLocation : props.setGlobalLocation,
            setLocation : props.setGlobalLocation
        })
        let path 
        let fetchSuccess = await fetchData()
        if(fetchSuccess)
            path='/view'
        else 
            path='/'
        setFetchSuccessful(fetchSuccess)
        props.setGlobalLocation(path)
    }, [fetchData])


    return (
        <Dialog open={props.open} onClose={handleDashboardMenuClose} fullWidth maxWidth={errorMessage? 'lg' : 'md'}>
            <DialogTitle>Quick Open Dashboard</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    URL of the GUI server
                </DialogContentText>
                <Stack direction="row">
                    <Autocomplete
                        id="dashboard-server-autocomplete"
                        freeSolo
                        disablePortal
                        autoComplete    
                        size="small"
                        onChange={(event, name) => {updateDashboardURL(name as string)}}
                        value={dashboardURL}
                        options={autocompleteOptions}
                        sx={{ flexGrow : 1, display: 'flex' }}
                        renderInput={(params) => 
                            <TextField
                                variant="standard"
                                margin="dense"
                                error={!fetchSuccessful}
                                sx={{ flexGrow: 0.99, display : 'flex', borderRadius : 0 }}
                                onChange={(event) => updateDashboardURL(event.target.value)}
                                onKeyDown={async (event) => {
                                    if (event.key === 'Enter') {
                                        await openDashboard()
                                    }
                                }}
                                {...params}    
                            />}
                        renderOption={(props, option : any, { selected }) => (
                            <li 
                                {...props}
                                onMouseOver={() => setAutocompleteShowDeleteIcon(option)}
                                onMouseLeave={() => setAutocompleteShowDeleteIcon('')}
                            >
                                <Typography 
                                    sx={{ 
                                        display : 'flex', flexGrow : 1, 
                                        fontWeight : option === autocompleteShowDeleteIcon? 'bold' : null 
                                    }}
                                >
                                    {option}
                                </Typography>
                                {option === autocompleteShowDeleteIcon? 
                                <IconButton size="small" onClick={() => modifyOptions(dashboardURL, 'DELETE')}>
                                    <DeleteForeverIcon fontSize="small" />
                                </IconButton> : null }
                            </li>
                        )}
                    />
                    <IconButton onClick={() => modifyOptions(dashboardURL, 'ADD')}>
                        <SaveTwoToneIcon />
                    </IconButton>
                    <IconButton 
                        id="remote-object-load-using-locator"
                        onClick={() => window.open(dashboardURL)}
                        sx = {{ borderRadius : 0 }}
                    >
                        <OpenInNewTwoToneIcon /> 
                    </IconButton>
                </Stack>
                <ErrorViewer
                    errorMessage={errorMessage}
                    errorTraceback={errorTraceback}
                    fontSize={14}
                />
            </DialogContent>
            <DialogActions sx={{ pt : 5 }}>
                {loading? 
                    <Box sx={{ pr : 2 }}>
                        <CircularProgress /> 
                    </Box>
                : null}
                <Stack>
                    <Stack direction="row">
                        <Button onClick={() => props.setGlobalLocation('/view')}>Open Saved</Button>
                        <Button onClick={openDashboard}>Fetch and Open</Button>
                    </Stack>
                    <Stack direction="row" alignSelf={"flex-end"}>
                        <Button onClick={() => props.setGlobalLocation('/view')}>Open Last Used</Button>
                    </Stack>
                </Stack>
            </DialogActions>
        </Dialog>
    )

}