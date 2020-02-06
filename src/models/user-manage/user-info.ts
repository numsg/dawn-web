
import { Gender } from '@/common/enums/gender';
import { Status } from '@/common/enums/status';
import Role from '../role-manage/role';

export class UserInfo {
    id?: string = ''; // id(UUID;长度36)
    userName: string = ''; // 用户名（长度1-128，允许英文、数字、点和下划线;且不允许点或下划线开头或结尾）
    password?: string = ''; // 密码（长度0-256，不填写时默认密码为123456）
    name?: string = ''; // 姓名（长度0-128）
    gender?: Gender = Gender.MALE; // 性别：0：未知；1：男；2：女
    birthday = Date.now(); // 生日（与1970年1月1日00:00:00之间间隔的毫秒数;范围-62167420800000-9089348832000000）
    phone?: string = ''; // 电话(长度0-36)
    email?: string = ''; // 邮箱（长度0-256;用户名（@符号前的部分）长度不超过64;服务器名（@符号后的部分）长度不超过255）;如：xxx@gsafety.com
    address?: string = ''; // 地址（长度0-512）
    image?: string = ''; // 头像（长度0-204800）
    description?: string = ''; // 描述（长度0-4000）
    firstName?: string = ''; // 名字（长度0-512）
    middleName?: string = ''; // 中间名（长度0-512）
    lastName?: string = ''; // 姓氏（长度0-512）
    status?: Status = Status.NORMAL; // 状态：0：正常；1：不可用
    createTime?: string = ''; // 创建时间（与1970年1月1日00:00:00之间间隔的毫秒数，最大值：9089348832000000）
    creatorUserName?: string = '';
    creatorId?: string = '';
    updateTime?: string = ''; // 新时间（与1970年1月1日00:00:00之间间隔的毫秒数，最大值：9089348832000000）
    updatorUserName?: string = ''; // 更新用户（长度1-128，允许英文、数字、点和下划线;且不允许点或下划线开头或结尾）
    updatorId?: string = ''; // 更新用户id(UUID，长度36)
    roles: Role[] = []; // 角色集合
    authority?: string = '';
}
export default UserInfo;
