// Internal & 3rd party functional libraries
import { observer } from 'mobx-react-lite';
import { ChangeEvent } from 'react';
// Internal & 3rd party component libraries
import TextField from '@mui/material/TextField';
// Custom component libraries
import { ContextfulMUITextFieldProps } from '../../mobx/component-types';
import { RenderEngineComponentProps } from '../../mobx/render-engine';


// Note - refs, hover callbacks etc. are never used

export const ContextfulMUITextField = observer( ({ state, renderer, logger, ...props} : RenderEngineComponentProps ) => {

	const id = state.id
    const { classes, component, autoComplete, autoFocus, color, defaultValue, disabled, error, FormHelperTextProps, fullWidth, 
			helperText, InputLabelProps, inputProps, InputProps, label, margin, maxRows, minRows, multiline, 
			name, onChange, placeholder, required, rows, select, SelectProps, size, type, value, variant, 
			focused, hiddenLabel, sx } = state.computedProps as ContextfulMUITextFieldProps
    
    const labelComponent      = renderer.Component(label) as any
    const helperTextComponent = renderer.Component(helperText) as any
	const componentComponent  = renderer.Component(component) as any
    
    logger.logMounting("ContextfulMUITextField", state.id)

	return (
			<TextField
				id={id}
				// https://mui.com/material-ui/api/form-control/
				classes={classes}
				color={color}		
				// @ts-ignore		
				component={componentComponent}
				disabled={disabled}
				error={error}
				focused={focused}
				fullWidth={fullWidth}
				hiddenLabel={hiddenLabel}
				margin={margin}
				required={required}
				size={size}
				sx={sx}
				variant={variant}
				// https://mui.com/material-ui/api/text-field/
				autoComplete={autoComplete}
				autoFocus={autoFocus}
                defaultValue={defaultValue}
			    FormHelperTextProps={FormHelperTextProps}
				helperText={helperTextComponent}
				InputLabelProps={InputLabelProps}
				inputProps={inputProps}
				InputProps={InputProps}
				// inputRef         = {}
				label={labelComponent}
				maxRows={maxRows}
				minRows={minRows}
				multiline={multiline}
				name={name}
				onChange={(event : ChangeEvent<HTMLInputElement>) => onChange(event.target.value as any)}
				placeholder={placeholder}
				rows={rows}
				select={select}
				SelectProps={SelectProps}
				type={type}
				// value               = {value} - only for controlled Component
				{...props}
			>
				{renderer.Children(state.computedChildren)}
			</TextField>
		)
	}
)


