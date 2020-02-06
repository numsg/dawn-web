
class TreeNode {
    id!: string;
    name!: string;
    pid!: string;
    pIds: string[] = [];
    dagNode: any;
    children: TreeNode[] = [];
}
export default TreeNode;
