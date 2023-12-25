// Internal & 3rd party functional libraries
import { makeObservable, observable, action, computed, override } from 'mobx';
import axios, { AxiosResponse } from 'axios';
// custom functional libraries
import { asyncRequest } from 'mobx-render-engine/utils/http';
import { ScriptImporterData, remoteObjectWizardData } from '../builtins/http-server-wizard/remote-object-wizard-data-container';
import { ComponentState } from 'mobx-render-engine/state-container';
// Internal & 3rd party component libraries
// Custom component libraries



export type ApplicationData = {
    loggedIn? : boolean  
    loginFooter? : string
    footerLink?  : string
    hostServer? : string 
}

export type ApplicationSettings = {
    dashboards : {
        deleteWithoutAsking : boolean 
        showRecentlyUsed : boolean 
    }
    login : {
        footer : string
        footerLink  : string
        show : boolean
    }
    servers : {
        allowHTTP : boolean
    } 
    remoteObjectViewer : {
        Console : {
            stringifyOutput : boolean 
            defaultMaxEntries : number 
            defaultWindowSize : number
            defaultFontSize : number
        }
    }
}

export class PythonServer {
    hostname : string 
    IPAddress : string 
    port : number     
    type : string 
    qualifiedIP : string
    https : boolean 
    _remoteObjectInfo : Array<{
        instance_name : string
        class_name : string, 
        script : string
    }>
    remoteObjectState : any

    constructor(info : any) {
        this.hostname = info.hostname 
        this.IPAddress = info.IPAddress 
        this.port = info.port 
        this.type = info.type 
        this.https = info.https
        this.qualifiedIP = info.qualifiedIP 
        this._remoteObjectInfo = info.remoteObjectInfo
        this.remoteObjectState = info.remoteObjectState
    }

    get remote_objects() {
        if(this._remoteObjectInfo)
            return this._remoteObjectInfo.map((info) => {return info.instance_name})
        return []
    }

    get remoteObjectInfo () {
        // if(this._remoteObjectInfo)
        //     return this._remoteObjectInfo.reduce((totalInfo : any, currentInfo) => {
        //             totalInfo[currentInfo.instance_name] = currentInfo
        //             return totalInfo}, {}) 
        return this._remoteObjectInfo
    }

    get remote_object_classes() {
        if(this._remoteObjectInfo)
            return this._remoteObjectInfo.filter((info) => (info.class_name !== 'EventLoop' && info.class_name !== 'HTTPServerUtilities'))
        return []
    }

    get eventloops() {
        if(this._remoteObjectInfo)
            return this._remoteObjectInfo.filter((info) => info.class_name === 'EventLoop').map((info) => {return info.instance_name})
        return []
    }

}

const PRIMARY_HOST = 'PRIMARY_HOST'

export class ApplicationState {

    loggedIn : boolean
    appsettings : any
    primaryHostServer : PythonServer | null 
    additionalHostServers : string[]
    servers  : Array<PythonServer>
    HTTPServerWizardData: { remoteObjectWizardData: remoteObjectWizardData; };

    constructor(appData : ApplicationData) {
        makeObservable(this, {
                loggedIn    : observable,
                appsettings : observable,
                setPrimaryHostServer : action,
                updateSettings : action,
                login       : action,
                logout      : action
            }
        )
      
        this.loggedIn    = false
        this.primaryHostServer = null
        this.additionalHostServers = []
        this.appsettings = {
            dashboardsDeleteWithoutAsking : true,
            dashboardsShowRecentlyUsed : true,
            loginFooter : '',
            loginFooterLink : '',
            loginDisplayFooter : true,
            serversAllowHTTP : true,
            remoteObjectViewerConsoleStringifyOutput : false,
            remoteObjectViewerConsoleDefaultMaxEntries : 10,
            remoteObjectViewerConsoleDefaultWindowSize : 500,
            remoteObjectViewerConsoleDefaultFontSize : 16,
            // stringifyConsoleOutput : false 
        }
        this.servers = []
        this.HTTPServerWizardData = {
            remoteObjectWizardData : new remoteObjectWizardData(
                            { id : null, 
                            scriptImporterData : new ScriptImporterData({
                                useExistingRemoteObject : false,
                                className : '',
                                script : '', 
                                useExistingEventloop : false, 
                                eventloopInstanceName : '' 
                            }
                            ), 
                            successfulSteps : [false, false, false] 
                        }
                        )
        }
    }

    login() {
        this.loggedIn = true
    }

    logout() {
        this.loggedIn = false
    }

    async updateSettings(field : string, value : any) {
        const response = await asyncRequest({
            url : 'dashboard-util/app/settings/edit', 
            method : 'post',
            baseURL : (this.primaryHostServer as PythonServer).qualifiedIP,
            data : {
                field : field, 
                value : value
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }) as AxiosResponse
        // console.log(response)
        if(response.status === 200) {
            // @ts-ignore
            this.appsettings[field] = value
        }
        // console.log(this.appsettings)
    }

    async setPrimaryHostServer(serverURL : string) {
        await Promise.all([axios({
            url : 'dashboard-util/app/info/all', 
            method : 'get',
            baseURL : serverURL,
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }), axios({
            url : 'server-util/subscribers', 
            method : 'get',
            baseURL : serverURL,
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })]).then((responses) => {
            // console.log(responses)
            // debugger
            for(let response of responses) {
                if(response.status === 202 || response.status === 200 ) {
                    if(response.data.returnValue.appsettings) 
                        this.appsettings = response.data.returnValue.appsettings
                    if(response.data.returnValue.servers) {
                        for(let server of response.data.returnValue.servers) {
                            let found = false
                            for(let serv of this.servers){
                                if(serv.qualifiedIP === server.qualifiedIP)
                                    found = true
                            }
                            if(!found) {
                                if(!this.servers.includes(server))
                                    this.servers.push(new PythonServer(server))
                            }
                            if(server.type === PRIMARY_HOST)
                                this.primaryHostServer = new PythonServer(server)
                        }
                    }
                    if(response.data.returnValue.subscribers) {
                        for(let server of response.data.returnValue.subscribers) {
                            let found = false
                            for(let serv of this.servers){
                                if(serv.qualifiedIP === server.qualifiedIP)
                                    found = true
                            }
                            if(!found) {
                                if(!this.servers.includes(server))
                                    this.servers.push(new PythonServer(server))
                            }
                            if(server.type === PRIMARY_HOST && !this.primaryHostServer)
                                this.primaryHostServer = new PythonServer(server)
                        }
                    }
                }
            }
        })
        
        // console.log(this.servers)
        // console.log(this.primaryHostServer)
        // console.log(this.appsettings)
    }

    async fetchServerData () {
        debugger
        await Promise.all(this.servers.map((server : PythonServer) => {
            return axios({
                url : 'server-util/info/all', 
                method : 'get',
                baseURL : getFullDomain(server),
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            })            
        })).then((responses) => {
            for(let i=0; i < responses.length; i++){
                let response = responses[i]
                let server = this.servers[i]
                if(response.status === 200 || response.status === 202) {
                    server._remoteObjectInfo = response.data.returnValue.remoteObjectInfo
                    server.remoteObjectState = response.data.returnValue.remoteObjectState
                }
            }
        }).catch((error) => 
            console.log(error)
        )
    }

    get slashSegregatedRemoteObjects() : object {
        let tree : object = {}
        let all_remote_objects = this.servers.map((server) => {
            let ro = []
            for(let ro_info of server.remoteObjectInfo)
                ro.push(ro_info.instance_name)
            return ro}).flat()
        for(let RO of all_remote_objects){
            let currentLevel = tree
            let qualifiedName = RO.split('/')
            qualifiedName.forEach((key : string, index : number) => {
                if (index === qualifiedName.length - 1) {
                    // @ts-ignore
                    currentLevel[key] = RO;
                } else {
                    // @ts-ignore
                    currentLevel[key as any] = currentLevel[key] || {};
                    // @ts-ignore
                    currentLevel = currentLevel[key];
                }
            })
        }
        return tree 
    }
}



export type ComponentStateMap = {
    [key : string] : ComponentState //| HttpButtonState | ReactResponsiveGridState 
}


export function getFullDomain(server : PythonServer) {
    return server.https? "https://" + server.qualifiedIP : "http://" + server.qualifiedIP
}