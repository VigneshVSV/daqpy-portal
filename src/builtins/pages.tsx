import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, Link, OutlinedInput, Paper, TextField, Toolbar, Tooltip, Typography } from "@mui/material"
import Container from '@mui/material/Container';
import { useEffect, useState } from "react";
import { asyncRequest } from "../utils/http";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import OpenInNewOffTwoToneIcon from '@mui/icons-material/OpenInNewOffTwoTone';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { RootLogger } from "./app-state"
import { AxiosResponse } from "axios";



export const AddPage = (props : any) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [URL, setURL] = useState('http://localhost:8080/pages/medsch10')

    const onSaveAndOpen = (event : any) => {
        RootLogger.logTraceMessage("AddPage", "unknown", "Save and Open not implemented yet")
    }

    const onSave = (event : any) => {
        RootLogger.logTraceMessage("AddPage", "unknown", "Save not implemented yet")
    }

    return (
        <Container component="main" maxWidth="sm" sx={{ mb: 2 }}>
            <Toolbar />        
            <Paper 
                variant='outlined'
                sx={{ my: { xs: 12, md: 12 }, p: { xs: 2, md: 2 } }}
                >
                <FormControl>
                    <Typography 
                        component="h2" 
                        variant="h4" 
                        align="center" 
                        >
                        New Page
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField 
                                id="add-page-name-textfield" 
                                label="Name" 
                                variant="standard" 
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
                                placeholder = "Enter URL of UI components server"
                                defaultValue="http://localhost:8080/pages/medsch10"
                                onChange={(event) => setURL(event.target.value)}
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
                            <Button
                                onClick={onSaveAndOpen}
                                >
                                Save and Open
                            </Button>
                        </Grid>
                        <Grid item xs={4} rowSpacing={0}>
                            <Button
                                // onClick={onQuickView}
                            >
                                Quick View
                            </Button>
                        </Grid>
                        <Grid item xs={4} rowSpacing={0}>
                            <Button
                                onClick={onSave}
                            >
                                Just Save
                            </Button>
                        </Grid>
                        { loading || error.length > 0 ? <Grid item xs={12} rowSpacing={0}>
                            <Box sx={{pl : 0.5}}> 
                            {loading ? <CircularProgress size={25} /> : null}
                            {error.length > 0 ? <Typography fontSize={12} fontWeight={700}>{error}</Typography> : null}
                            </Box>
                        </Grid> : null}
                    </Grid>
                </FormControl>
            </Paper>
        </Container>
    )
}



export const ShowPages = (props : any) => {

    const [pages, setPages] = useState([])
    const setGlobalLocation = props.setGlobalLocation
   
    useEffect(() => {
        const fetchData = async() => {
            const response = await asyncRequest({
                baseURL : 'http://localhost:8080',
                url : '/react-client-utilities/utils/u-iclient/pages/list',
                method : 'get'
            }) as AxiosResponse
            // pages = response.data
            setPages(response.data)
        }
        fetchData() 
    }, [])
   
    return (
        <>
            <Grid container direction = 'row' columns={3}>
                {/* {['Recent', 'Pages', 'Groups'].map((group : string, index : any) => {
                    <div key={'Pages'+index.toString()}> */}
                <Grid item xs ={1}>

                <Grid container direction = 'column'>
                    <Grid item>
                        <Typography variant='overline'>Pages</Typography>
                    </Grid>
                    <Grid item>

                    {pages.map((page : any, index) => {
                        return (
                            <Accordion key={index.toString()}>
                            <AccordionSummary 
                                expandIcon = {<ExpandMoreIcon />}
                            >
                                <Typography sx = {{pt : 1}}>{page[1]}</Typography>
                                <Box display='flex' justifyContent='flex-end' sx={{flexGrow : 1}}>
                                    <IconButton>
                                        <OpenInNewOffTwoToneIcon></OpenInNewOffTwoToneIcon>
                                    </IconButton>
                                    <IconButton onClick={() => {
                                        props.globalRouter.pageurl = page[3]
                                        setGlobalLocation('/Page/'+page[1])
                                    }}>
                                        <LaunchTwoToneIcon></LaunchTwoToneIcon>
                                    </IconButton>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{page[2]}</Typography>
                                <Typography fontSize={14} variant='overline'>
                                    URL :  
                                </Typography>
                                <Link target="_blank" rel="noopener noreferrer" href={page[3]} underline='hover' variant='body2' sx = {{pl : 1}}>
                                    {page[3]}
                                </Link>                                 
                                <Box display='flex' justifyContent="flex-start" sx={{flexGrow:1, pt:1}}>
                                    <Button variant='outlined' onClick={() => {
                                                props.globalRouter.pageurl = page[3]
                                                setGlobalLocation('/Page/'+page[1])
                                    }}>Open</Button>
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
                    )
                })}
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
            </>
    )

}