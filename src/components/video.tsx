import { observer } from "mobx-react-lite"
import { RenderEngineComponentProps } from "../mobx/render-engine"
import React from 'react'
import ReactPlayer from "react-player"
import { Player as VideoReact } from 'video-react'
import { GeneralComponentType } from "../mobx/component-types"
import { Box } from "@mui/material"

export const HLSVideo = ({ url } : {url : string}) => {

    //observer(( {state, renderer, logger} : RenderEngineComponentProps ) => {

    // const { url } = state.computedProps as GeneralComponentType
    console.log(url)
    return (
        <Box sx={{ width : 1000, height : 1000}} id='react-player-box'>

            <ReactPlayer
                // url={"https://gar-ws-medsch10:8084/camera/ueye/ethernet/event/image"}
                // playing={true}
                // muted={true}
                // light={true}
                // onBuffer={() => console.log("starting buffering")}
                // onError={(error, data) => console.log("encountered error", error, data)}
                // style={{
                //     border : '1px solid black'
                // }}
            />
        </Box>

        
    )
}
//)



export const HLSVideoReact = observer(( {state, renderer, logger} : RenderEngineComponentProps ) => {

    return (
        <VideoReact

        
        />

        
    )
})


export const ContextfulSSEVideo = observer(( {state, renderer, logger} : RenderEngineComponentProps ) => {

    // @ts-ignore
    const { img, boxProps } = state.computedImg 
    console.log("rendering image")
    return (
        <Box  {...boxProps} >
            <img src={img} width={boxProps.width? boxProps.width : 300} height={boxProps.height? boxProps.height : 300*9/16}/>
        </Box>
     )   
}) 