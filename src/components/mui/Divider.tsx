// Internal & 3rd party functional libraries
import { observer } from "mobx-react-lite"
// Custom functional libraries
// Internal & 3rd party component libraries
import { Divider } from "@mui/material"
// Custom component libraries
import { RenderEngineComponentProps } from "../../mobx/render-engine"
import { ContextfulMUIDividerProps } from "../../mobx/component-types"



export const ContextfulMUIDivider = observer( ({state, renderer, logger, ...props} : RenderEngineComponentProps ) => {

	const id = state.id
	const { absolute, classes, component, flexItem, light, 
        orientation, sx, textAlign, variant } = state.computedProps as ContextfulMUIDividerProps
    const children = state.computedChildren
       
    const componentComponent = renderer.Component(component) as any 
    logger.logMounting("ContextfulMUIBox", id)
  
	return (
			<Divider
				id={id}
				// https://mui.com/material-ui/api/divider/
                absolute={absolute}
                classes={classes}
                component={componentComponent}
				flexItem={flexItem}
                light={light}
                orientation={orientation}
                sx={sx}
                textAlign={textAlign}
                variant={variant}
                {...props}
			>
                {children.length > 0 ? renderer.Children(children) : null}
			</Divider>
		)
	}
)