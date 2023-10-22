// Internal & 3rd party functional libraries
import { useEffect } from "react"
import { useLocation } from "wouter"
import { observer } from "mobx-react-lite"
// Custom functional libraries
// Internal & 3rd party component libraries
// Custom component libraries
import { RenderEngineComponentProps } from "../mobx/render-engine"
import { ErrorBackdrop } from "../builtins/reuse-components"
import { DashboardUtility } from "../builtins/dashboard-components"



export const ContextfulApp = observer(({state, renderer, logger} : RenderEngineComponentProps) => {

    const [location, setLocation] = useLocation()

    useEffect(() => {
        renderer.stateManager.actionDispatcher.hooks["setLocation"] = setLocation
    }, [setLocation])
 
    const { showUtilitySpeedDial, remoteObjects } = state.computedProps as any
    const children = state.computedChildren
    logger.logMounting('ContextfulApp', 'App')
    try{
        return (
            <>  
                {renderer.Children(children)}
                <DashboardUtility
                    show={showUtilitySpeedDial} 
                    remoteObjects={remoteObjects}
                    actionDispatcher={renderer.stateManager.actionDispatcher} 
                    currentPage={null} // {renderer.stateManager._componentStateMap[children[0]]}
                />
            </>
            )
    } catch(error : any) {
        return (
            <ErrorBackdrop
                message="dashboard could not render due to error : "
                subMessage={error.message}
                goBack={() => renderer.stateManager.actionDispatcher.hooks["setGlobalLocation"]('/')}
            />
        )
    }
})