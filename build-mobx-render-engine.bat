call cd mobx-render-engine
@REM call npm run uninstall-node-modules
call npm run clean
@REM call npm install .
call npm run build 
call cd ..
call cd mui-mobx-render-engine 
@REM call npm run uninstall-node-modules
call npm run clean
@REM call npm install .
call npm run build 
call cd ..
call cd hololinked-dashboard-components
@REM call npm run uninstall-node-modules
call npm run clean
@REM call npm install .
call npm run build
call cd ..
call robocopy mobx-render-engine\\dist hololinked-portal\\node_modules\\@hololinked\\mobx-render-engine * /E
call robocopy mobx-mui-render-engine\\dist hololinked-portal\\node_modules\\@hololinked\\mui-render-engine * /E
call robocopy hololinked-dashboard-components\\dist hololinked-portal\\node_modules\\@hololinked\\dashboard-components * /E