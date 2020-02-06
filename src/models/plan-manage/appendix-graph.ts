import DagEdges from './dag-edges';
import DagNodes from './dag-nodes';

class AppendixGraph {
    id: string = ''; // id
    outlineId: string = ''; // 大纲节点id
    planId: string = ''; // 预案id
    taskNodeId: string = ''; // 任务节点id
    name: string = ''; // 流程图名称
    dagEdges: DagEdges[] = [];
    dagNodes: DagNodes[] = [];
    dagEdgesStr: string = '';
    dagNodesStr: string = '';
    svgScale: number = 1;
    svgLeft: number = 0;
    svgTop: number = 0;
    svgMoveLeft: number = 0;
    svgMoveTop: number = 0;
    image?: string = '';
}
export default AppendixGraph;

