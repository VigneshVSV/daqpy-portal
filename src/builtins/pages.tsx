// Internal & 3rd party functional libraries
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
// Custom functional libraries
// Internal & 3rd party component libraries
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, 
    CircularProgress, Container, Dialog, FormControl, FormControlLabel, Grid, 
    IconButton, Link, Stack, TextField, Tooltip, Typography } from "@mui/material"
import * as IconsMaterial from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import OpenInNewOffTwoToneIcon from '@mui/icons-material/OpenInNewOffTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
// Custom component libraries 
import { RootLogger } from "./app-state"
import { AppContext, AppProps } from "../App";



export const AddPage = () => {

    const { globalState } = useContext(AppContext) as AppProps 
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [URL, setURL] = useState('')

    const onSaveAndOpen = (event : any) => {
        RootLogger.logTraceMessage("AddPage", "unknown", "Save and Open not implemented yet")
    }

    const savePage = useCallback((event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let errMsg = ''
        const sendPageToServer = async() => {
            try {
                const data = new FormData(event.currentTarget);
                const response = await axios.post(`${globalState.primaryHostServer}/dashboards`, {
                        name : data.get('name'),
                        URL : data.get('URL'),
                        description : data.get('description'),
                        json : ''

                    })
                if(response.status !== 200)
                    errMsg = `could not save dashboard to database - ${response.status}`
                
            } catch (error : any) {
                errMsg = `could not save dashboard to database - ${error.message}` 
            }
            setErrorMessage(errMsg)
        }
        sendPageToServer()
    }, [globalState])

    return (
        <Container component="main" maxWidth="sm">  
            <FormControl>
                <Typography 
                    align="center" 
                    variant="button"
                    fontSize={14}
                    sx={{ pt : 2 }}
                >
                    New Page
                </Typography>
                <Box component="form" onSubmit={savePage} noValidate>
                    <Grid container spacing={3} columns={12}>
                        <Grid item xs={12} md={12} lg={12} sm={12} xl={12}>
                            <TextField 
                                id="add-page-name-textfield" 
                                label="Name" 
                                variant="standard" 
                                name="name"
                                type="text"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                id="add-page-description-texfield" 
                                multiline 
                                minRows={2}
                                label="Description" 
                                variant="outlined"
                                fullWidth
                                name="description"
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                id="add-page-url-textfield" 
                                multiline 
                                minRows={2}
                                label="URL" 
                                variant="outlined" 
                                fullWidth    
                                placeholder="Enter URL of UI components server"
                                defaultValue=""
                                onChange={(event) => setURL(event.target.value)}
                                name="URL"
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox defaultChecked/>}
                                label="fetch now"  
                            />
                        </Grid>
                        {/* <Grid container direction='row' spacing={3}> */}
                        <Grid item xs={4} rowSpacing={0}>
                            <Button onClick={onSaveAndOpen} disabled >
                                Save and Open
                            </Button>
                        </Grid>
                        <Grid item xs={5} rowSpacing={0}>
                            <Button disabled>
                                Quick View in New Tab
                            </Button>
                        </Grid>
                        <Grid item xs={3} rowSpacing={0}>
                            <Button type="submit">
                                Just Save
                            </Button>
                        </Grid>
                        { 
                            loading || errorMessage.length > 0 ? 
                                <Grid item xs={12} rowSpacing={0}>
                                    <Box sx={{pl : 0.5}}> 
                                        {loading ? <CircularProgress size={25} /> : null}
                                        {errorMessage.length > 0 ? 
                                            <Typography fontSize={12} fontWeight={700} sx={{ color : 'red' }}>
                                                {errorMessage}
                                            </Typography> 
                                            : null}
                                    </Box>
                                </Grid> : null
                        }
                    </Grid>
                </Box>
            </FormControl>
        </Container>
    )
}



type Dashboard = {
    name : string 
    description : string 
    URL : string 
    JSON? : object
}

export const Pages = () => {

    const [pages, setPages] = useState<Dashboard[]>([])
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [errMsg, setErrorMessage] = useState<string>('')
    const { globalState } = useContext(AppContext) as AppProps
   
    const fetchPages = useCallback(async() => {
        let _pages = [], response = null, errMsg = ''
        try {
            if(globalState.primaryHostServer){
                response = await axios.get(`${globalState.primaryHostServer}/dashboards`) as AxiosResponse
                if(response.status === 200)
                    _pages = response.data
            }
        } catch(error : any ) {
            errMsg = response? response.statusText : error.message
        }
        // pages = response.data
        setPages(_pages)
        setErrorMessage(errMsg)
    }, [globalState])

    useEffect(() => {
        fetchPages() 
    }, [])
   
    return (
        <>
            <Grid container direction = 'row' columns={3}>
                {/* {['Recent', 'Pages', 'Groups'].map((group : string, index : any) => {
                    <div key={'Pages'+index.toString()}> */}
                <Grid item lg={3} xs={3} xl ={3} sm={3} md={3} >
                    <IconButton size="large" onClick={() => setOpenDialog(true)}>
                        <IconsMaterial.AddTwoTone fontSize="large" />
                    </IconButton>
                    <IconButton size="large" onClick={async() => fetchPages()}>
                        <IconsMaterial.Refresh fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid item xs={1}>
                    <Grid container direction = 'column'>
                        <Grid item sx={{ pt : 5 }}>
                            {pages.length > 0 ? pages.map((page : Dashboard, index) => {
                                return (
                                    <Box sx={{pt : 2}} key={'page' + index.toString()}>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                                <Typography 
                                                    textAlign='center' 
                                                    sx={{ display : 'flex', flexDirection : 'column',
                                                        justifyContent : 'center'}}
                                                >
                                                    {page.name} 
                                                </Typography>
                                                <Box display='flex' justifyContent='flex-end' sx={{ flexGrow : 1 }}>
                                                    <IconButton size="large" onClick={() => {console.log("not implemented yet")}}>
                                                        <OpenInNewOffTwoToneIcon></OpenInNewOffTwoToneIcon>
                                                    </IconButton>
                                                    <IconButton size="large" onClick={() => {console.log("not implemented yet")}}>
                                                        <LaunchTwoToneIcon></LaunchTwoToneIcon>
                                                    </IconButton>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="caption">{page.description}</Typography>
                                                <Typography fontSize={14} variant='overline'>
                                                    <br/ > URL :  
                                                </Typography>
                                                <Link 
                                                    href={page.URL}
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    underline='hover' 
                                                    variant='body2' 
                                                    sx = {{pl : 1}}
                                                >
                                                    {page.URL}
                                                </Link>                                 
                                                <Box display='flex' justifyContent="flex-start" sx={{flexGrow:1, pt:1}}>
                                                    <Button variant='outlined'>Open</Button>
                                                    <Box  display='flex' justifyContent="flex-end" sx={{flexGrow:3}}>
                                                        <Tooltip title='edit'>
                                                            <IconButton >
                                                                <EditTwoToneIcon></EditTwoToneIcon> 
                                                            </IconButton>
                                                        </Tooltip>
                                                        <IconButton>
                                                            <RefreshTwoToneIcon></RefreshTwoToneIcon>
                                                        </IconButton>
                                                        <IconButton>
                                                            <DeleteTwoToneIcon></DeleteTwoToneIcon>
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Box>
                                )
                            })
                            : 
                            <Typography fontSize={16} variant="button">
                                {errMsg? errMsg : 'None to show. Click plus to add.'}
                            </Typography>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid> 
            <Dialog open={openDialog}>
                <AddPage />
                <Stack alignSelf='flex-end' sx={{ pb : 1, pr : 2 }}>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </Stack>
            </Dialog>
        </>
    )

}