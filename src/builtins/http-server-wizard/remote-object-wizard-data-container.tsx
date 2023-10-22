


export class ScriptImporterData {
    useExistingRemoteObject : boolean 
    className : string 
    script : string 
    useExistingEventloop : boolean 
    eventloopInstanceName : string 

    constructor(info : any) {
        this.script = info.script
        this.className = info.className
        this.useExistingRemoteObject = info.useExistingRemoteObject 
        this.useExistingEventloop = info.useExistingEventloop 
        this.eventloopInstanceName = info.eventloopInstanceName
    }
}


export class remoteObjectWizardData {
    id : string 
    scriptImporterData : ScriptImporterData
    successfulSteps : Array<boolean>

    constructor(info : any) {
        this.id = info.id 
        this.scriptImporterData = info.scriptImporterData
        this.successfulSteps = info.successfulSteps
    }
}