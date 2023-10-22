// Internal & 3rd party functional libraries
import { observer } from "mobx-react-lite";
// Custom functional libraries
// Internal & 3rd party component libraries
import Plot from "react-plotly.js";
import { Box } from "@mui/material";
// Custom component libraries
import { RenderEnginePlotlyProps } from "../mobx/render-engine";



export const ContextfulPlotlyGraph = observer( ( { state, renderer, logger } : RenderEnginePlotlyProps ) => {

    const id = state.id
    const { data, layout, frames, config, style } = state.computedPlot
    const revision = state.revision

    logger.logMounting("ContextfulPlotlyGraph", id)

    return (
        <Box 
            id={`${id}-daqpy-webdashboard-non-plotly-containing-box`}
            justifyContent="center"
            alignItems="center"
            sx={{ display : 'flex' , flexGrow : 1, width : "100%", height : "100%" }} 
        >
            <Plot 
                divId={id}
                data={data}
                layout={layout}
                frames={frames}
                config={config}
                revision={revision}
                style={style}
            />
        </Box>
    )
})