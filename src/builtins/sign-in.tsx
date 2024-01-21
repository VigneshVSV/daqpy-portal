// Internal & 3rd party functional libraries
import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
// Custom functional libraries
import { createHololinkedPortalStateManager } from "./app-state";
import { useAutoCompleteOptionsFromLocalStorage, useDashboard } from './hooks';
// Internal & 3rd party component libraries
import { Autocomplete, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
    IconButton, Stack, Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, 
    Tooltip, LinearProgress } from '@mui/material';
import * as IconsMaterial from '@mui/icons-material';
// Custom component libraries 
import { ErrorBackdrop, ErrorViewer } from './reuse-components';
import { AppContext, AppProps } from '../App';





function Footer(props: any) {

    return (
        <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            {...props}
        >
            <Link 
                color="inherit" 
                onClick={() => window.open(props.link, '_blank')} 
                underline="hover" 
                sx={{ cursor : 'pointer' }} 
                rel="noopener noreferrer"
            >
                {props.text}
            </Link>
        </Typography>
    )
}




export const SignIn = observer(() => {

    const { globalState, setGlobalLocation } = useContext(AppContext) as AppProps
    const [primaryHost, setPrimaryHost] = useState<string>('')    
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loginDisabled, setLoginDisabled] = useState<boolean>(false)
    const [loginLoading, setLoginLoading] = useState<boolean>(false)
    const [loginMessage, setLoginMessage] = useState<string>('')
    const [primaryHostOptions, modifyOptions] = useAutoCompleteOptionsFromLocalStorage('primary-host-options')

    const updateGlobalState = useCallback(async (primaryHost : string | undefined) => {
        let loginDisabled = true, errMsg = ''
        if(primaryHost) {
            try {
                await globalState.setPrimaryHostServer(primaryHost)
                if(globalState.primaryHostServer) {
                    await globalState.fetchServerData()
                }
                loginDisabled = false
            } catch(error : any) {
                if(error.response) 
                    errMsg = `host server fetch failed - ${error.message} - response status - ${error.response.status}`
                else 
                    errMsg = `host server fetch failed - ${error.message}`
            }
        }
        setLoginDisabled(loginDisabled)
        setErrorMessage(errMsg)
    }, [globalState])
  
    const pingPrimaryHost = useCallback(async(host : string = '') => {
        host = host ? host : primaryHost
        let errMsg = '', loginDisabled = true, response = null
        setLoginLoading(true)
        setLoginMessage('pinging...')
        if(host) {
            try {
                response = await axios.get(host)
                if(response.status === 200) {
                    loginDisabled = false
                    globalState.setPrimaryHostServer(host)
                    console.log("primary host server set", host)
                } else {
                    errMsg = response.statusText
                }
            } catch(error : any) {
                errMsg = response? response.statusText :  error.message
            }
        }
        else {
            loginDisabled = true
            errMsg = 'set primary host'
        }
        setLoginMessage('')
        setLoginLoading(false)
        setLoginDisabled(loginDisabled)
        setErrorMessage(errMsg)
    }, [primaryHost, globalState])

    useEffect(() => {
        updateGlobalState(process.env.REACT_APP_PRIMARY_HOST_SERVER)
        // modifyOptions(process.env.REACT_APP_PRIMARY_HOST_SERVER, 'ADD')
    }, [])
  
    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginLoading(true)
        setLoginMessage('logging in...')
        const data = new FormData(event.currentTarget);
        let path = '/'
        try {
            const response = await axios.post(`${globalState.primaryHostServer}/login`, {
                    email: data.get('email'),
                    password: data.get('password'),
                });
            if(response.status === 200) {
                path = '/overview'
                globalState.loggedIn = true
            }
            console.log(response.headers)
        } catch(error) {
            console.log(error)
        }
        setLoginLoading(false)
        setLoginMessage('')
        setGlobalLocation(path)
    }, [globalState])


    return (
        <Stack sx={{ display : 'flex', flexGrow : 1, alignItems : 'center'}}>
            {/* ----- sign in component ----- */}
            <Container id='sign-in-container' component='main' maxWidth='xs'>
                <CssBaseline />
                <Box

                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar id='lock-icon' sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <IconsMaterial.LockOutlined />
                    </Avatar>
                    <Typography id='sign-in-text' component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box id='sign-in-form-box' component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            id="email-input"
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            disabled={loginDisabled}
                        />
                        <TextField
                            id="password-input"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            disabled={loginDisabled}
                        />
                        {/* 
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        value="remember" 
                                        color="primary" 
                                        disabled={loginDisabled} 
                                    />
                                }
                                label="Remember me"
                                id='remember-me-checkbox'
                            /> 
                        */}
                        {loginLoading? 
                            <Box sx={{ pt : 2 , pb : 2 }}>
                                <LinearProgress  />
                            </Box>
                            :
                            <Button
                                id='submit-button'
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loginDisabled}
                            >
                                {loginDisabled? "Select Primary Host Server To Sign In" : "Sign In"}
                            </Button>
                        }
                        <Grid container direction="row">
                            <Grid item>
                                {loginDisabled?
                                    null :        
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>                          
                                }
                            </Grid>
                            <Grid item>
                                {loginMessage? 
                                    <Link 
                                        underline='none' 
                                        href="#" 
                                        variant='body2' 
                                        sx={{ pl : 3, cursor : 'default' }}
                                    >
                                        {loginMessage}
                                    </Link> : null        
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            {/* ----- primary host server selector component ----- */ }
            <Container 
                id='primary-host-server-selector'
                disableGutters
                maxWidth="sm"
                sx={{ flexGrow : 1, display : 'flex'}}
            >
                <Stack sx={{ flexGrow : 1, pt : 5, display : 'flex'}}>
                    <Stack direction="row">
                        <Autocomplete
                            disablePortal
                            freeSolo
                            id="combo-box-demo"
                            options={primaryHostOptions}
                            onChange={(event, host) => { 
                                setPrimaryHost(host as string)
                                pingPrimaryHost(host as string)
                            }}
                            renderInput={(params) => 
                                <TextField 
                                    {...params} 
                                    onChange={(event) => {setPrimaryHost(event.target.value)}}
                                    label="Primary Host Server"
                                    variant='standard'
                                    value={primaryHost}
                                />}
                                sx={{ flexGrow : 1, display : 'flex'}}
                        />
                        <IconButton size="large" onClick={async() => {await pingPrimaryHost()}}>
                            <Tooltip title="ping to activate sign in box">
                                <IconsMaterial.SyncAltSharp />
                            </Tooltip>
                        </IconButton>
                        <IconButton size="large" onClick={() => {modifyOptions(primaryHost, 'ADD')}}>
                            <Tooltip title="save primary host locally in browser">
                                <IconsMaterial.SaveTwoTone />
                            </Tooltip>
                        </IconButton>
                    </Stack>
                    <Stack sx={{flexGrow : 1, display: 'flex'}} >
                        <Typography 
                            variant="caption"
                            fontSize={16} 
                            sx={{flexGrow : 1, display: 'flex', pt : 2, alignContent : "center"}}
                            
                        >
                            {errorMessage}
                        </Typography>
                        <Typography fontSize={12}>
                            {errorMessage? "Look at console tab inside inspect window for more information if given information is not sufficient" : ""}
                        </Typography >
                    </Stack>
                </Stack>
            </Container>   
            {/* ----- Icons for few widgets at the bottom ----- */}
            <Grid container direction ='column' spacing={5} >
                <Grid item>
                    {/* give empty space */}
                </Grid>
                <Grid container item direction='row' spacing={5} justifyContent='center'>
                    <Grid item>
                        <Tooltip title="RemoteObject client">
                            <IconButton
                                size="large"    
                                onClick={() => setGlobalLocation('/clients/remote-object/unsafe')}
                            >
                                <IconsMaterial.SettingsEthernetTwoTone fontSize='large'/>
                            </IconButton>                
                        </Tooltip>
                    </Grid>
                    {/* <Grid item>
                        <Tooltip title="viewer for visualization parameter">
                            <IconButton
                                size="large"    
                                onClick={() => setGlobalLocation('/clients/visualization/unsafe')}
                            >
                                <IconsMaterial.TimelineTwoTone fontSize='large'/>
                            </IconButton>                
                        </Tooltip>
                    </Grid> */}
                    <Grid item>
                        <DashboardURLDialog /> 
                    </Grid>
                    <Grid item>
                        <Tooltip title='goto hololinked repository at GitHub'>
                            <IconButton
                                size="large"    
                                onClick={() => window.open('https://github.com/VigneshVSV/hololinked')}
                            >
                                <IconsMaterial.GitHub fontSize='large'/>
                            </IconButton>                
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid item>
                    {globalState.appsettings.login.displayFooter ? 
                        <Footer 
                            sx={{ mt: 4, mb: 4 }} 
                            text={globalState.appsettings.login.footer} 
                            link={globalState.appsettings.login.footerLink} 
                        /> : null 
                    }
                </Grid>
            </Grid>
        </Stack>
    );
})



const DashboardURLDialog = observer(() => {

    const { globalState, setGlobalLocation } = useContext(AppContext) as AppProps
    const [autocompleteShowDeleteIcon, setAutocompleteShowDeleteIcon] = useState<string>('')
    const [autocompleteOptions, modifyOptions] = useAutoCompleteOptionsFromLocalStorage('DashboardURLDialogOptions')
    const [open, setOpen] = useState<boolean>(false)

    const [dashboardURL, setDashboardURL] = useState<string>(autocompleteOptions[0]? autocompleteOptions[0] : '')
    const dashboardStateManager = useRef<any>(null)
    
    const [fetchSuccessful, setFetchSuccessful] = useState<boolean>(true)    
    const [loading, fetchData, errorMessage, errorTraceback] = useDashboard(dashboardURL, dashboardStateManager)

    const updateDashboardURL = (value : string) => {
        setDashboardURL(value)
    }
    const handleDashboardMenuClose = useCallback(() => {
        setOpen(false)
    }, [])

    const handleDashboardMenuOpen = useCallback(() => {
        setOpen(true)
    }, [])
       
    const openDashboard = useCallback(async () => {
        if(dashboardStateManager.current)
            dashboardStateManager.current.reset()
        dashboardStateManager.current = createHololinkedPortalStateManager('quick-dashboard-view', 'DEBUG', ErrorBackdrop as any, {
            setGlobalLocation : setGlobalLocation,
            setLocation : (route : string) => console.error(`local routing function invalid & unchanged after creation of state manager. requested route ${route} not possible.`)
        })
        let path : string
        let fetchSuccess = await fetchData()
        if(fetchSuccess)
            path='/dashboard-view'
        else 
            path='/'
        setFetchSuccessful(fetchSuccess)
        globalState.setDashboard(dashboardStateManager.current, dashboardURL)
        setGlobalLocation(path)
    }, [fetchData, dashboardStateManager])


    return (
        <>
            <Tooltip title='quick dashboard view'>
                <IconButton
                    size="large"
                    onClick={handleDashboardMenuOpen}
                >
                    <IconsMaterial.DashboardTwoTone fontSize='large'/>
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleDashboardMenuClose} fullWidth maxWidth={errorMessage? 'lg' : 'md'}>
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
                                                // await openDashboard()
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
                                            <IconsMaterial.DeleteForever fontSize="small" />
                                        </IconButton> : null }
                                    </li>
                                )}
                            />
                            <IconButton onClick={() => modifyOptions(dashboardURL, 'ADD')}>
                                <IconsMaterial.SaveTwoTone />
                            </IconButton>
                            <IconButton 
                                id="remote-object-load-using-locator"
                                onClick={() => window.open(dashboardURL)}
                                sx = {{ borderRadius : 0 }}
                            >
                                <IconsMaterial.OpenInNewTwoTone /> 
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
                            <Button onClick={() => setGlobalLocation('/view')}>Open Saved</Button>
                            <Button onClick={openDashboard}>Fetch and Open</Button>
                        </Stack>
                        <Stack direction="row" alignSelf={"flex-end"}>
                            <Button onClick={() => setGlobalLocation('/view')}>Open Last Used</Button>
                        </Stack>
                    </Stack> 
                </DialogActions>
            </Dialog>
        </>
    )
})