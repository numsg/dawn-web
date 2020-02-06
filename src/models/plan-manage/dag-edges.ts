

class DagEdges {
    id!: string;
    plan_id!: string;
    dst_input_idx!: number;
    dst_node_id!: string;
    src_output_idx!: number;
    src_node_id!: string;
    type!: string;
}

export default DagEdges;
