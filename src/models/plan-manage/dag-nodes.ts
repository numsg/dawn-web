
class DagNodes {
    id!: string;
    cell_id!: string;
    plan_id!: string;
    task_id!: string;
    field!: string;
    tree_node_id!: string;
    name!: string;
    in_ports!: any[];
    out_ports!: any[];
    pos_x!: number;
    pos_y!: number;
    level!: number;
}

export default DagNodes;
