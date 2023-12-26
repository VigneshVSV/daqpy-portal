'use client'
import dynamic from 'next/dynamic'
import { Logger } from "mobx-render-engine/utils/logger";
import { ApplicationState } from "../mobx/state-container";

export const globalAppState = new ApplicationState({})

export const RootLogger = new Logger('root', "DEBUG")

export type AppState = {
    globalState : ApplicationState
}

export async function createHololinkedPortalStateManager(id : string, logLevel : string = 'DEBUG', errorBoundary : React.ReactElement, hooks : any = {}) {
    const prepareRenderersForBaseComponents = (await import("mobx-render-engine/component-registration")).prepareRenderers;
    const prepareRenderersForMUI = (await import("mui-mobx-render-engine/component-registration")).prepareRenderers;
    const prepareRenderersForPortalComponents = (await import("hololinked-dashboard-components/component-registration")).prepareRenderers;
    const createStateManager = (await import("mobx-render-engine/state-manager")).createStateManager 
    let stateManager = createStateManager(id, logLevel, errorBoundary, hooks)
    prepareRenderersForBaseComponents([stateManager.renderer])
    prepareRenderersForMUI([stateManager.renderer])
    prepareRenderersForPortalComponents([stateManager.renderer])
    return stateManager
} 

