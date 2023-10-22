import { RenderEngine } from "../mobx/render-engine";
import { ComponentStateMap } from "../mobx/state-container";
import { ComponentOutputMap } from "../mobx/stub-evaluator";
import { Logger, loglevels } from "../utils/logger";
import { StateManager } from "../mobx/state-manager";
import { RemoteFSMMap } from "../mobx/state-machine";

import { ContextfulPage } from "../components/page";
import { ContextfulRGL } from "../components/react-grid-layouts";
import { ContextfulMUIButton, ContextfulMUIhRefButton } from "../components/mui/Button";
import { ContextfulMUITextField } from "../components/mui/TextField";
import { ContextfulPlotlyGraph } from "../components/plotly-graph";
import { ContextfulSSEVideo } from "../components/video";
import { ContextfulApp } from "../components/app";
import { ContextfulAceEditor } from "../components/ace-editor";
import { ContextfulMUIBox } from "../components/mui/Box";
import { ContextfulMUIDivider } from "../components/mui/Divider";
import { ContextfulMUIStack } from "../components/mui/Stack";
import { ContextfulMUIButtonGroup } from "../components/mui/ButtonGroup";
import { ContextfulMUIRadio, ContextfulMUIRadioGroup } from "../components/mui/Radio";
import { ContextfulMUIFormControlLabel } from "../components/mui/FormControlLabel";





export function prepareRenderers(renderers : RenderEngine[]) {
    for (let renderer of renderers){
        // MUI components
        renderer.registerComponent("ContextfulMUIButton", ContextfulMUIButton)
        renderer.registerComponent("ContextfulMUIhRefButton", ContextfulMUIhRefButton)
        renderer.registerComponent("ContextfulMUIStack", ContextfulMUIStack)
        renderer.registerComponent("ContextfulMUIBox", ContextfulMUIBox)
        renderer.registerComponent("ContextfulMUITextField", ContextfulMUITextField)
        renderer.registerComponent("ContextfulMUIDivider", ContextfulMUIDivider)
        renderer.registerComponent("ContextfulMUIButtonGroup", ContextfulMUIButtonGroup)
        renderer.registerComponent("ContextfulMUIRadioGroup", ContextfulMUIRadioGroup)
        renderer.registerComponent("ContextfulMUIRadio", ContextfulMUIRadio)
        renderer.registerComponent("ContextfulMUIFormControlLabel", ContextfulMUIFormControlLabel)

        // other libraries
        renderer.registerComponent("ContextfulPage", ContextfulPage)
        renderer.registerComponent("ContextfulRGL", ContextfulRGL)
        renderer.registerComponent("ContextfulPlotlyGraph", ContextfulPlotlyGraph)
        renderer.registerComponent("ContextfulSSEVideo", ContextfulSSEVideo)
        renderer.registerComponent("ContextfulAceEditor", ContextfulAceEditor)
        // App
        renderer.registerComponent("__App__", ContextfulApp)
    }
}

export function createStateManager(id : string, logLevel : string = 'DEBUG', hooks : any = {}) : StateManager {
    const visualizationComponentStateMap : ComponentStateMap = {}
    const visualizationComponentOutputMap : ComponentOutputMap = {}
    const visualizationRemoteFSMMap : RemoteFSMMap = {}
    const visualizationLogger = new Logger(`${id}-logger`, logLevel as loglevels)
    const visualizationStateManager = new StateManager(
        id, 
        visualizationLogger, 
        visualizationComponentStateMap, 
        visualizationComponentOutputMap, 
        visualizationRemoteFSMMap,
        hooks
    )
    prepareRenderers([visualizationStateManager.Renderer])
    return visualizationStateManager
}