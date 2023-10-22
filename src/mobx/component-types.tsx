// Internal & 3rd party functional libraries
// Custom functional libraries
// Internal & 3rd party component libraries
import { TypographyProps } from '@mui/material/Typography';
import { ButtonProps } from '@mui/material/Button';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { Layout } from 'react-grid-layout';
import { TextFieldProps } from '@mui/material/TextField';
// Custom component libraries
import { ButtonGroupProps } from '@mui/material/ButtonGroup';
import { IconButtonProps } from '@mui/material/IconButton';
import { LinkProps } from '@mui/material/Link';
import { PaperProps } from '@mui/material/Paper';
import { FormControlProps } from '@mui/material/FormControl';
import { FormControlLabelProps } from '@mui/material/FormControlLabel/FormControlLabel';
import { FormLabelProps } from '@mui/material/FormLabel';
import { FormGroupProps } from '@mui/material/FormGroup';
import { RadioGroupProps } from '@mui/material/RadioGroup';
import { TableContainerProps } from '@mui/material/TableContainer';
import { TableProps } from '@mui/material/Table';
import { TableHeadProps } from '@mui/material/TableHead';
import { TableBodyProps } from '@mui/material/TableBody';
import { TableRowProps } from '@mui/material/TableRow';
import { TableCellProps } from '@mui/material/TableCell';
import { IconProps } from '@mui/material/Icon';
import { SwitchProps } from '@mui/material/Switch';
import { BoxProps } from '@mui/material/Box'; 
import { CheckboxProps, DividerProps, RadioProps, StackProps } from '@mui/material';


export type MUICustomBackendProps = {
    id : string
    sx : object
    component : string
}

export type ContextfulMUIButtonBaseProps = {
    onFocusVisible : any,
    LinkComponent  : string
} & ButtonBaseProps & MUICustomBackendProps

export type ContextfulMUIButtonProps = {
    LinkComponent  : string,
    endIcon        : string,
    startIcon      : string,
    onFocusVisible : any,
    onClick        : any, 
} & ButtonProps & MUICustomBackendProps

export type ContextfulMUITextFieldProps = {
    onChange   : any,
    helperText : string,
    label      : string 
    component  : string
} & TextFieldProps & MUICustomBackendProps

export type ContextfulMUIIconProps = MUICustomBackendProps & IconProps 
export type ContextfulMUIButtonGroupProps = MUICustomBackendProps & ButtonGroupProps
export type ContextfulMUISwitchProps = MUICustomBackendProps & SwitchProps 
export type ContextfulMUITypographyProps = MUICustomBackendProps & TypographyProps
export type ContextfulMUILinkProps  = MUICustomBackendProps & LinkProps
export type ContextfulMUIPaperProps = MUICustomBackendProps & PaperProps
export type ContextfulMUIFormControlProps = MUICustomBackendProps & FormControlProps

export type ContextfulMUIFormControlLabelProps = {
    control  : string
    label : string
} & FormControlLabelProps

export type ContextfulMUIFormLabelProps = MUICustomBackendProps & FormLabelProps
export type ContextfulMUIRadioGroupProps = MUICustomBackendProps & RadioGroupProps

export type ContextfulMUIRadioProps = {
    checkedIcon : string 
    icon : string
} & MUICustomBackendProps & RadioProps
export type ContextfulMUIFormGroupProps = MUICustomBackendProps & FormGroupProps
export type ContextfulMUITableContainerProps = MUICustomBackendProps & TableContainerProps
export type ContextfulMUITableProps = MUICustomBackendProps & TableProps
export type ContextfulMUITableHeadProps = MUICustomBackendProps & TableHeadProps
export type ContextfulMUITableBodyProps = MUICustomBackendProps & TableBodyProps
export type ContextfulMUITableRowProps = MUICustomBackendProps & TableRowProps
export type ContextfulMUITableCellProps = MUICustomBackendProps & TableCellProps
export type ContextfulMUIBoxProps = MUICustomBackendProps & BoxProps
export type ContextfulMUICheckboxProps = MUICustomBackendProps & CheckboxProps
export type ContextfulMUIDividerProps = MUICustomBackendProps & DividerProps
export type ContextfulMUIStackProps = MUICustomBackendProps & StackProps



export type MUIComponentProps = ContextfulMUIButtonProps | ContextfulMUITypographyProps | ContextfulMUITextFieldProps 
                    | ContextfulMUIButtonGroupProps | ContextfulMUILinkProps 
                    | ContextfulMUIPaperProps | ContextfulMUIFormControlProps 
                    | ContextfulMUIFormControlLabelProps | ContextfulMUIFormLabelProps 
                    | ContextfulMUIFormGroupProps | ContextfulMUIRadioGroupProps 
                    | ContextfulMUITableContainerProps | ContextfulMUITableProps 
                    | ContextfulMUITableHeadProps | ContextfulMUITableBodyProps 
                    | ContextfulMUITableRowProps | ContextfulMUITableCellProps   
                    | ContextfulMUIBoxProps | ContextfulMUICheckboxProps

export type AceEditorProps = {}

export type ContextfulRGLProps = Layout

export type GeneralComponentType = {
    [key : string] : any
}