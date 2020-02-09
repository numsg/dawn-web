export const userManageUrl = {
    // 添加用户
    addUser: '/v3/users',
    // 查询非管理员用户
    queryNotClientManager: '/v3/users/not_client_manager',
    // 根据用户名查询用户信息
    queryUserInfoByUname: '/v3/clients/{0}/users/{1}/info',
    // queryUserInfoByUname: '/v3/users/{0}/user',
    // 根据用户名查询用户信息
    queryUserInfoByUnamePer: '/v3/clients/{0}/user-info',
    // 修改用户信息
    updateOrDeleteUser: '/v3/users/{0}',
    // 为用户批量关联业务系统
    relateToSystem: '/v3/users/{0}/clients/batch',
    // 为用户配置业务系统角色
    addRolesForUser: '/v3/clients/{0}/users/{1}/role',
    // 重置用户密码
    resetPassword: '/v3/users/{0}/reset_password',
    // 用户修改密码
    changePassword: '/v3/user/password',
    // 用户退出
    logoutUser: '/v3/logout',
    // 强制退出
    forcedLogoutUser: '/v3/users/{0}/logout',
    clientUsers: '/v3/clients/{0}/users/search',
    // 根据角色获取用户信息
    getUserByRole: '/v3/clients/{0}/roles/{1}/users '
};

export default userManageUrl;
