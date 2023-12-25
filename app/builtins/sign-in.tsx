'use client'
// Internal & 3rd party functional libraries
import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation'
// Custom functional libraries
import { ApplicationState, GlobalStateContext } from '../mobx/state-container';
import { createStateManager } from "mui-mobx-render-engine/component-registration";
import { useAutoCompleteOptionsFromLocalStorage, useDashboard } from './hooks';
// Internal & 3rd party component libraries
import { Autocomplete, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, 
        Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, Tooltip,
       } from '@mui/material';
import * as IconsMaterial from '@mui/icons-material';
// Custom component libraries 
import { ErrorViewer } from './reuse-components';



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
                onClick={() => window.open(link, '_blank')} 
                underline="hover" 
                sx={{ cursor:'pointer' }} 
                rel="noopener noreferrer"
            >
                    {text}
            </Link>
        </Typography>
  );
}




export const SignIn = observer(() => {

    const globalState = useContext(GlobalStateContext) as ApplicationState
    const router = useRouter()

    const [primaryHostServerAlive, setPrimaryHostServerAlive] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [loginDisabled, setLoginDisabled] = useState<boolean>(false)
    
  
    useEffect(() => {
        const updateGlobalState = async () => {
            let primaryHostAlive = false, loginDisabled = true, errMsg = ''
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
            setPrimaryHostServerAlive(primaryHostAlive)
            setLoginDisabled(loginDisabled)
            setErrorMessage(errMsg)
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
            {/* ----- sign in component ----- */}
            <Container  id='sign-in' component='main' maxWidth='xs'>
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
                        <IconsMaterial.LockOutlined />
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
                            // onClick={()=>setLocation('/home')}
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
            {/* ----- primary host server selector component ----- */ }
            <Container 
                id='primary-host-server-selector'
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
                        {errorMessage}
                    </Typography>
                </Box>
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
                                onClick={() => router.push('/client/remote-object/unsafe')}
                            >
                                <IconsMaterial.SettingsEthernetTwoTone fontSize='large'/>
                            </IconButton>                
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="viewer for visualization parameter">
                            <IconButton
                                size="large"    
                                onClick={() => router.push('/client/visualization/unsafe')}
                            >
                                <IconsMaterial.TimelineTwoTone fontSize='large'/>
                            </IconButton>                
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title='quick dashboard view'>
                            <DashboardURLDialog /> 
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title='goto daqpy repository at GitHub'>
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
                    {globalState.appsettings.loginDisplayFooter ? 
                        <Footer 
                            sx={{ mt: 4, mb: 4 }} 
                            text={globalState.appsettings.login.footer} 
                            link={globalState.appsettings.login.footerLink} 
                        /> : null 
                    }
                </Grid>
            </Grid>
            
        </>
    );
})



type DashboardURLDialogProps = {
    open : boolean 
    setOpen : any
}

const dashboardAutocompleteFieldInLocalStorage = 'DashboardURLDialogOptions'
const DashboardURLDialog = () => {

    const [autocompleteShowDeleteIcon, setAutocompleteShowDeleteIcon] = useState<string>('')
    const [autocompleteOptions, modifyOptions] = useAutoCompleteOptionsFromLocalStorage(dashboardAutocompleteFieldInLocalStorage)
    const [open, setOpen] = useState<boolean>(false)

    const [dashboardURLText, setDashboardURLText] = useState<string>(autocompleteOptions[0]? autocompleteOptions[0] : '')
    const dashboardStateManager = useRef<any>(null)
    const dashboardURL = useRef<string>('')
    const router = useRouter()

    const [fetchSuccessful, setFetchSuccessful] = useState<boolean>(true)    
    const [loading, errorMessage, errorTraceback, fetchData] = useDashboard(dashboardURLText, dashboardStateManager)

    const updateDashboardURL = (value : string) => {
        setDashboardURLText(value)
        dashboardURL.current = value
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
        dashboardStateManager.current = createStateManager('quick-dashboard-view', 'INFO', {
            setGlobalLocation : router.push,
            setLocation : router.push
        })
        let path 
        let fetchSuccess = await fetchData()
        if(fetchSuccess)
            path='/view'
        else 
            path='/'
        setFetchSuccessful(fetchSuccess)
        router.push(path)
    }, [fetchData, dashboardStateManager])


    return (
        <>
            <IconButton
                size="large"
                onClick={handleDashboardMenuOpen}
            >
                <IconsMaterial.DashboardTwoTone fontSize='large'/>
            </IconButton>
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
                                value={dashboardURLText}
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
                            <IconButton onClick={() => modifyOptions(dashboardURL.current, 'ADD')}>
                                <IconsMaterial.SaveTwoTone />
                            </IconButton>
                            <IconButton 
                                id="remote-object-load-using-locator"
                                onClick={() => window.open(dashboardURL.current)}
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
                            <Button onClick={() => router.push('/view')}>Open Saved</Button>
                            <Button onClick={openDashboard}>Fetch and Open</Button>
                        </Stack>
                        <Stack direction="row" alignSelf={"flex-end"}>
                            <Button onClick={() => router.push('/view')}>Open Last Used</Button>
                        </Stack>
                    </Stack> 
                </DialogActions>
        </Dialog>
        </>
    )
}