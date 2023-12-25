'use client'
// Internal & 3rd party functional libraries
import React, { useCallback, useState, useEffect, useRef } from "react";
import { AxiosResponse } from "axios";
import { ObjectInspector } from "react-inspector";
import { observer } from "mobx-react-lite";
// Custom functional libraries
import { ActionDispatcher } from "mobx-render-engine/state-manager";
import { Logger } from "mobx-render-engine/utils/logger";
import { asyncRequest } from "mobx-render-engine/utils/http";
import { timestamp, substringFromSlashedString } from "mobx-render-engine/utils/misc";
// Internal & 3rd party component libraries
import { IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Typography, 
     Dialog, Slide, AppBar, Toolbar, DialogTitle, DialogContent, DialogContentText, 
     DialogActions, Button, Menu, MenuItem, CircularProgress, Box } from "@mui/material"
import ListAltTwoToneIcon from '@mui/icons-material/ListAltTwoTone';
import NetworkPingTwoToneIcon from '@mui/icons-material/NetworkPingTwoTone';
import CloseIcon from '@mui/icons-material/Close'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
// Custom component libraries 
import { LogTable, useRendererLogColumns } from "./log-viewer/log-viewer";
import UnstyledTable from "./remote-object-client/doc-viewer";
import useForceUpdate, { ErrorViewer } from "./reuse-components";



type DashboardUtilityProps = { 
    show : boolean 
    currentPage : any 
    remoteObjects : string[]
    actionDispatcher : ActionDispatcher
}

const options = [
    { icon : <ErrorOutlineIcon />, name : 'last python error', type : 'component', width : 125 },
    { icon : <ListAltTwoToneIcon/>, name: 'logs', type : 'component', width : 40 },
    { icon : <FileDownloadTwoToneIcon />, name : 'download RGL layout', type : 'method', width : 160 },
    { icon : <NetworkPingTwoToneIcon />, name : "Remote Objects' status", type : 'component', width : 175 }
];

export const DashboardUtility = observer(({ show, currentPage, actionDispatcher, remoteObjects } : DashboardUtilityProps ) => {

    // https://mui.com/material-ui/react-speed-dial/#system-SpeedDialTooltipOpen.tsx
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [whichComponentOpen, setWhichComponentOpen] = useState<string | null>(null)
    
    const openComponent = useCallback((option : string) => {
        setWhichComponentOpen(option)
    }, [])
    
    const callMethod = useCallback((option : string) => {
        switch(option) {
            case 'edit grid' : currentPage.setGridEditable(); break;
            case 'save edited grid' : currentPage.setGridStatic(); break;
            default : break;
        }
    }, [])

    return (
        <>  
            {show? 
                <>
                    <SpeedDial
                        ariaLabel="dashboard options"
                        sx={{ position: 'absolute', bottom: 16, right: 16, p : 5 }}
                        icon={<SpeedDialIcon />}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        open={open}
                    >
                        {options.map((option) => (
                            <SpeedDialAction
                                key={option.name}
                                icon={option.icon}
                                tooltipTitle={option.name}
                                tooltipOpen
                                onClick={option.type === 'component'? () => openComponent(option.name) : () => callMethod(option.name)}
                                    sx={{
                                        ".MuiSpeedDialAction-staticTooltipLabel" : {
                                            width : option.width
                                        }
                                    }}
                                />
                            ))}
                    </SpeedDial>
                    {whichComponentOpen === 'logs'? 
                            <DashboardLogViewer 
                                setWhichComponentOpen={setWhichComponentOpen} 
                                actionsLogger={actionDispatcher.logger} 
                                rendererLogger={actionDispatcher.stateManager.renderer.logger}
                            /> : null 
                    }       
                    {whichComponentOpen === 'last python error' ?
                        <PythonErrorViewer 
                            setWhichComponentOpen={setWhichComponentOpen} 
                            lastPythonError={actionDispatcher.lastPythonError} 
                        /> : null
                    }
                    {whichComponentOpen === "Remote Objects' status" ?  
                        <RemoteObjectsStatus 
                            setWhichComponentOpen={setWhichComponentOpen} 
                            remoteObjects={remoteObjects} 
                            actionDispatcher={actionDispatcher}
                        /> : null
                    }
                </>
            : null} 
        </>
    )
})


const Transition = React.forwardRef(function Transition(props, ref) {
    // @ts-ignore
    return <Slide direction="down" ref={ref} {...props} ></Slide>;
});

type LogViewerProps = { 
    setWhichComponentOpen : any 
    actionsLogger : Logger 
    rendererLogger : Logger
}

export default function DashboardLogViewer( { setWhichComponentOpen, actionsLogger, rendererLogger } : LogViewerProps) {
    // https://mui.com/material-ui/react-dialog/#system-FullScreenDialog.tsx
    const [open, setOpen] = useState(true)
    const [rowData, setRowData] = useState(actionsLogger.sortedLogs)
    const columns = useRendererLogColumns('14px')
    const [selectedIndex, setSelectedIndex] = React.useState(1)
    const [loggerSubText, setLoggerSubText] = useState<string>('actions')

    const handleClose = () => {
        setOpen(false)
        setWhichComponentOpen(null)
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleMenuOpen = (event : any) => {
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }
    const handleMenuItemClick = (index : number) => {
        setSelectedIndex(index);
        let rdata, loggerText
        switch(index){
            case 2 : rdata = rendererLogger.sortedLogs; loggerText='renderer/state manager'; break;
            default : rdata = actionsLogger.sortedLogs;  loggerText='actions'; break;
        }
        // @ts-ignore
        setRowData(rdata)
        setLoggerSubText(loggerText)
        setAnchorEl(null);
    };

    return (
        <div style={{ minHeight : "100%" }}>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                // @ts-ignore
                TransitionComponent={Transition} // fix this later
            >
                <AppBar sx={{ position: 'relative' }} color="transparent">
                    <Toolbar variant="dense">
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ pr : 2 }} variant="h6" component="div">
                            Dashboard Logs
                        </Typography>
                        <Button onClick={handleMenuOpen}>
                            <Stack>
                                Logger Type
                                <Typography variant="caption" fontSize={10} alignSelf={"flex-start"}>
                                    {loggerSubText}
                                </Typography>
                            </Stack>
                        </Button>
                        <Menu
                            // https://mui.com/material-ui/react-menu/#system-BasicMenu.tsx
                            id="logger-type-menu"
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={(event) => handleMenuItemClick(1)} selected={selectedIndex === 1}>Actions</MenuItem>
                            <MenuItem onClick={(event) => handleMenuItemClick(2)} selected={selectedIndex === 2}>Renderer/State Manager</MenuItem>   
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Stack sx={{ pt : 2, pl : 5, pr : 5, pb : 1, display : 'flex', flexGrow : 1 }}>
                    <LogTable
                        rowData={rowData}
                        columnDefs={columns}
                    />
                </Stack>
            </Dialog>
        </div>
    );
}


export const PythonErrorViewer = ({ setWhichComponentOpen, lastPythonError } : any) => {

    const [open, setOpen] = useState(true)

    const handleDashboardMenuClose = useCallback(() => {
        setOpen(false)
        setWhichComponentOpen(null)
    }, [])

    return (
        <Dialog open={open} onClose={handleDashboardMenuClose} fullWidth>
            <DialogTitle>Last Python Error</DialogTitle>
            <DialogContent>
                {lastPythonError? 
                    <Stack>
                        <Typography>{lastPythonError.timestamp}</Typography>
                        <ErrorViewer
                            errorMessage={lastPythonError.message}
                            errorTraceback={lastPythonError.traceback}
                            fontSize={14}
                        />
                        <ObjectInspector data={lastPythonError.request}></ObjectInspector>
                    </Stack>
                    : <Typography>None Registered Yet</Typography>
                }
            </DialogContent>
            <DialogActions sx={{ pt : 5 }}>
                <Button onClick={handleDashboardMenuClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}



const RemoteObjectsStatus = (props : any) => {

    const [open, setOpen] = useState(true)
    const [useEffectDummyDependent, forceUpdate] = useForceUpdate()

    const handleDashboardMenuClose = useCallback(() => {
        setOpen(false)
        props.setWhichComponentOpen(null)
    }, [])

    return (
        <Dialog open={open} onClose={handleDashboardMenuClose} fullWidth maxWidth="xl" keepMounted>
            <DialogTitle>Remote Object Status</DialogTitle>
                <Box sx={{ p : 2 }}>
                    <UnstyledTable
                        tree='dashboard-remote-object-status-table'
                        head={
                            <thead>
                                <tr>
                                    <th>Instance Name</th>
                                    <th>
                                        Last Read State<br/>
                                        <Typography variant='caption' fontSize={10}>
                                            (unknown if object is unreachable)
                                        </Typography>
                                    </th>
                                    <th>HTTP Server Alive</th>
                                    <th>Updated Time</th>
                                    <th>Last Request</th>
                                    <th>Last Response</th>
                                </tr>
                            </thead>
                        }
                        rows={props.remoteObjects.map((remoteObject : any, index : number) => {
                            return {
                                id : String(index),
                                dynamic : true,
                                component : <RemoteObjectStatusRow
                                                url={remoteObject}
                                                lastRequest={props.actionDispatcher.lastRequestMap[substringFromSlashedString(remoteObject, '/', 3)]}
                                                useEffectDummyDependent={useEffectDummyDependent}
                                            />
                            }
                        })}
                    />
                </Box>
                
            <DialogActions sx={{ pt : 5 }} >
                <Button onClick={forceUpdate}>Refresh</Button>
                <Box sx={{ flexGrow : 1 }}></Box>
                <Button onClick={handleDashboardMenuClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}



type RemoteObjectStatusRowProps = {
    url : string 
    lastRequest : any
    useEffectDummyDependent : any
}

const RemoteObjectStatusRow = (props : RemoteObjectStatusRowProps) => {

    const instance_name=useRef(substringFromSlashedString(props.url, '/', 3))
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<{ [key : string] : any}>({
        className : null,
        objectState : 'unknown',
        HTTPServerAlive : false, 
        lastUpdatedTime : '',
        serverResponseStatus : null, 
        processAlive : 'no',
        pid : null
    })

    useEffect(() => {
        const loadInfo = async() => {
            setLoading(true)
            const response = await asyncRequest({
                url : '/ping',
                method : 'get',
                baseURL : props.url
            }) as AxiosResponse
            let clsName = null, state = 'unknown', serverAlive = false, status = null 
            console.log(instance_name, response)
            if (response.data) {
                if(response.data.exception) {
                    state = response.data.state[instance_name.current]? response.data.state[instance_name.current] : 'no state machine' 
                    status = response.status
                    serverAlive = true
                } 
                else if (response.data.returnValue) {
                    state = response.data.state[instance_name.current]? response.data.state[instance_name.current] : 'no state machine' 
                    status = response.status
                    serverAlive = true
                    clsName = response.data.returnValue.class_name 
                }
            }
            else if(response.status) {
                status = response.status
                serverAlive = true
            }
            // @ts-ignore
            else if(response.error) {
                // @ts-ignore
                if(response.error.response) {
                    serverAlive = true 
                    // @ts-ignore
                    status = response.error.response.status
                }   
                else 
                    serverAlive = false 
            }
            setStatus({
                className : clsName, 
                objectState : state,
                HTTPServerAlive : serverAlive, 
                lastUpdatedTime : timestamp(),
                serverResponseStatus : status, 
                processAlive : 'no'

            })
            setLoading(false)
        }
        loadInfo()
    }, [props.useEffectDummyDependent])
    
    return (
        <tr key={props.url}>
            <td style={{width : "32%"}} align="center">
                <Typography component='div'>
                    <Stack>
                        {props.url}
                        {status.className ? 
                            <Typography variant='caption' fontSize={10}>
                                class name - {status.class_name}, pid - {status.pid}
                            </Typography> : null
                        }
                    </Stack>
                </Typography>
            </td>
            <td style={{width : "15%"}} align="center">
                {loading? <CircularProgress size={20} /> : <Typography>{status.objectState}</Typography> }
            </td>
            <td style={{width : "8%"}} align="center">
                {loading? <CircularProgress size={20}/> : 
                    <Typography component='div'>
                        <Stack>
                            {String(status.HTTPServerAlive)}
                            {status.HTTPServerAlive ? 
                                <Typography variant='caption' fontSize={10}>
                                    returned {String(status.serverResponseStatus)}
                                </Typography> : null
                            }
                        </Stack>
                    </Typography> }
            </td>
            <td style={{width : "5%"}} align="center">
                <Typography>{status.lastUpdatedTime}</Typography>
            </td>
            <td style={{width : "20%"}} align="center">
                {props.lastRequest? <ObjectInspector data={props.lastRequest.config} /> : <div>None</div>}
            </td>
            <td style={{width : "20%"}} align="center">
                {props.lastRequest? <ObjectInspector data={props.lastRequest.response} /> : <div>None</div>}
            </td>
        </tr> 
    )
}


