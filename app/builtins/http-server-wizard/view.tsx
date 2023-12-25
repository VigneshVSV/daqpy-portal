// Internal & 3rd party functional libraries
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
// Custom functional libraries
import { asyncRequest } from "mobx-render-engine/utils/http";
import { ParseJSONString } from "mobx-render-engine/utils/misc";
// Internal & 3rd party component libraries
import { Box, Button, FormControl, Stack, Tab, Tabs,  Typography, Autocomplete, TextField, MobileStepper, 
    useTheme, Stepper, Step, StepLabel, FormControlLabel, Checkbox, RadioGroup, Radio, 
    Container, Chip, Divider, } from "@mui/material"
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-crimson_editor"
import "ace-builds/src-noconflict/ext-language_tools";
// Custom component libraries 
import { AppState } from "../app-state";
import { ApplicationState, PythonServer } from "../../mobx/state-container";
import { ParameterInfo, ParameterInformation } from "../remote-object-client/remote-object-info-containers";
import { ScriptImporterData } from "./remote-object-wizard-data-container";
import { ErrorViewer } from "../reuse-components";




export const BackendServerWizard = ({ globalState } : AppState) => {

    const [server, setServer] = useState<PythonServer>(globalState.servers[0]);
    const [serverData, setServerData] = useState({})
    
    const handleChange = (server : string) => {
        for(let server_ of globalState.servers){
            if(server === server_.qualifiedIP)
                setServer(server_);
        }
    };

    return (
        <div>
            <Stack id="http-servers-select-box" direction="row" spacing={10} sx={{pl : 2, pr :2}}>
                <Box sx={{flexGrow : 0.5, display: 'flex'}} >
                    <Autocomplete
                        id="http-servers-select-autocomplete"
                        disablePortal
                        autoComplete    
                        onChange={(event, server) => handleChange(server as string) }
                        defaultValue={server.qualifiedIP}
                        options={globalState.servers.map((value : PythonServer) => {return value.qualifiedIP})}
                        sx={{ flexGrow : 1, display: 'flex'}}
                        renderInput={(params) => 
                            <TextField {...params} 
                                variant="standard"
                                helperText="choose server" 
                                size="small"
                            />}
                    />
                </Box>
            </Stack>
            <VerticalTabs currentServer={server} globalState={globalState}></VerticalTabs>
        </div>
    )
}


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden ={value !== index}
            id ={`vertical-tabpanel-${index}`}
            {...other}
            style={{
                "width" : "100%"
            }}      
        >
            {value === index && (
                <Box sx={{ pl: 3, flexGrow: 1, display: 'flex' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
  

type VerticalTabsProps = { 
    currentServer : PythonServer,
    globalState : ApplicationState
}

export default function VerticalTabs( { currentServer, globalState } : VerticalTabsProps  ) {

    const fields = ['Status', 'New Eventloop', 'New Device', 'New HTTP Server']
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [errorTraceback, setErrorTraceback] = useState<Array<string>>([])
    
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
  
    return (
        <Box
            id ="vertical-tabs-fields"
            sx={{ flexGrow: 1, display: 'flex', pt : 5}}
        >
            <Stack direction="row" sx={{ flexGrow: 1, display: 'flex'}}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    sx={{ borderRight: 2, borderColor: 'divider' }}
                    >
                    {fields.map((name : string) => 
                        <Tab label={name} id={name} sx={{ maxWidth: 150}} key={name}/>
                    )}
                </Tabs>
                <Stack sx={{ flexGrow: 1, display: 'flex', pl : 3 }}>
                    {fields.map((name : string, index : number) => 
                        <TabPanel value={value} index={index} key={name+index.toString()}>
                            <VerticalTabComponents 
                                name={name} 
                                currentServer={currentServer}
                                globalState={globalState} 
                                setErrorMessage={setErrorMessage}
                                setErrorTraceback={setErrorTraceback}
                                />
                        </TabPanel>
                    )}
                    <Divider light>ERRORS IF ANY APPEAR BELOW</Divider>
                    <ErrorViewer 
                        errorMessage={errorMessage} 
                        errorTraceback={errorTraceback}
                    />                    
                </Stack>
            </Stack>
      </Box>
    );
}

type VerticalTabComponentsProps = { 
    name : string 
    currentServer : PythonServer
    globalState : ApplicationState
    setErrorMessage : any 
    setErrorTraceback : any
}

const VerticalTabComponents = ( { name, currentServer, globalState, setErrorMessage, setErrorTraceback } : VerticalTabComponentsProps ) => {

    switch(name) {
        case 'Status'          : return <StatusDisplay
                                            globalState={globalState}
                                            currentServer={currentServer}
                                        />
        case 'New Eventloop'   : return <EventLoopWizard></EventLoopWizard>
        case 'New Device'      : return <RemoteObjectWizard 
                                            globalState={globalState}
                                            currentServer={currentServer}
                                            setErrorMessage={setErrorMessage}
                                            setErrorTraceback={setErrorTraceback}
                                        />
        case 'New HTTP Server' : return <HTTPServerWizard></HTTPServerWizard>
        default : return <div>error</div>
    }
}

type StatusDisplayProps = {
    globalState : ApplicationState
    currentServer : PythonServer
}

const StatusDisplay = (props : StatusDisplayProps) => {
    console.log(props.currentServer)
    // - get postman/hoppscotch files
    const sortedRemoteObjects = props.currentServer.remoteObjectInfo.reduce((totalInfo, currentInfo) => {
            // @ts-ignore    
            if(!totalInfo[currentInfo.level])
                // @ts-ignore
                totalInfo[currentInfo.level] = []
            // @ts-ignore                
            totalInfo[currentInfo.level].push(currentInfo)
            return totalInfo
        }, {})
            // }, {}))

    return (
        <div> 
            {
                sortedRemoteObjects? Object.keys(sortedRemoteObjects).map((level)=>{
                    return (
                        <div key={level}>
                            <Stack>
                                <Typography variant="button" fontSize={24} textAlign={"center"}>
                                    {`LEVEL ${level}`}
                                </Typography>
                                {
                                    // @ts-ignore
                                    sortedRemoteObjects[level].map((info : any) => {
                                        return (
                                            <FormControlLabel 
                                                key={info.instance_name}
                                                value={info.instance_name}
                                                control={<Radio />} 
                                                checked={props.currentServer.remoteObjectState[info.instance_name] !== 'DEAD'}
                                                label={
                                                    <Stack direction="row">
                                                        <Typography>
                                                            {info.instance_name} 
                                                        </Typography>
                                                        <Typography component="pre" color={"grey"}>
                                                            {` (${props.currentServer.remoteObjectState[info.instance_name]})`}
                                                        </Typography>
                                                    </Stack>    
                                                }
                                            />
                                            )
                                        })                                    
                                }
                            </Stack>    
                        </div>
                    )})  : null 

            }
        </div>
    )
}


const EventLoopWizard = (props : any) => {

    return (
        <div>
            Event Loop Wizard
        </div>
    )
}

export const PrevNextNavigation = (props : any) => {
    
    return (
        <Container sx={{display : 'flex', flexDirection : 'row',  justifyContent: 'space-between', pt : 2 }} disableGutters>
            {props.previous ? 
                <Box sx={{
                    display : 'flex', 
                    justifyContent:'flex-start', 
                    p:1, flexGrow : 1}}
                    onClick={()=> props.setActiveStep(props.activeStep-1)}
                > 
                    <Button startIcon={<ArrowBackIcon />} variant='outlined'>
                        previous
                    </Button>
                </Box> 
                : null}
            {props.next ?  
                <Box sx={{
                    display : 'flex', 
                    justifyContent : 'flex-end', 
                    p:1, flexGrow : 1}} 
                    onClick={()=> props.setActiveStep(props.activeStep+1)}
                >
                    <Button endIcon={<ArrowForwardIcon />} variant='outlined'>
                        next
                    </Button>
                </Box> 
                : null}
        </Container> 
    )
}


type RemoteObjectWizardProps = {
    currentServer : PythonServer
    globalState : ApplicationState
    setErrorMessage : any 
    setErrorTraceback : any 
}

const RemoteObjectWizard = ( { currentServer, globalState, setErrorMessage, setErrorTraceback } : RemoteObjectWizardProps ) => {

    console.log(currentServer)
    const [activeStep, setActiveStep] = React.useState(0)
    const [successfulSteps, setSuccessfulSteps] = React.useState(globalState.HTTPServerWizardData.remoteObjectWizardData.successfulSteps)
    const [DBParamInfo, setDBParamInfo] = useState<Array<ParameterInformation>>([])
    const theme = useTheme()

    return (
        <Stack id="device-wizard" sx={{ flexGrow: 1, display: 'flex' }} >
            <Box id="stepper-component-box" sx={{ flexGrow: 1, display: 'flex'}} >
                <StepperComponent 
                    globalState={globalState}
                    activeStep={activeStep} 
                    setActiveStep={setActiveStep} 
                    currentServer={currentServer}
                    setErrorMessage={setErrorMessage}
                    setErrorTraceback={setErrorTraceback}
                    successfulSteps={successfulSteps}
                    setSuccessfulSteps={setSuccessfulSteps}
                    DBParamInfo={DBParamInfo}
                    setDBParamInfo={setDBParamInfo}
                />
                <Box sx={{ display: "flex", flexGrow : 0.75 }}></Box> 
            </Box>   
            <Box sx={{ flexGrow: 1, display: 'flex'}}>
                <Stack sx={{ flexGrow: 0.5, display: 'flex'}}>
                    <Stepper 
                        activeStep={activeStep} 
                        sx={{pt : 5, flexGrow: 0.25, display: 'flex'}}
                    >
                        <Step key="new-remote-object-step-0">
                            <StepLabel>Import</StepLabel>
                        </Step>
                        <Step key="new-remote-object-step-1"> 
                            <StepLabel>Instantiate</StepLabel>
                        </Step>
                        <Step key="new-remote-object-step-2"> 
                            <StepLabel>Link HTTP server</StepLabel>
                        </Step>
                    </Stepper>
                    <PrevNextNavigation 
                        previous={activeStep > 0 && successfulSteps[activeStep-1]} 
                        next={activeStep < 3 && successfulSteps[activeStep]}
                        activeStep={activeStep}
                        setActiveStep={setActiveStep} 
                    />
                </Stack>
            </Box>
        </Stack>
    )
}

type StepperComponentProps = {
    globalState : ApplicationState
    activeStep : number 
    setActiveStep : any, 
    currentServer : PythonServer,
    setErrorMessage : any 
    setErrorTraceback : any 
    successfulSteps : any 
    setSuccessfulSteps : any
    DBParamInfo? : ParameterInformation[]
    setDBParamInfo? : any
}

const StepperComponent = ( {globalState, activeStep, setActiveStep, currentServer, setErrorMessage, setErrorTraceback,
                            successfulSteps, setSuccessfulSteps, DBParamInfo, setDBParamInfo } : StepperComponentProps ) => {

    switch(activeStep) {
        case 0 : return <ScriptImporter 
                            globalState={globalState}
                            currentScriptImporterData={globalState.HTTPServerWizardData.remoteObjectWizardData.scriptImporterData}
                            activeStep={activeStep} 
                            setActiveStep={setActiveStep} 
                            currentServer={currentServer} 
                            setErrorMessage={setErrorMessage}
                            setErrorTraceback={setErrorTraceback}
                            successfulSteps={successfulSteps}
                            setSuccessfulSteps={setSuccessfulSteps}
                            setDBParamInfo={setDBParamInfo}
                        />  
        case 1 : return <RemoteObjectInstantiator 
                            globalState={globalState}
                            activeStep={activeStep} 
                            setActiveStep={setActiveStep} 
                            currentServer={currentServer}
                            setErrorMessage={setErrorMessage}
                            setErrorTraceback={setErrorTraceback}
                            successfulSteps={successfulSteps}
                            setSuccessfulSteps={setSuccessfulSteps}
                            DBParamInfo={DBParamInfo}
                        />
        case 2 : return <div>http server</div>
        default : return null 
    }
}

type ScriptImporterProps = StepperComponentProps & {
    currentScriptImporterData : ScriptImporterData
}

const useStateRef = <T extends unknown>(initialState: T) => {
    const ref = useRef(initialState);
    const [state, setState] = useState(ref.current);

    const setSyncState = (value : T) => {
        setState(value)
        ref.current = value;
    };
   
    // Use "as const" below so the returned array is a proper tuple
    return [state, setSyncState, ref] as const;
};

const ScriptImporter = ( { globalState, currentScriptImporterData, activeStep, setActiveStep, currentServer, 
                setErrorMessage, setErrorTraceback,
                            successfulSteps, setSuccessfulSteps, setDBParamInfo } : ScriptImporterProps ) => {
    
    const [useExistingDevice, setUseExistingDevice, useExistingDeviceRef] = useStateRef<boolean>(currentScriptImporterData.useExistingRemoteObject)
    const [useExistingEventloop, setUseExistingEventloop, useExistingEventloopRef] = useStateRef<boolean>(currentScriptImporterData.useExistingEventloop)
    const [eventloop, setEventloop, eventloopRef] = useStateRef<string>(currentScriptImporterData.eventloopInstanceName) 
    const [script, setScript, scriptRef] = useStateRef<string>(currentScriptImporterData.script)
    const [class_, setClass_, class_Ref] = useStateRef<string>(currentScriptImporterData.className)

    useEffect(() => {
        return () => {
            let scriptImporterInfo = {
                useExistingRemoteObject : useExistingDeviceRef.current,
                className : class_Ref.current,
                script : scriptRef.current, 
                useExistingEventloop : useExistingEventloopRef.current, 
                eventloopInstanceName : eventloopRef.current 
            }
            globalState.HTTPServerWizardData.remoteObjectWizardData.scriptImporterData = new ScriptImporterData(scriptImporterInfo)
        }
    }, [])

    const importScript = async() => {
        try {
            const response = await asyncRequest({
                url : '/server-util/remote-object/import',
                method : 'post',
                data : {
                    file_name : script,
                    object_name : class_,
                    eventloop_name : eventloop,
                    // existing_eventloop : useExistingEventloop
                },
                baseURL: "http://"+currentServer.qualifiedIP
            }) as AxiosResponse
            if(response.status===200) {
                debugger
                successfulSteps[0] = true
                setSuccessfulSteps([...successfulSteps])
                let DBParamInfo = []
                for(let key of Object.keys(response.data.returnValue.db_params))
                    DBParamInfo.push(new ParameterInformation(response.data.returnValue.db_params[key] as ParameterInfo))
                console.log(DBParamInfo)
                setDBParamInfo(DBParamInfo)
                setActiveStep(1)
                setErrorMessage('')
                setErrorTraceback([])
                console.log(response.data.returnValue.id)
                globalState.HTTPServerWizardData.remoteObjectWizardData.id = response.data.returnValue.id
            }
        else if (response.data.exception) {
            setErrorMessage(response.data.exception.message)
            setErrorTraceback(response.data.exception.traceback)
        }
        } catch(error : any) {
            setErrorMessage(error.message)
        }
    }

    return (
        <Stack sx={{ display: "flex", flexGrow : 1 }}>
            <Stack direction = 'row' sx={{ display: "flex", flexGrow : 0.5 }}>
                <FormControlLabel
                    id='use-existing-remote-object'
                    label='use existing remote object'
                    control={<Checkbox
                                checked={useExistingDevice}
                                onChange={(event) => {
                                    if(event.target.checked){
                                        setScript(currentServer.remote_object_classes[0].script)
                                        setClass_(currentServer.remote_object_classes[0].class_name)
                                    }
                                    setUseExistingDevice(event.target.checked)}
                                }
                            />}
                />
                {useExistingDevice ? 
                    <Autocomplete
                        id='existing-remote-object-classes'
                        disablePortal
                        autoComplete   
                        defaultValue={currentServer.remote_object_classes[0].class_name}
                        options={currentServer.remote_object_classes.map((RO) => {return RO.class_name})}
                        renderInput={(params) => <TextField {...params} label='existing classes' variant="standard"/>}
                        onChange={(event: React.SyntheticEvent, newValue: string | null) => {
                            if(newValue) {
                                let currentOption = currentServer.remote_object_classes.filter(info => info.class_name === newValue)[0]
                                setScript(currentOption.script)
                                setClass_(currentOption.class_name)
                            }
                        }}
                        sx={{ display: "flex", flexGrow : 0.25 }}
                    /> : null}
            </Stack>
            <Box sx={{ display: "flex", flexGrow : 0.5 }}>
                <TextField 
                    disabled={useExistingDevice}
                    value={script}
                    label="script path" 
                    required 
                    variant="standard" 
                    helperText="absolute path to your python script (.py) or python package (with __init__.py)"
                    sx={{ display: "flex", flexGrow : 0.5 }} 
                    onChange={(event) => setScript(event.target.value)}
                />
            </Box>
            <Box sx={{ display: "flex", flexGrow : 0.5 }}>
                <TextField 
                    label="class name" 
                    value={class_}
                    disabled={useExistingDevice}
                    required 
                    variant="standard" 
                    helperText="name of the class to import"
                    sx={{ display: "flex", flexGrow : 0.25 }} 
                    onChange={(event) => setClass_(event.target.value)}
                />
            </Box>
            <Stack direction="row" sx={{ display: "flex", flexGrow : 0.5, pt : 3, pb : 2 }}>
                <FormControlLabel
                    label="use existing eventloop"
                    control={<Checkbox
                        checked={useExistingEventloop}
                        onChange={(event) => {
                            setEventloop(currentServer.eventloops[0])
                            setUseExistingEventloop(event.target.checked)
                        }}
                    />}  
                />
                {useExistingEventloop ?
                    <Autocomplete
                        id='existing-eventloops'
                        disablePortal
                        autoComplete   
                        defaultValue={currentServer.eventloops[0]}
                        options={currentServer.eventloops}
                        renderInput={(params) => <TextField {...params} label='existing classes' variant="standard"/>}
                        onChange={(event: React.SyntheticEvent, newValue: string | null) => {
                            if(newValue) {
                                let currentOption = currentServer.eventloops.filter(name => name === newValue)[0]
                                setEventloop(currentOption)
                            }
                        }}
                        sx={{ display: "flex", flexGrow : 0.25 }}
                    />
                : null} 
            </Stack>
            <Stack direction="row" spacing={2} sx={{ display: "flex", flexGrow : 0.75 }}>
                <TextField 
                    disabled={useExistingEventloop}
                    value={eventloop}
                    id='event-loop-name-textfield'
                    label='Eventloop Instance Name' 
                    variant="standard" 
                    onChange={(event) => setEventloop(event.target.value)}
                    helperText="optional, unique - if specified, remote-objects can be added to same loop later" 
                    sx={{ display: "flex", flexGrow : 0.5 }}
                />
                <Autocomplete
                    disabled={useExistingEventloop}
                    id='event-loop-log-level'
                    disablePortal
                    autoComplete   
                    defaultValue={'INFO'}
                    options={['DEBUG', 'INFO', 'ERROR']}
                    renderInput={(params) => <TextField {...params} label='log level' variant="standard"/>}
                    sx={{ display: "flex", flexGrow : 0.1 }}
                />
                <Autocomplete
                    disabled={useExistingEventloop}
                    id='event-loop-serializer'
                    disablePortal
                    autoComplete   
                    defaultValue={'SERPENT'}
                    options={['SERPENT', 'JSON', 'DILL', 'PICKLE']}
                    renderInput={(params) => <TextField {...params} label='serializer' variant="standard"/>}
                    sx={{ display: "flex", flexGrow : 0.15 }}
                />
            </Stack>
            <Box sx={{ display: "flex", flexGrow : 0.5, pt : 2 }}>
                <Button
                    variant="contained"
                    sx={{ display: "flex", flexGrow : 0.05 }}
                    onClick={importScript}
                >
                    Import
                </Button>
            </Box>
        </Stack>
    )
}


const RemoteObjectInstantiator = ( { globalState, activeStep, setActiveStep, currentServer, setErrorMessage, setErrorTraceback,
                                    successfulSteps, setSuccessfulSteps, DBParamInfo } : StepperComponentProps ) => {

    const [useDashedURLs, setUseDashedURLs] = useState<boolean>(true)
    const [instanceName, setInstanceName] = useState<string>('')
    const [logLevel, setLogLevel] = useState<number>(10)
    const [userKwargs, setUserKwargs] = useState<string>('')
    const [inputChoice, setInputChoice ] = useState('RAW')
    const [DBParams, setDBParams] = useState<any>(DBParamInfo ? DBParamInfo.reduce(
                                    (obj : object, currentValue : ParameterInformation) => {
                                        // @ts-ignore
                                        obj[currentValue.name] = ''
                                        return obj
                                    },
                                    {}
    ): {})
    const [currentParam, setCurrentParam] = useState<number>(0)
    const [currentParamValue, setCurrentParamValue] = useState<string>('')
    const handleInputSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputChoice(event.target.value)
    }

    const setParamValue = (newValue : any) => {
        console.log(JSON.parse(newValue), typeof JSON.parse(newValue))
        setCurrentParamValue(newValue)
        // @ts-ignore
        DBParams[DBParamInfo[currentParam].name] = JSON.parse(newValue)
        console.log(DBParams)
    }

    const instantiate = async() => {
        debugger
        try {
            let userKWARGS = userKwargs? ParseJSONString(userKwargs) : {}
            let request : AxiosRequestConfig = {
                url : '/server-util/remote-object/instantiate',
                method : 'post',
                data : {
                    id : globalState.HTTPServerWizardData.remoteObjectWizardData.id,
                    kwargs : {
                        ...userKWARGS,
                        instance_name : instanceName,
                        log_level : logLevel,                    
                    },
                    //  @ts
                    db_params : DBParams
                },
                baseURL: "http://" + currentServer.qualifiedIP
            }
            const response = await asyncRequest(request) as AxiosResponse
            if(response.status===200) {
                let sS = [...successfulSteps]
                sS[1] = true
                setSuccessfulSteps(sS)
                setActiveStep(2)
                setErrorMessage('')
                setErrorTraceback([])
            }
            else if (response.data.exception) {
                setErrorMessage(response.data.exception.message)
                setErrorTraceback(response.data.exception.traceback)
            }
        } catch(error : any) {
            setErrorMessage(error.message)
        }
        
    }

    const theme = useTheme()
    return (
        <Stack direction="column" sx={{ display: "flex", flexGrow : 0.75 }}>
            <Typography variant="button" sx={{textDecoration : 'underline'}}>
                BASIC DETAILS
            </Typography>
            <Stack direction="row" spacing={2} sx={{ display: "flex", flexGrow : 1 }}>
                <TextField 
                    id='instance-name-textfield'
                    value={instanceName}
                    label='Instance Name' 
                    required 
                    variant="standard" 
                    helperText="unique system wide name of your remote object instance" 
                    onChange={(event) => setInstanceName(event.target.value)}
                    sx={{ display: "flex", flexGrow : 0.5 }}
                />
                <Autocomplete
                    id='log-level'
                    disablePortal
                    autoComplete   
                    defaultValue={'INFO'}
                    options={['DEBUG', 'INFO', 'ERROR']}
                    renderInput={(params) => <TextField {...params} label='log level' variant="standard"/>}
                    sx={{ display: "flex", flexGrow : 0.1 }}
                />
                <Autocomplete
                    id='use-dashed-URLs'
                    disablePortal
                    autoComplete 
                    onChange={(event, newValue) => {
                        if(newValue === 'False')
                            setUseDashedURLs(false)
                        else 
                            setUseDashedURLs(true)
                    }}  
                    defaultValue={'True'}
                    options={['False', 'True']}
                    renderInput={(params) => <TextField {...params} label='use dashed URLs' variant="standard"/>}
                    sx={{ display: "flex", flexGrow : 0.1 }}
                />
            </Stack>
            <Stack direction='row' sx={{ display: "flex", flexGrow : 1, pt : 2 }}>
                <Box sx={{ display: "flex", flexGrow : 0.25 }}>
                    <Stack sx={{ display: "flex", flexGrow : 1 }}>
                        <Typography variant="button" sx={{textDecoration : 'underline'}}>
                            positional and keyword arguments to init 
                        </Typography>
                        <Typography fontSize={14} fontWeight={500}>
                            enter keyword as JSON fields and non-keywords under a 'args' field as a list
                        </Typography>
                        <AceEditor
                            name="remote-object-wizard-init-args-json-input"
                            mode="json"
                            theme="crimson_editor"
                            // onLoad={this.onLoad}
                            onChange={(newValue) => {setUserKwargs(newValue)}}
                            fontSize={18}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            wrapEnabled={true}
                            style={{
                                backgroundColor : theme.palette.grey[100],
                                maxHeight : 250,
                                overflow : 'scroll',
                                scrollBehavior : 'smooth',
                                width : "100%",
                            }}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 4
                            }}
                        />
                    </Stack>
                </Box>
                <Box sx={{display: "flex", flexGrow : 0.5}} id='empty-padding'></Box>
            </Stack>
            <Stack sx={{ pt : 5, flexGrow : 1, display : 'flex'}}>
                <Typography variant='button' sx={{textDecoration : 'underline'}}>
                    Database Parameters
                </Typography>
                <FormControl> 
                    <RadioGroup
                        row
                        value={inputChoice}
                        name="param-client-input-choice-group"
                        onChange={handleInputSelection}
                    >
                        <FormControlLabel value="RAW" control={<Radio size="small" />} label="raw" />
                        <FormControlLabel value="JSON" control={<Radio size="small" />} label="JSON" />
                    </RadioGroup>
                </FormControl>
                <Box sx={{ pt : 1, display : 'flex', flexGrow : 0.25}}>
                    <Stack sx={{display : 'flex', flexGrow : 1}}>
                        <Typography sx={{display : 'flex', flexGrow : 1, pb : 1}} align="center">{
                            //@ts-ignore
                            DBParamInfo[currentParam].name}
                        </Typography>
                        <ParameterInputChoice 
                            choice={inputChoice}
                            // @ts-ignore
                            parameter={DBParamInfo[currentParam]}
                            value={currentParamValue}
                            setValue={setParamValue}
                        />
                        <Typography sx={{pt : 1}}>{
                            //@ts-ignore
                            DBParamInfo[currentParam].doc}
                        </Typography>
                        {
                            //@ts-ignore
                            DBParamInfo[currentParam].chips.length > 0 ? <Box sx = {{ pb : 1, pt : 1}}>
                            {
                            //@ts-ignore
                            DBParamInfo[currentParam].chips.map((name : string, index : number) => {
                                return (<Chip key={"param-doc-viewer-chip-"+name} label={name} variant="filled"></Chip>)
                            })}
                        </Box> : null }
                        <MobileStepper
                            variant="text"
                            // @ts-ignore
                            steps={DBParamInfo.length}
                            activeStep={currentParam}
                            position='static'
                            nextButton={
                                <Button
                                    size="small"
                                    onClick={() => {setCurrentParam(currentParam+1)}}
                                    // @ts-ignore
                                    disabled={currentParam === DBParamInfo.length - 1}
                                >
                                    Next
                                    <KeyboardArrowRight />
                                </Button>
                            }
                            backButton={
                                <Button 
                                    size="small" 
                                    onClick={() => {setCurrentParam(currentParam-1)}}
                                    disabled={currentParam === 0}
                                >
                                    <KeyboardArrowLeft /> 
                                    Back
                                </Button>
                            }
                        />
                    </Stack>
                    <Box sx={{  display : 'flex', flexGrow : 0.5}}></Box>
                </Box>
                <Box sx={{ display : 'flex', flexGrow : 0.1, pt : 2}}>
                    <Button variant='contained' onClick={instantiate}>
                        Instantiate
                    </Button>
                </Box>
            </Stack>
        </Stack>
    )
}



export const ParamWizard = (props : any) => {
   
    return (
       <div>
        Input Paramters
       </div>
    )
}


export const HTTPServerWizard = (props : any) => {

    const [port, setPort] = useState<number>(8080)
    const [subscribeToCurrentHost, setSubscribeToCurrentHost] = useState<boolean>(true)
    const handleSubscription = (event : any) => {
        setSubscribeToCurrentHost(event.target.checked)
    }

    return (
        <Box
            id="http-server-wizard-box"
            sx={{ flexGrow: 1, display: 'flex', pl : 5}}
        > 
            <Stack direction="column" sx={{ display: "flex", flexGrow : 0.75 }}>
                <Stack direction="row" spacing={2} sx={{ display: "flex", flexGrow : 0.75 }}>
                    <TextField 
                        label="Port" 
                        value={port}
                        onChange={(event) => setPort(Number(event.target.value))}
                        required     
                        variant = "standard"
                    />
                    <Autocomplete
                        disablePortal
                        size="medium"
                        autoComplete   
                        defaultValue={'INFO'}
                        options={['DEBUG', 'INFO', 'ERROR']}
                        renderInput={(params) => <TextField {...params} variant="standard" label='log level'/>}
                        sx={{ display: "flex", flexGrow : 0.1 }}
                    />
                </Stack>
                <Stack direction = "row" sx={{pt : 1}}>
                    <TextField 
                        label="remote objects" 
                        multiline
                        rows={3}
                        variant = "standard"
                        helperText = "comma separated instance names of remote objects to be served, optional"
                        sx={{ display: "flex", flexGrow : 0.1 }}
                    />
                </Stack>
                <FormControlLabel
                    id='console-window-strinfiy-output-form'
                    label="subcribe to current primary host"
                    control={<Checkbox
                                id='console-window-stringify-output-checkbox'
                                size="small"
                                onChange={handleSubscription}
                            />}
                    checked={subscribeToCurrentHost}
                    sx={{ pt : 2}}
                />
                <TextField 
                    label="certificate file" 
                    variant = "standard"
                    helperText = "path to HTTPS certificate file (optional)"
                    sx={{ display: "flex", flexGrow : 0.1 }}
                />
                <TextField 
                    label="key file" 
                    variant = "standard"
                    helperText = "path to HTTPS key file (optional)"
                    sx={{ display: "flex", flexGrow : 0.1 }}
                />
                
                <Stack direction = "row" sx={{pt : 2}}>
                    <Button
                        variant="contained"
                        sx={{ display: "flex", flexGrow : 0.05 }}
                    >
                        Create
                    </Button>
                    <Box></Box>
                </Stack>
            </Stack>
        </Box>
    )
    
}

type ParameterInputChoiceProps = {
    choice : string 
    parameter : ParameterInformation
    value : any
    setValue : any
}

export const ParameterInputChoice = (props : ParameterInputChoiceProps) => {

    const theme = useTheme()
    switch(props.choice) {
        case 'JSON' : return <Box id="ace-editor-box" sx={{display : 'flex', flexGrow : 1}}>
                                <Stack direction='row' sx={{display : 'flex', flexGrow : 1}}>
                                    <AceEditor
                                        name="param-client-json-input"
                                        placeholder={props.parameter.readonly? "disabled" : 
                                            "Enter keyword as JSON and non-keywords under a 'args' field as a list"
                                        }
                                        mode="json"
                                        theme="crimson_editor"
                                        onChange={(newValue) =>{
                                            props.setValue(newValue)}
                                        } 
                                        fontSize={18}
                                        showPrintMargin={true}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        wrapEnabled={true}
                                        style={{
                                            backgroundColor : theme.palette.grey[100],
                                            maxHeight : 150,
                                            overflow : 'scroll',
                                            scrollBehavior : 'smooth',
                                            width : "100%",
                                        }}
                                        setOptions={{
                                            enableBasicAutocompletion: false,
                                            enableLiveAutocompletion: false,
                                            enableSnippets: false,
                                            showLineNumbers: true,
                                            tabSize: 4,
                                            readOnly : props.parameter.readonly 
                                        }}
                                    />
                                </Stack>
                            </Box>
        default : return <TextField
                            variant="outlined"
                            multiline
                            minRows={2}
                            size="small"
                            maxRows={100}
                            onChange={(event) =>{
                                props.setValue(event.target.value)}
                            } 
                            disabled={props.parameter.readonly}
                            label={props.parameter.readonly? "read-only" : "data"}
                            helperText={props.parameter.readonly? "disabled" : "press enter to expand"}
                            sx={{ flexGrow: 1, display : 'flex'}}
                        />
    }
}





/*
    - list all event loops 
    - list all devices
    - 
*/