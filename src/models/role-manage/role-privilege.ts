
/**
 * 角色下的权限和权限本身公用
 *
 * @export
 * @class RolePrivilege
 */
export default class RolePrivilege {
    public id: string = '';
    public name: string = '';
    public expression: string = '';
    public description: string = '';
    public parentId: string = '';
    public code: string = '';
    public children: Array<any> = [];
    public hasChildren: boolean = false;
    public choose?: boolean = false; // 用于匹配角色下权限的默认勾选
}


