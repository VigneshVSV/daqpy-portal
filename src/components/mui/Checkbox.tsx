// Internal & 3rd party functional libraries
import { observer } from 'mobx-react-lite';
// Custom functional libraries
// Internal & 3rd party component libraries
import { Checkbox } from '@mui/material';
// Custom component libraries
import { RenderEngine, RenderEngineComponentProps } from '../../mobx/render-engine';
import { ContextfulMUICheckboxProps } from '../../mobx/component-types';



export const ContexfulMUICheckbox = observer(({state, renderer, logger, ...props } : RenderEngineComponentProps) => {

    const { action, centerRipple, checked, checkedIcon, classes, color, defaultChecked, disabled,
        disableRipple, disableTouchRipple, focusRipple, icon, id, indeterminate, indeterminateIcon, 
        inputProps, inputRef, onChange, required, size, sx, value, 
        focusVisibleClassName, LinkComponent, onFocusVisible, TouchRippleProps, touchRippleRef } = state.computedProps as ContextfulMUICheckboxProps

    const checkedIconComponent = renderer.Component(checkedIcon as any) as any
    const iconComponent = renderer.Component(icon as any) as any
    const indeterminateIconComponent = renderer.Component(indeterminateIcon as any) as any
    const LinkComponentComponent = renderer.Component(LinkComponent as any) as any

    const SytledCheckbox = RenderEngine.StyledComponent(Checkbox, state.metadata.styling)
    // Note - could be unstyled also.
    logger.logMounting('ContextfulMUICheckbox', id)
    
    return(
        <SytledCheckbox
            action={action}
            centerRipple={centerRipple}
            checked={checked}
            checkedIcon={checkedIconComponent}
            classes={classes}
            color={color}
            defaultChecked={defaultChecked}
            disabled={disabled}
            disableRipple={disableRipple}
            disableTouchRipple={disableTouchRipple}
            focusRipple={focusRipple}
            focusVisibleClassName={focusVisibleClassName}
            LinkComponent={LinkComponentComponent}
            onFocusVisible={onFocusVisible}
            icon={iconComponent}
            id={id}
            indeterminate={indeterminate}
            indeterminateIcon={indeterminateIconComponent}
            inputProps={inputProps}
            inputRef={inputRef}
            onChange={onChange}
            required={required}
            size={size}
            sx={sx}
            value={value}
            TouchRippleProps={TouchRippleProps}
            touchRippleRef={touchRippleRef}
            {...props}
        >
        </SytledCheckbox>
    )
})