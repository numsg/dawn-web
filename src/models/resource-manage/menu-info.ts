
export class MenuInfo {
    id: string = ''; // id(UUID,长度36)
    code?: string = ''; // 编码（长度1-36，允许英文、数字和下划线,且不允许下划线开头或结尾）
    children = []; // 子菜单
    name?: string = ''; // 名称（长度1-128）
    expression?: string = ''; // 规则（长度1-1024）
    hasChildren?: boolean = false; // 是否有子菜单
    description?: string = ''; // 描述（长度0-4000）
    parentId?: string = ''; // 父菜单id（UUID，长度36，值为null或“”时默认无父菜单）
    menuOrder: number = 0; // 菜单排序（范围0-99）,按升序排列
    title?: string = ''; // 显示标题（长度0-128）
    icon?: string = ''; // 图标（长度0-4000）
    visible: boolean = false; // 是否可见。设置为不可见时，该节点的子节点也变更为不可见
    leaf: boolean = false; // 是否叶子节点
    defaultMenu: boolean = false;
}

export default MenuInfo;
