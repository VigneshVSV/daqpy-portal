'use client'
// Internal & 3rd party functional libraries
import { useState } from "react";
import { observer } from "mobx-react-lite";
// Custom functional libraries
import { AppState } from "./app-state";
// Internal & 3rd party component libraries
import { Grid, Typography, Toolbar, FormControlLabel, Switch, Divider, TextField, Box, 
    OutlinedInput, InputAdornment, IconButton, Button, FormGroup, Stack, withStyles } from "@mui/material"
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneOutlineTwoToneIcon from '@mui/icons-material/DoneOutlineTwoTone';
// Custom component libraries 

// @ts-ignore
export const OutlinedInputIconButton = withStyles({
    root: {
        borderRadius : 4,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    }
})(IconButton);
  

export const SettingsTitle = (props : any) => {
    return (
        <Grid item xs={2}>
            <Typography >{props.title}</Typography>
            <Typography >{props.description}</Typography>
        </Grid>
    )
            
}


export const SettingsRow = (props : any) => {

    return (
        <Box
            sx={{ pl: 3, pb : 0, pt :0 }}
        >
            <Grid container direction='row' columns = {12}>
                <Grid item xs={0.5} >
                    <div></div>
                </Grid>
                <Grid item xs={2.5}>
                    <Box sx={{ pl: 3, pr :3, pt: 0, pb : 0 }} >
                        <Stack>
                            <Typography fontSize={24} variant='overline'>{props.title}</Typography>
                            <Typography fontSize={16} variant='caption'>{props.description}</Typography>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={1} >
                    <div></div>
                </Grid>
                <Grid item xs={5} >
                    {props.children}
                </Grid>
                <Grid item xs={10} sx={{ pt : 3, pb : 3  }} >
                    <Divider></Divider>
                </Grid>
            </Grid>
        </Box>
    )
}


export const AppSettings = observer(({ globalState } : AppState) => {

    const [editLoginFooter, setEditLoginFooter] = useState<boolean>(false)
    const [editLoginFooterLink, setEditLoginFooterLink] = useState<boolean>(false)
    const [loginFooter, setLoginFooter] = useState<string>(globalState.appsettings.loginFooter)
    const [loginFooterLink, setLoginFooterLink] = useState<string>(globalState.appsettings.loginFooterLink)

    return (
        <>
            <Grid container direction = 'column' sx={{ flexWrap: 'nowrap' }}>
                <SettingsRow
                    title="Dashboards"
                    description="common to all dashboard pages you create"
                >
                    <Grid container direction='column' id="dashboards-settings">
                        <Grid item>
                            <FormControlLabel 
                                id="dashboards-delete-without-asking-switch"
                                control={<Switch 
                                        defaultChecked={globalState.appsettings.dashboardsDeleteWithoutAsking} 
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => 
                                            await globalState.updateSettings("dashboardsDeleteWithoutAsking", event.target.checked)}
                                        />} 
                                label="delete without asking" 
                                
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel 
                                id="dashboards-show-recently-used-switch"
                                control={<Switch 
                                        defaultChecked={globalState.appsettings.dashboardsShowRecentlyUsed} 
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => 
                                            await globalState.updateSettings("dashboardsShowRecentlyUsed", event.target.checked)}
                                        />} 
                                label="show recently used" 
                            />
                        </Grid>
                    </Grid>
                </SettingsRow>
        
                <SettingsRow
                    title = 'Login Page'
                    description = ''
                >
                    <Grid container direction='column' spacing={3}>
                        <Grid item>
                            <FormControlLabel 
                                id="loginpage-show-footer-label"
                                control={<Switch 
                                        defaultChecked={globalState.appsettings.loginDisplayFooter} 
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => 
                                            await globalState.updateSettings("loginDisplayFooter", event.target.checked)}
                                        />} 
                                label="show footer label at login" 
                            />
                        </Grid>
                        <Grid item>
                            <OutlinedInput
                                size='small' 
                                fullWidth placeholder='login footer display name'
                                sx={{ paddingLeft:0 }}
                                disabled={!editLoginFooter}
                                value={loginFooter}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    setLoginFooter(event.target.value)
                                }
                                startAdornment = {
                                    <InputAdornment position='start'>
                                    {editLoginFooter? 
                                        <OutlinedInputIconButton 
                                            sx = {{bgcolor : '#808080'}}
                                            onClick={async () =>  {
                                                setEditLoginFooter(!editLoginFooter)
                                                await globalState.updateSettings("loginFooter" , loginFooter)
                                            }}
                                        >
                                            <DoneOutlineTwoToneIcon></DoneOutlineTwoToneIcon>
                                        </OutlinedInputIconButton> :
                                        <OutlinedInputIconButton 
                                                sx = {{bgcolor : '#808080'}}
                                                onClick={() => setEditLoginFooter(true)}
                                        >
                                            <EditTwoToneIcon></EditTwoToneIcon>
                                        </OutlinedInputIconButton>
                                    }
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                        <Grid item>
                            <OutlinedInput
                                size='small' 
                                fullWidth placeholder='footer link'
                                disabled={!editLoginFooterLink}
                                value={loginFooterLink}
                                sx={{ paddingLeft:0 }}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    setLoginFooterLink(event.target.value)
                                }
                                startAdornment = {
                                    <InputAdornment position='start'>
                                        {editLoginFooterLink? 
                                            <OutlinedInputIconButton 
                                                sx = {{bgcolor : '#808080'}}
                                                onClick={async () => {
                                                    setEditLoginFooterLink(false)
                                                    await globalState.updateSettings("loginFooterLink" , loginFooterLink)
                                                    }
                                                }
                                            >
                                                <DoneOutlineTwoToneIcon></DoneOutlineTwoToneIcon>
                                            </OutlinedInputIconButton> :
                                            <OutlinedInputIconButton 
                                                sx = {{bgcolor : '#808080'}}
                                                onClick={() => setEditLoginFooterLink(true)}
                                            >
                                                <EditTwoToneIcon></EditTwoToneIcon>
                                            </OutlinedInputIconButton>
                                            
                                        }
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                    </Grid>
                </SettingsRow>            
                <SettingsRow
                    title = 'Python Servers'
                >
                    <Grid container direction='column' spacing={3} columns={6}  sx={{ flexWrap: 'nowrap' }}>
                        <Grid item>
                            <FormControlLabel 
                                id="servers-allow-http"
                                control={<Switch 
                                        defaultChecked={globalState.appsettings.serversAllowHTTP} 
                                        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => 
                                            await globalState.updateSettings("serversAllowHTTP", event.target.checked)}
                                        />} 
                                label="Allow HTTP (no encryption of messages)" 
                            />
                        </Grid>
                    </Grid>
                </SettingsRow>            
            </Grid>
        </>
    )
})


/*
<SettingsRow
title = 'Main Server'
>
<Grid container direction='column' spacing={3} columns={6}  sx={{ flexWrap: 'nowrap' }}>
    <Grid item>
        <OutlinedInput
            size='small' 
            fullWidth placeholder='Server URL'
            sx={{ paddingLeft:0 }}
            startAdornment = {
                <InputAdornment position='start'>
                    <OutlinedInputIconButton sx = {{bgcolor : '#808080'}}>
                        <EditTwoToneIcon></EditTwoToneIcon>
                    </OutlinedInputIconButton>
                </InputAdornment>
            }
        />
    </Grid>
    <Grid item xs={3} >
        <OutlinedInput
            size='small' 
            placeholder='password'
            sx={{ 
                paddingLeft:0,
                borderTopRightRadius:0,
                borderBottomRightRadius:0,
                minWidth: '50%'
            }}
            startAdornment = {
                <InputAdornment position='start'>
                    <OutlinedInputIconButton sx = {{bgcolor : '#808080'}}>
                        <EditTwoToneIcon></EditTwoToneIcon>
                    </OutlinedInputIconButton>
                </InputAdornment>
            }
        />
        <TextField variant='outlined' size='small' placeholder='repeat password'
            sx ={{
                minWidth: '50%',
                '& fieldset' : {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0        
                }
            }}
        ></TextField>
    </Grid>
    <Grid item>
        <FormControlLabel control={<Switch defaultChecked />} label="delete without asking" />
    </Grid>
</Grid> 
</SettingsRow>
*/