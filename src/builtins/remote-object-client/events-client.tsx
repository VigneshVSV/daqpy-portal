import { useState } from "react";
import { Button, Stack, ButtonGroup, Link } from "@mui/material"
import { EventInformation } from './remote-object-info-containers'
import { RemoteObjectClientState } from "./remote-object-client-state";
import { observer } from "mobx-react-lite";



type EventSelectWindowProps =  { 
    event : EventInformation
    clientState : RemoteObjectClientState    
}

export const SelectedEventWindow = observer((props : EventSelectWindowProps) => {

    const [eventURL, setEventURL] = useState(props.clientState.domain + props.event.fullpath)
   
    const streamEvent = () => {
        let source = new EventSource(eventURL)
        source.onmessage = (event : MessageEvent) => {
            if(props.clientState.stringifyOutput)    
                console.log(event.data)
            else 
                console.log(JSON.parse(event.data))
        } 
        source.onopen = (event) => {
            console.log(`subscribed to event source at ${eventURL}`)
        } 
        source.onerror = (error) => {
            console.log(error)
        }
        props.clientState.addEventSource(eventURL, source)
    }

    const stopEvent = () => {
        let eventSrc = props.clientState.eventSources[eventURL]
        if(eventSrc){
            eventSrc.close()
            console.log(`closing event source ${eventURL}`)
            props.clientState.removeEventSource(eventURL)
        }
    }

    return(
        <Stack>
            <Link 
                // @ts-ignore
                onClick={() => window.open(eventURL)} 
                sx={{ display : 'flex', alignItems : "center", cursor:'pointer',  pl : 2, pt : 1, fontSize : 18,
                    color : "#0000EE" }}
                underline="hover"
                variant="caption"
            >
                {eventURL}
            </Link> 
            <Stack direction = "row" sx={{ flexGrow: 1, display : 'flex', pl : 1, pt : 1 }}>
                <ButtonGroup 
                    variant="contained"
                    sx = {{ pr : 2 }}
                    disableElevation
                    color="secondary"
                >
                    <Button 
                        sx={{ flexGrow: 0.05, display : 'flex'}} 
                        onClick={streamEvent}
                        disabled={props.clientState.eventSources[eventURL] ? true : false}
                    >
                        Stream
                    </Button>
                    <Button 
                        sx={{ flexGrow: 0.05, display : 'flex'}} 
                        onClick={stopEvent}
                        disabled={props.clientState.eventSources[eventURL] ? false : true}
                    >
                        Stop
                    </Button>
                </ButtonGroup>
            </Stack>
        </Stack>
    )
})



