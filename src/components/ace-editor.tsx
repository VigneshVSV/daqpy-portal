// Internal & 3rd party functional libraries
import { observer } from "mobx-react-lite";
// Custom functional libraries
// Internal & 3rd party component libraries
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-crimson_editor"
import "ace-builds/src-noconflict/ext-language_tools";
// Custom component libraries
import { RenderEngineComponentProps } from "../mobx/render-engine";
import { GeneralComponentType } from "../mobx/component-types";


export const ContextfulAceEditor = observer(({state, renderer, logger} : RenderEngineComponentProps) => {

    const id = state.id
    const { name, placeholder, mode, theme, value, defaultValue, height, width, className,  
                fontSize, showGutter, showPrintMargin, highlightActiveLine, focus, cursorStart, 
                wrapEnabled, readOnly, minLines, maxLines, enableBasicAutocompletion, 
                enableLiveAutocompletion, enableSnippets, tabSize, debounceChangePeriod, onLoad,
                onBeforeLoad, onChange, editorProps, setOptions, keyboardHandler, commands, annotations,
                markers, style } = state.computedProps as GeneralComponentType
    
    logger.logMounting('ContextfulAceEditor', id)

    return (
            <AceEditor
                name={id}
                placeholder={placeholder}
                mode={mode}
                theme={theme}
                value={value}
                defaultValue={defaultValue}
                height={height} 
                width={width}
                className={className}
                fontSize={fontSize}
                showGutter={showGutter}
                showPrintMargin={showPrintMargin}
                highlightActiveLine={highlightActiveLine}
                focus={focus}
                cursorStart={cursorStart}
                wrapEnabled={wrapEnabled}
                readOnly={readOnly}
                minLines={minLines}
                maxLines={maxLines}
                enableBasicAutocompletion={enableBasicAutocompletion}
                enableLiveAutocompletion={enableLiveAutocompletion}
                enableSnippets={enableSnippets}
                tabSize={tabSize}
                debounceChangePeriod={debounceChangePeriod}
                onLoad={onLoad}
                onBeforeLoad={onBeforeLoad}
                onChange={onChange}
                // These props are generally client side
                // onCopy
                // onPaste
                // onSelectionChange
                // onCursorChange
                // onFocus	
                // onBlur
                // onInput
                // onScroll
                // onValidate
                editorProps={editorProps}
                setOptions={setOptions}
                keyboardHandler={keyboardHandler}
                commands={commands}
                annotations={annotations}
                markers={markers}
                style={style}
            />
       
    )
})
