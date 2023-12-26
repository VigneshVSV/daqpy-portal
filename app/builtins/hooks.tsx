'use client'
// Internal & 3rd party functional libraries
import  { useState, useCallback, useEffect, MutableRefObject } from "react";
// Custom functional libraries
import { asyncRequest } from "mobx-render-engine/utils/http";
import { StateManager } from "mobx-render-engine/state-manager";
import { fetchFieldFromLocalStorage } from "mobx-render-engine/utils/misc";
// Internal & 3rd party component libraries
// Custom component libraries 



export const useDashboard = (dashboardURL : string, dashboardStateManager : MutableRefObject<StateManager | null>) : [
        loading : boolean, 
        fetchData : () => Promise<boolean>,
        errorMessage : string, 
        errorTraceback : string[],
    ] => {

    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [errorTraceback, setErrorTraceback] = useState<string[]>([]) 

    const fetchData = useCallback(async() => {
        let errMsg = '', errTb = []
        setLoading(true)
        const response : any = await asyncRequest({
            url : dashboardURL,
            method : 'get'
        })
        if (!dashboardStateManager.current){
            errMsg = 'Internal error - dashboard state manager not created. Use setDashboardStateManager hook before calling fetchData'
        }
        else if(response.status === 200) {
            try {
                dashboardStateManager.current.deleteComponents()
                dashboardStateManager.current.deleteActions()
                dashboardStateManager.current.store(
                    dashboardURL,
                    response.data.returnValue.UIcomponents, 
                    response.data.returnValue.actions
                )
                dashboardStateManager.current.updateActions(response.data.returnValue.actions)
                dashboardStateManager.current.updateComponents(response.data.returnValue.UIcomponents)
            } catch (error) {
                errMsg = "Failed to load view - " + error   
                // dashboardStateManager.current.logger.logErrorMessage("IconButton", "quick-view", error as string)      
            }
        }
        else if(response.data && response.data.exception) {
            errMsg = response.data.exception.message
            errTb = response.data.exception.traceback
        }
        else {
            console.log("dashboard fetch failed - ", response)
            let reason = response.status ? `resonse status code - ${response.status}` : 'invalid response after request - is the address correct?'
            errMsg = `Failed to fetch JSON - ${reason}`
            dashboardStateManager.current.logger.logErrorMessage("IconButton", "quick-view", reason)  
        }
        setLoading(false)
        setErrorMessage(errMsg)
        setErrorTraceback(errTb)
        if(response.status && response.status === 200 && !errMsg)
            return true 
        return false
    }, [dashboardURL])

    return [loading,  fetchData, errorMessage, errorTraceback]
}



export const useAutoCompleteOptionsFromLocalStorage = (field : string) => {
    const [existingData, setExistingData] = useState<{[key : string] : any}>({})
    if(!existingData[field])
        existingData[field] = [] // no need to re-render - it will correct at first iteration

    useEffect(() => {
        let data = fetchFieldFromLocalStorage(null, {})
        if(!data[field])
            data[field] = []
        setExistingData(data)
    }, [])

    const modifyOptions = useCallback((entry : string, operation : 'ADD' | 'DELETE') => {
        if(operation === 'ADD') {
            if(!existingData[field].includes(entry)) 
                existingData[field].push(entry)
        }
        else {
            if(existingData[field].includes(entry)) {
                existingData[field].splice(existingData[field].indexOf(entry), 1)
            }
        }
        setExistingData(existingData)
        localStorage.setItem('daqpy-webdashboard', JSON.stringify(existingData))
    }, [existingData])
    return [existingData[field], modifyOptions]
}   



// https://github.com/CharlesStover/use-force-update
const createNewObject = (): Record<string, never> => ({});

export function useForceUpdate(): [Record<string, never>, VoidFunction] {
    const [useEffectDummyDependent, setValue] = useState<Record<string, never>>(createNewObject());

    return [useEffectDummyDependent, useCallback((): void => {
        setValue(createNewObject());
    }, [])]
}