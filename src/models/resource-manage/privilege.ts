
export class Privilege {
    id: string = ''; // id(UUID,长度36)
    parentId?: string = ''; // 父节点Id（UUID,长度36）,值为null或时默认无父节点
    code?: string = ''; // 编码（长度1-36，允许英文、数字和下划线,且不允许下划线开头或结尾）
    children: Array<Privilege> = []; // 子节点
    name: string = ''; // 名称（长度1-128）
    expression?: string = ''; // 规则（长度1-1024）
    hasChildren?: boolean = false; // 是否有子节点
    description?: string = ''; // 描述（长度0-4000）
    createTime = Date.now();  // 创建时间（与1970年1月1日00:00:00之间间隔的毫秒数，最大值：9089348832000000）
    creatorId?: string = ''; // 创建用户Id(UUID，长度36) ,
    creatorUserName: string = ''; // 创建用户（长度1-128，允许英文、数字、点和下划线,且不允许点或下划线开头或结尾）
    updateTime = Date.now(); // 更新时间（与1970年1月1日00:00:00之间间隔的毫秒数，最大值：9089348832000000）
    updatorId?: string = ''; // 更新用户id(UUID，长度36) ,
    updatorUserName?: string = ''; // 更新用户（长度1-128，允许英文、数字、点和下划线,且不允许点或下划线开头或结尾）
    defaultPri: boolean = false;
}

export default Privilege;
