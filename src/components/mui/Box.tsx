// Internal & 3rd party functional libraries
import { observer } from "mobx-react-lite"
// Custom functional libraries
// Internal & 3rd party component libraries
import { Box } from "@mui/material"
// Custom component libraries
import { RenderEngineComponentProps } from "../../mobx/render-engine"
import { ContextfulMUIBoxProps } from "../../mobx/component-types"



export const ContextfulMUIBox = observer( ({state, renderer, logger, ...props} : RenderEngineComponentProps ) => {

	const id = state.id
	const { component, sx } = state.computedProps as ContextfulMUIBoxProps
       
    const componentComponent = renderer.Component(component) as any 
    logger.logMounting("ContextfulMUIBox", state.id)

	return (
			<Box
				id={id}
				// https://mui.com/material-ui/api/box/
				component={componentComponent}
				sx={sx}
				{...props}
			>
				{renderer.Children(state.computedChildren)}
			</Box>
		)
	}
)