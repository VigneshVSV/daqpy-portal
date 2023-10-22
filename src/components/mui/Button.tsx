// Internal & 3rd party functional libraries
import { observer } from 'mobx-react-lite';
// Custom functional libraries
// Internal & 3rd party component libraries
import Button from '@mui/material/Button';
// Custom component libraries
import { RenderEngineComponentProps } from '../../mobx/render-engine';
import { ContextfulMUIButtonProps } from '../../mobx/component-types';

// Note - refs, hover callbacks etc. are never used


export const MUIButton = ({state, renderer, logger, ...props} : RenderEngineComponentProps) => {

	const id = state.id
	const { classes, color, component, disabled, disableElevation, disableFocusRipple, disableRipple, endIcon, fullWidth, 
			href, size, startIcon, variant, centerRipple, disableTouchRipple, focusRipple, focusVisibleClassName, 
			LinkComponent, sx, onFocusVisible, TouchRippleProps, touchRippleRef, onClick } = state.computedProps as ContextfulMUIButtonProps
       
    const endIconComponent = renderer.Component(endIcon) as any
    const startIconComponent = renderer.Component(startIcon) as any
    const LinkComponentComponent = renderer.Component(LinkComponent) as any
    const componentComponent = renderer.Component(component) as any 

    logger.logMounting("ContextfulMUIHttpButton", state.id)
	// console.log(state.id, "extra props", props)
	return (
		<Button
			id= {id}
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
			// href                  = {href}
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
			{...props}
		>
			{renderer.Children(state.computedChildren)}
		</Button>
	)
}

export const ContextfulMUIButton = observer(MUIButton)


export const ContextfulMUIhRefButton = observer( ({state, renderer, logger, ...props} : RenderEngineComponentProps) => {

	const id = state.id
	const { classes, color, component, disabled, disableElevation, disableFocusRipple, disableRipple, endIcon, fullWidth, href, 
			size, startIcon, variant, centerRipple, disableTouchRipple, focusRipple, focusVisibleClassName, 
			LinkComponent, sx, onFocusVisible, TouchRippleProps, touchRippleRef, onClick } = state.computedProps as ContextfulMUIButtonProps
       
    const endIconComponent = renderer.Component(endIcon) as any
    const startIconComponent = renderer.Component(startIcon) as any
    const LinkComponentComponent = renderer.Component(LinkComponent) as any
    const componentComponent = renderer.Component(component) as any 

    logger.logMounting("ContextfulMUIhRefButton", state.id)
  
	return (
			<Button
				id={id}
				// https://mui.com/material-ui/api/button
				classes={classes}
				color={color}
				component={componentComponent}
				disabled={disabled}
				disableElevation={disableElevation}
				disableFocusRipple ={disableFocusRipple}
				disableRipple={disableRipple}
				endIcon={endIconComponent}
				fullWidth={fullWidth}
				href={href}
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
				{...props}
			>
				{renderer.Children(state.computedChildren)}
			</Button>
		)
	}
)
