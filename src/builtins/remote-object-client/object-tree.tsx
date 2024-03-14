// Internal & 3rd party functional libraries
import { useEffect, useState } from 'react';
// Custom functional libraries
// Internal & 3rd party component libraries
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
// import TreeView from '@mui/lab/TreeView';
// import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import { Stack, Typography, Link, Divider, Box, IconButton, FormControl, InputLabel, Select, MenuItem, Checkbox, 
            ListItemText, OutlinedInput, SelectChangeEvent, ClickAwayListener } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
// Custom component libraries 
import { ApplicationState, PythonServer, getFullDomain } from '../../mobx/state-container';
import axios from 'axios';



function MinusSquare(props: SvgIconProps) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props: SvgIconProps) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props: SvgIconProps) {
    return (
        <SvgIcon
        className="close"
        fontSize="inherit"
        style={{ width: 14, height: 14 }}
        {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}


// const StyledTreeItem = styled((props: TreeItemProps) => (
//     <TreeItem {...props}  />
//     ))(({ theme }) => ({
//         [`& .${treeItemClasses.iconContainer}`]: {
//         '& .close': {
//         opacity: 0.3,
//         },
//         },
//         [`& .${treeItemClasses.group}`]: {
//         marginLeft: 15,
//         paddingLeft: 18,
//         borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
//         },
// }));

export type RemoteObjectTreeProps = {
    globalState : ApplicationState,
    sx : any,
    setCurrentRemoteObject : any
    fetchRemoteObjectInfo : any
}

export default function CustomizedTreeView({ globalState, sx, setCurrentRemoteObject, fetchRemoteObjectInfo } : RemoteObjectTreeProps ) {
    
    const [selectOpen, setSelectOpen] = useState<boolean>(false)
    const [viewOptions, setViewOptions] = useState<Array<string>>(['slash segregated', 'http server segregated', 
            'python class segregated', 'load on select'])
    const [currentOptions, setCurrentOptions] = useState<Array<string>>(['http server segregated'])
    const [loadOnSelect, setLoadOnSelect] = useState<boolean>(false)
    const segregationOptions = ['slash segregated', 'http server segregated', 'python class segregated']
    const [segregationType, setSegregationType] = useState<string>('http server segregated')

    const handleChange = (event: SelectChangeEvent) => {
        const { target: { value }, } = event;
        let val = typeof value === 'string' ? value.split(',') : value
        if (val.includes('load on select')) {
            if(!loadOnSelect)
                setLoadOnSelect(true)
        }
        else if (loadOnSelect) 
            setLoadOnSelect(false)
        let newOption = val.filter(opt => !currentOptions.includes(opt))[0];
        if(segregationOptions.includes(newOption)) {
            val = val.filter(opt => !segregationOptions.includes(opt))
            val.push(newOption)
            setSegregationType(newOption)
            setSelectOpen(false)
        }
        setCurrentOptions(val)
    };

    const handleNodeSelect = (event: React.SyntheticEvent, nodeId: string) => {
        setCurrentRemoteObject(nodeId)
        if(loadOnSelect)
            fetchRemoteObjectInfo(nodeId)
    }

    const handleSelectOpen = () => {
        setSelectOpen(true);
    };

    const handleSelectClose = () => {
        setSelectOpen(false);
    };

    useEffect(() => {
        const fetchSubscribers = async() => {
            try {
                const response = await axios.get(
                    `${globalState.primaryHostServer}/subscribers`,
                    { withCredentials : true }
                    )
                    if(response.status === 200)
                        globalState.servers = response.data
            } catch(error) {
                
            }
        }
        fetchSubscribers()
    }, [])

    return (
        <Stack sx={{ overflowX : "scroll", resize : "horizontal" }}> 
            <Typography variant="caption">
                SYSTEM HOST : 
            </Typography>
            <Link 
                onClick={() => window.open(globalState.primaryHostServer as string, "_blank")} 
                sx={{ display : 'flex', alignItems : "center", cursor:'pointer', fontSize : 14,  
                        color : "#0000EE", flexGrow : 1 }}
                underline="hover"
                variant="caption"
            >
                {globalState.primaryHostServer as string}
            </Link> 
            <TreeView
                id="remote-object-tree-view"
                defaultExpanded={['1']}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                sx={{ pr : 2, display : 'flex', flexGrow : 1 }}
                onNodeSelect={handleNodeSelect}
            >
                {/* {(globalState.primaryHostServer as PythonServer).remote_objects.map((instance_name, index) =>
                    <StyledTreeItem 
                        nodeId={getFullDomain((globalState.primaryHostServer as PythonServer)) + '/' + instance_name} 
                        label={instance_name}
                        key={instance_name}
                    />
                )} */}
                <Stack sx={{ display : 'flex', flexGrow : 1 }}>
                    <Divider>
                        <Typography variant='caption'>
                            REMOTE OBJECTS
                        </Typography>
                    </Divider>
                    <Stack direction='row' sx={{ display : 'flex', flexGrow : 1 }}>
                        <IconButton>
                            <RefreshTwoToneIcon></RefreshTwoToneIcon>
                        </IconButton>
                        <ClickAwayListener onClickAway={handleSelectClose}>
                            <Box sx={{ display : 'flex', flexGrow : 1 }}>
                                <FormControl sx={{ m: 1, display : 'flex', flexGrow : 1  }}>
                                    <InputLabel id="demo-multiple-checkbox-label" size="small" >options</InputLabel>
                                    <Select
                                        // open={selectOpen}
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        // onOpen={handleSelectOpen}
                                        multiple
                                        // @ts-ignore
                                        value={currentOptions}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="options" size="small" />}
                                        // @ts-ignore
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {viewOptions.map((choice : string) => (
                                            <MenuItem key={choice} value={choice}>
                                                <Checkbox checked={currentOptions.indexOf(choice) > -1} />
                                                <ListItemText primary={choice} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> 
                            </Box>
                        </ClickAwayListener> 
                    </Stack>
                </Stack>
                <SegregatedTreeItems globalState={globalState} segregationType={segregationType} />
            </TreeView>
        </Stack>
    );
}

type SegregatedTreeItemsProps = {
    globalState : ApplicationState,
    segregationType : string
}

const SegregatedTreeItems = ( {globalState, segregationType} : SegregatedTreeItemsProps ) => {

    switch(segregationType){
        case 'slash segregated' : return <SlashSegregatedRemoteObjects tree={globalState.slashSegregatedRemoteObjects} />
           
        default : return (
                        <>
                            {globalState.servers.map((server : PythonServer, index : number) => {
                                return( 
                                    server.qualifiedIP === (globalState.primaryHostServer as PythonServer).qualifiedIP ? 
                                    null : <div>commented out</div>
                                    // <StyledTreeItem 
                                    //     nodeId={server.qualifiedIP} 
                                    //     label={server.qualifiedIP}
                                    //     key={server.qualifiedIP}    
                                    // >
                                    //     {server.remote_objects.map((instance_name, index) =>
                                    //         <StyledTreeItem 
                                    //             nodeId={getFullDomain(server) + '/' + instance_name} 
                                    //             label={instance_name}
                                    //             key={instance_name}
                                    //         />
                                    //     )}
                                    // </StyledTreeItem> 
                            )})}
                        </>
                    )  
    }
}

export const SlashSegregatedRemoteObjects = ({ tree } : any) => {

    return (
        <>
            {typeof tree === 'string' ?
                null : 
                Object.keys(tree).map((key : string, index : number) => {
                    if(typeof tree[key] === 'string'){
                        return(
                            <div>commented out 2</div>
                            // <StyledTreeItem
                            //     key={tree[key]}
                            //     nodeId={tree[key]}
                            //     label={key}
                            // /> 
                        )
                    }
                    return (    
                        <div>commented out 3</div>
                        // <StyledTreeItem
                        //     key={key}
                        //     nodeId={key}
                        //     label={key}
                        // >
                        //     <SlashSegregatedRemoteObjects tree={tree[key]} />
                        // </StyledTreeItem>
                    )
                })
            }
        </>
    )
}