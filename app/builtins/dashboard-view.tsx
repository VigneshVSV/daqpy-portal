// Internal & 3rd party functional libraries
import { useEffect, useState } from "react"
// Custom functional libraries
import { StateManager } from "mobx-render-engine/state-manager"
import { createStateManager } from "mui-mobx-render-engine/component-registration"
// Internal & 3rd party component libraries
// Custom component libraries 
import { ErrorBackdrop, LoadingBackdrop } from "./reuse-components"



export const DashboardView = ({ givenStateManager, setGlobalLocation, dashboardURL } : { givenStateManager : StateManager | null, 
                                    setGlobalLocation : any, dashboardURL : string }) => {

    const [stateManager, setStateManager] = useState<StateManager | null>(givenStateManager? givenStateManager : null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => { 
        const loadCurrentDashboardFromDB = async() => {
            let sm = stateManager
            if(!stateManager) {
                sm = createStateManager('quick-dashboard-view', 'INFO', {
                    setGlobalLocation : setGlobalLocation,
                    setLocation : setGlobalLocation
                })
                // @ts-ignore
                await sm.load(dashboardURL? dashboardURL : 'last-used')
                console.log("re-rendering dashboard")
            }
            setStateManager(sm)
            setLoading(false)
        }
        loadCurrentDashboardFromDB()
    }, [stateManager, dashboardURL])    

    return (
        <div>
            { loading? 
                <LoadingBackdrop 
                    message="loading..." 
                    goBack={() => setGlobalLocation('/')}
                /> : 
                stateManager ? stateManager.renderer.Component('__App__') : 
                <ErrorBackdrop
                    message='internal error - dashboard state manager was not properly loaded, cannot display dashboard'
                    goBack={() => setGlobalLocation('/')}
                />
            } 
        </div>
    )
}




