import { useEffect, useState } from "react"
import { StateManager } from "../mobx/state-manager"
import { ErrorBackdrop, LoadingBackdrop } from "./reuse-components"
import { createStateManager } from "./component-registration"


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
            { loading? <LoadingBackdrop 
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




