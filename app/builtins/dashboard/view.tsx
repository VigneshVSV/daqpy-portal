'use client'
// Internal & 3rd party functional libraries
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { observer } from "mobx-react-lite"
// Custom functional libraries
import { StateManager } from "mobx-render-engine/state-manager"
import { ApplicationState } from "@/app/mobx/state-container"
import { createHololinkedPortalStateManager } from "../app-state"
// Internal & 3rd party component libraries
// Custom component libraries 
import { ErrorBackdrop, LoadingBackdrop } from "@/app/builtins/reuse-components"
import { DashboardUtility } from "./components"



export const DashboardView = observer(({globalState} : {globalState : ApplicationState}) => {
    
    const [stateManager, setStateManager] = useState<StateManager | null>(globalState.dashboardStateManager)
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()

    useEffect(() => { 
        const loadCurrentDashboardFromDB = async() => {
            let sm = stateManager
            if(!stateManager) {
                sm = await createHololinkedPortalStateManager('quick-dashboard-view', 'INFO', ErrorBackdrop as any,
                {
                    setGlobalLocation : router.push,
                    setLocation : router.push
                })
                // @ts-ignore
                await sm.load(globalState.dashboardURL? globalState.dashboardURL : 'last-used')
                console.log("re-rendering dashboard")
            }
            setStateManager(sm)
            setLoading(false)
        }
        loadCurrentDashboardFromDB()
    }, [stateManager, globalState.dashboardURL])    

    return (
        <div>
            { loading? 
                <LoadingBackdrop 
                    message="loading..." 
                    goBack={() => router.push('/')}
                /> : 
                stateManager ? 
                    <>
                        {stateManager.renderer.Component('__App__')}  
                        {/* <DashboardUtility
                            show={showUtilitySpeedDial} 
                            remoteObjects={remoteObjects}
                            actionDispatcher={renderer.stateManager.actionDispatcher} 
                            currentPage={null} // {renderer.stateManager._componentStateMap[children[0]]}
                        /> */}
                    </>  :
                    <ErrorBackdrop
                        message='internal error - dashboard state manager was not properly loaded, cannot display dashboard'
                        goBack={() => router.push('/')}
                    />
            } 
        </div>
    )
})



