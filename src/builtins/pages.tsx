// Internal & 3rd party functional libraries
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useLocation } from "wouter";
// Custom functional libraries
// Internal & 3rd party component libraries
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, 
    CircularProgress, ClickAwayListener, Container, Dialog, Divider, FormControl, FormControlLabel, Grid, 
    IconButton, InputLabel, Link, MenuItem, Select, SelectChangeEvent, Stack, TextField, 
    Tooltip, Typography } from "@mui/material"
import * as IconsMaterial from "@mui/icons-material";
// Custom component libraries 
import { AppContext, AppProps } from "../App";
import { groupElementsByN } from "../utils";
import { useDashboard as usePage } from "./hooks";
import { createHololinkedPortalStateManager } from "./app-state";
import { ErrorBackdrop, ErrorViewer } from "./reuse-components";




type Page = {
    name : string 
    description : string 
    URL : string 
    JSON? : object
}

type PagesViewProps = {
    deletePage : Function
    setPageURL : Function
    setOpenPageDialog : Function
    setPageDialogDefaultData : Function
    openPage : Function
}

const PagesContext = createContext<PagesViewProps | null>(null)


export const AddPage = ({ setOpenDialog, defaultData } : { setOpenDialog : Function, defaultData? : undefined | any}) => {

    const { globalState } = useContext(AppContext) as AppProps 
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
   
    const savePage = useCallback((event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const sendPageToServer = async() => {
            let errMsg = '', closeDialog = false
            setLoading(true)
            try {
                const data = new FormData(event.currentTarget);
                let method = defaultData? axios.put : axios.post
                const response = await method(
                    `${globalState.primaryHostServer}/pages/${data.get('name')}`,
                    {
                        URL : data.get('URL'),
                        description : data.get('description'),
                        json : ''
                    },
                    { withCredentials: true })
                if(response.status !== 204 && response.status !== 201)
                    errMsg = `could not save page to database - ${response.status} - use console tab is information is not sufficient`
                else
                    closeDialog = true
            } catch (error : any) {
                errMsg = error.response? error.response.statusText : 
                    `could not save page to database - ${error.message}  - use console tab is information is not sufficient` 
            }
            setErrorMessage(errMsg)
            setOpenDialog(!closeDialog)
            setLoading(false)
        }
        sendPageToServer()
    }, [globalState])

    return (
        <ClickAwayListener onClickAway={() => setOpenDialog(false)}>
            <Container component="main" maxWidth="sm">  
                <FormControl>
                    <Typography 
                        align="center" 
                        variant="button"
                        fontSize={14}
                        sx={{ pt : 2 }}
                    >
                        {defaultData? "Edit Page" : "New Page"}
                    </Typography>
                    <Box component="form" onSubmit={savePage} noValidate>
                        <Grid container spacing={3} columns={12}>
                            <Grid item xs={12} md={12} lg={12} sm={12} xl={12}>
                                <TextField 
                                    id="add-page-name-textfield" 
                                    label="Name" 
                                    name="name"
                                    variant="standard" 
                                    type="text"
                                    fullWidth
                                    defaultValue={defaultData? defaultData.name : ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    id="add-page-description-texfield" 
                                    name="description"
                                    variant="outlined"
                                    multiline 
                                    type="text"
                                    minRows={2}
                                    fullWidth
                                    defaultValue={defaultData? defaultData.description : ""}
                                    label="Description" 
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    id="add-page-url-textfield" 
                                    name="URL"
                                    variant="outlined" 
                                    multiline 
                                    type="text"
                                    minRows={2}
                                    fullWidth    
                                    label="URL" 
                                    defaultValue={defaultData? defaultData.URL : ""}                              
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox />}
                                    label="open now"  
                                />
                            </Grid>
                            <Grid container direction='row' spacing={3} sx={{ pl : 2 }}>
                                <Grid item xs={3} rowSpacing={0}>
                                    <Button type="submit">
                                        Save
                                    </Button>
                                </Grid>
                                {/* <Grid item xs={5} rowSpacing={0}>
                                    <Button disabled>
                                        Quick View in New Tab
                                    </Button>
                                </Grid> */}
                                <Grid item xs={3} rowSpacing={0}>
                                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                                </Grid>
                            </Grid>
                            { 
                                loading || errorMessage.length > 0 ? 
                                    <Grid item xs={12} rowSpacing={0}>
                                        <Box sx={{ pl : 0.5 }}> 
                                            { loading ? <CircularProgress size={25} /> : null }
                                            {
                                                errorMessage.length > 0 ? 
                                                    <Typography fontSize={12} fontWeight={700} sx={{ color : 'red' }}>
                                                        {errorMessage}
                                                    </Typography> 
                                                    : null
                                            }
                                        </Box>
                                    </Grid> : null
                            }
                            <Grid item xs={12} sx={{ pb : 2 }}></Grid>
                        </Grid>
                    </Box>
                </FormControl>
            </Container>
        </ClickAwayListener>
    )
}



export const Pages = () => {

    const { globalState, setGlobalLocation } = useContext(AppContext) as AppProps
    const [location, setLocation] = useLocation()
    
    const [pages, setPages] = useState<Page[]>([])
    const [openPageEditDialog, setOpenPageEditDialog] = useState<boolean>(false)
    const [entriesPerColumn, setEntriesPerColumn] = useState<number>(5)
    const [dialogData, setDialogData] = useState<Page | null>(null)
    const [statusMessage, setStatusMessage] = useState<string>('')
    
    const pageStateManager = useRef<any>(null)
    const [pageURL, setPageURL] = useState<string>('')    
    const [_, fetchData, errorMessage, errorTraceback, clearErrorMessage] = usePage(pageURL, pageStateManager)
   
    const fetchPages = useCallback(async() => {
        let _pages : Array<Page> = [], errMsg = '' // should be old value
        setStatusMessage("loading...")
        try {
            const response = await axios.get(
                    `${globalState.primaryHostServer}/pages`,
                    { withCredentials: true }
                ) as AxiosResponse
            if(response.status === 200) 
                _pages = response.data
        } catch(error : any) {
            if(error.response) 
                errMsg = error.response.status === 403?
                    "could not load - authentication failed, login again." : error.response.statusText
            else 
                errMsg = error.message
        }
        setPages(_pages)
        setStatusMessage(errMsg)
    }, [])

    const deletePage = useCallback(async(name : string) => {
        let errMsg = '', _pages = pages
        try {
            const response = await axios.delete(
                `${globalState.primaryHostServer}/pages/${name}`,
                { withCredentials: true }
            ) as AxiosResponse
            if (response.status === 204)
                _pages = pages.filter(page => page.name !== name) 
        } catch(error : any) {
            errMsg = error.response? error.response.StatusText : error.message 
        }
        setPages(_pages)
        setStatusMessage(errMsg)
    }, [pages])

    const setOpenPageEditDialogWithPagesReload = useCallback(async (open : boolean) => {
        setOpenPageEditDialog(open)
        await fetchPages()
    }, [])

    const handleEntriesPerColumn = useCallback((event : SelectChangeEvent) => {
        setEntriesPerColumn(Number(event.target.value as string))
    }, [])

    useEffect(() => {
        fetchPages() 
    }, [])

    
    const openPage = useCallback(async() => {
        if(pageStateManager.current)
            pageStateManager.current.reset()
        pageStateManager.current = createHololinkedPortalStateManager('page-view', 'DEBUG', 
            ErrorBackdrop as any, 
            {
                setGlobalLocation : setGlobalLocation,
                setLocation : setLocation
            }
        )
        let path : string
        let fetchSuccess = await fetchData()
        if(fetchSuccess)
            path = '/pages/quick-view'
        else 
            path = `/overview${location}`
        globalState.setDashboard(pageStateManager.current, pageURL)
        setGlobalLocation(path)
    }, [fetchData, pageStateManager, location, setLocation, pageURL])
   

    return (
        <Stack sx={{ display : 'flex', flexGrow : 1 }}>
            <Stack direction='row'>
                <IconButton size="large" onClick={() => setOpenPageEditDialog(true)}>
                    <IconsMaterial.AddTwoTone fontSize="large" />
                </IconButton>
                <IconButton size="large" onClick={async() => fetchPages()} >
                    <IconsMaterial.Refresh fontSize="large" />
                </IconButton>
                <Box sx={{ pr : 5 }} />
                <FormControl sx={{ maxWidth : 200, minWidth: 200 }}>
                    <InputLabel id="entries-simple-select-label">Entries Per Column</InputLabel>
                    <Select
                        labelId="entries-simple-select-label"
                        id="handles-per-column-simple-select"
                        value={String(entriesPerColumn)}
                        label="entries per column"
                        onChange={handleEntriesPerColumn}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={15}>20</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <Grid container direction='row' columns={3}>
                <Grid item xs={1}>
                    <Grid container direction='column'>
                        <Grid item sx={{ pt : 5 }}>
                            {pages.length > 0 ? 
                                <Stack direction="row">
                                    {groupElementsByN(pages, entriesPerColumn).map(
                                        (somePages : Page[], index : number) =>
                                            <Stack direction="row" key={`somepages-column-${index}`} >
                                                <PagesContext.Provider 
                                                    value={{
                                                        setPageURL : setPageURL,
                                                        setOpenPageDialog : setOpenPageEditDialog,
                                                        deletePage : deletePage,
                                                        setPageDialogDefaultData : setDialogData,
                                                        openPage : openPage
                                                    }}
                                                >
                                                    <Column pages={somePages} />
                                                </PagesContext.Provider>
                                                <Divider orientation="vertical" />
                                            </Stack> 
                                        )
                                    }
                                </Stack>
                                :
                                <Typography fontSize={16} variant="button">
                                    {statusMessage? statusMessage : "None to show. Click plus to add."}
                                </Typography>
                            }
                        </Grid>
                    </Grid>
                </Grid>
                {
                    errorMessage ? 
                        <Grid item xs={3}>    
                            <Divider>PAGE OPEN ERRORS BELOW</Divider>
                            <ErrorViewer errorMessage={errorMessage} errorTraceback={errorTraceback} />
                            <Box sx={{pt : 2}}>
                                <Button 
                                    onClick={clearErrorMessage} 
                                    variant="outlined"
                                    size="small"
                                >	
                                    clear
                                </Button>
                            </Box>
                        </Grid> : null
                }
            </Grid> 
            <Dialog open={openPageEditDialog}>
                <AddPage setOpenDialog={setOpenPageEditDialogWithPagesReload} defaultData={dialogData}/>
            </Dialog>
        </Stack>
    )
}

  

const Column = ({ pages } : { pages : Page[] }) => {

    return ( 
        <Stack sx={{ p : 2, minWidth : 400 }}>
            {pages.map((page : Page, index) => 
                <Box sx={{pt : 2}} key={'page' + index.toString()}>
                    <Page page={page} />
                </Box>
            )}
        </Stack>         
    )
}


const Page = ({ page } : { page : Page }) => {
    
    const [expanded, setExpanded] = useState<boolean>(false)
    const { deletePage, setPageURL, openPage, setOpenPageDialog, 
        setPageDialogDefaultData } = useContext(PagesContext) as PagesViewProps
    
    
    return (
        <Accordion expanded={expanded}>
            <AccordionSummary 
                expandIcon={
                    <IconButton onClick={() => setExpanded(!expanded)}>
                        <IconsMaterial.ExpandMore />
                    </IconButton>
                } 
            >
                <Typography 
                    textAlign='center' 
                    sx={{ 
                        display : 'flex', 
                        flexDirection : 'column',
                        justifyContent : 'center'
                    }}
                >
                    {page.name} 
                </Typography>
                <Box display='flex' justifyContent='flex-end' sx={{ flexGrow : 1 }}>
                    {/* <Tooltip title="open in same tab" >
                        <IconButton size="large" onClick={() => {console.log("not implemented yet")}}>
                            <IconsMaterial.OpenInNewOffTwoTone />
                        </IconButton>
                    </Tooltip> */}
                    <Tooltip title="open">
                        <IconButton 
                            size="large" 
                            onMouseEnter={(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) =>  setPageURL(page.URL)}
                            onClick={async() => await openPage()}
                        >
                            <IconsMaterial.LaunchTwoTone />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='edit'>
                        <IconButton 
                            size="large" 
                            onClick={() => {
                                setOpenPageDialog(true)
                                setPageDialogDefaultData(page)
                            }
                        }> 
                            <IconsMaterial.EditTwoTone /> 
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="delete" >
                        <IconButton size="large" onClick={() => deletePage(page.name)}>
                            <IconsMaterial.DeleteTwoTone />
                        </IconButton>
                    </Tooltip>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="caption">{page.description}</Typography>
                <br />
                <Typography fontSize={14} variant='overline'>
                    URL :  
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
            </AccordionDetails>
        </Accordion>     
    )
}

