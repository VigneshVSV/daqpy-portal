import { Logger } from "@hololinked/mobx-render-engine/utils/logger";
import { ApplicationState } from "../mobx/state-container";
import { prepareRenderers as prepareRenderersForBaseComponents } from "@hololinked/mobx-render-engine/component-registration";
import { prepareRenderers as prepareRenderersForMUI } from "@hololinked/mui-render-engine/component-registration";
import { prepareRenderers as prepareRenderersForPortalComponents } from "@hololinked/dashboard-components/component-registration";
import { createStateManager } from "@hololinked/mobx-render-engine/state-manager" 

export const globalAppState = new ApplicationState()

export const RootLogger = new Logger('root', "DEBUG")

export type AppState = {
    globalState : ApplicationState
}

export function createHololinkedPortalStateManager(id : string, logLevel : string = 'DEBUG', errorBoundary : React.ReactElement, hooks : any = {}) {
    let stateManager = createStateManager(id, logLevel, errorBoundary, hooks)
    prepareRenderersForBaseComponents([stateManager.renderer])
    prepareRenderersForMUI([stateManager.renderer])
    prepareRenderersForPortalComponents([stateManager.renderer])
    return stateManager
} 

