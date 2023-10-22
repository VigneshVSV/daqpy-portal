// Internal & 3rd party functional libraries
import { observer } from 'mobx-react-lite';
// Custom functional libraries
// Internal & 3rd party component libraries
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
// Custom component libraries
import { ContextfulMUIButtonGroupProps, ContextfulMUIButtonProps } from '../../mobx/component-types';
import { RenderEngineComponentProps } from '../../mobx/render-engine';



export const ContextfulMUIButtonGroup = observer( ({state, renderer, logger, ...props} : RenderEngineComponentProps ) => {

	const id = state.id
	const { classes, color, component, disabled, disableElevation, disableFocusRipple, disableRipple, fullWidth, orientation, 
			size, variant, sx } = state.computedProps as ContextfulMUIButtonGroupProps

    const componentComponent = renderer.Component(component) as any 
	logger.logMounting('ContextfulMUIButtonGroup', id)
	
	return (
			<ButtonGroup
				id={id} 				
                classes={classes}
				color={color}
                component={componentComponent}
				disabled={disabled}
				disableElevation={disableElevation}
				disableFocusRipple={disableFocusRipple}
				disableRipple={disableRipple}
				fullWidth={fullWidth}
				orientation={orientation}
				size={size}
				sx={sx}
				variant={variant}
				{...props}
			>
				{state.computedChildren.map((child : string) => {
					let childState = renderer.componentStateMap[child]
					const id = childState.id
					const { classes, color, component, disabled, disableElevation, disableFocusRipple, disableRipple, endIcon, fullWidth, 
							href, size, startIcon, variant, centerRipple, disableTouchRipple, focusRipple, focusVisibleClassName, 
							LinkComponent, sx, onFocusVisible, TouchRippleProps, touchRippleRef, onClick } = childState.computedProps as ContextfulMUIButtonProps
					
					const endIconComponent = renderer.Component(endIcon) as any
					const startIconComponent = renderer.Component(startIcon) as any
					const LinkComponentComponent = renderer.Component(LinkComponent) as any
					const componentComponent = renderer.Component(component) as any 

					logger.logMounting("ContextfulMUIHttpButton", state.id)
					// console.log(state.id, "extra props", props)
					return (
						<Button
							key={childState.tree}
							id={id}
							// https://mui.com/material-ui/api/button
							classes={classes}
							color={color}
							component={componentComponent}
							disabled={disabled}
							disableElevation={disableElevation}
							disableFocusRipple={disableFocusRipple}
							disableRipple={disableRipple}
							endIcon={endIconComponent}
							fullWidth={fullWidth}
							size={size}
							startIcon={startIconComponent}
							sx={sx}
							variant={variant}
							// https://mui.com/material-ui/api/button-base/
							// action                = {action}
							centerRipple={centerRipple}
							disableTouchRipple={disableTouchRipple}
							focusRipple={focusRipple}
							focusVisibleClassName={focusVisibleClassName}
							LinkComponent={LinkComponentComponent}
							// onFocusVisible        = {() => onFocusVisibleCallback}
							TouchRippleProps={TouchRippleProps}
							onClick={onClick}
							// touchRippleRef        = {touchRippleRef}
						>
							{renderer.Children(childState.computedChildren)}
						</Button>
					)
				})}
			</ButtonGroup>
		)
	}
)
