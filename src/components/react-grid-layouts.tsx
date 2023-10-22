// Internal & 3rd party functional libraries
import { observer } from 'mobx-react-lite';
// custom functional libraries
// MUI component libraries
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout';
import { ComponentState } from 'react';
import { RenderEngineComponentProps } from '../mobx/render-engine';
//custom component libraries


const ResponsiveGridLayout = WidthProvider(Responsive);

export const ContextfulResponsiveRGL = observer(({ state, renderer, logger } : RenderEngineComponentProps ) => {

    logger.logMounting("ContextfulResponsiveRGL", state.id)
    return (
            <ResponsiveGridLayout
                compactType      = {null} //something to do with compaction which we dont want because we specify all positions of objects by ourselves
                preventCollision = {true}
                // className = "layout"
                // breakpoints = {{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                // cols        = {{ lg: 300, md: 300, sm: 300, xs: 300, xxs: 300 }}
                // cols = {300}
                autoSize    = {true}
                rowHeight   = {1}   
                // onLayoutChange={(layout) => console.log(layout)}
                // width={1200}
            >    
                {state.computedChildren.map((child : string) => {
                    let childState : ComponentState = renderer.componentStateMap[child]
                    // console.log("new data grid", childState.metadata.RGLDataGrid)
                    return (
                        <div
                            key={childState.tree}        
                            data-grid={childState.metadata.RGLDataGrid}               
                        >
                            {renderer.Component(childState.id)}
                        </div>
                        )    
                    })
                } 
            </ResponsiveGridLayout>
        )
    }
)



export const ContextfulRGL = (({ state, renderer, logger } : RenderEngineComponentProps ) => {

    const { width, autoSize, cols, draggableCancel, draggableHandle, compactType, layout, margin, 
        isDraggable, isResizable, isBounded, preventCollision, containerPadding, rowHeight, useCSSTransforms,
        transformScale, resizeHandles, resizeHandle } = state.computedProps as any

    logger.logMounting("ContextfulRGL", state.id)
    return (
            <GridLayout
                width={width}
                autoSize={autoSize}
                cols={cols}
                draggableCancel={draggableCancel}
                isDraggable={isDraggable}
                draggableHandle={draggableHandle}
                layout={layout}
                margin={margin}
                isResizable={isResizable}
                isBounded={isBounded}
                compactType={compactType} 
                preventCollision={preventCollision}
                containerPadding={containerPadding}
                rowHeight={rowHeight}
                useCSSTransforms={useCSSTransforms}
                transformScale={transformScale}
                resizeHandles={resizeHandles}
                resizeHandle={resizeHandle}
            >    
                {state.computedChildren.map((child : string) => {
                    let childState : ComponentState = renderer.componentStateMap[child]
                    // console.log("new data grid", childState.metadata.RGLDataGrid)
                    return (
                        <div
                            key={childState.tree}        
                            data-grid={childState.metadata.RGLDataGrid}               
                        >
                            {renderer.Component(childState.id)}
                        </div>
                        )    
                    })
                } 
            </GridLayout>
        )
    }
)












