export const privilegeManageUrl = {
    // 添加权限点
    addprivilege: '/v3/clients/{0}/privileges',
    // 查询业务系统权限点
    queryAllPrivilegeNodes: '/v3/clients/{0}/privilege-nodes',
    // 查询业务系统根权限点（不包括子权限点）
    queryPrivilegeRootNodes: '/v3/clients/{0}/privilege-root-nodes',
    // 根据Id查询业务系统权限点（包括子权限点）
    queryPrivilegeNodeById: '/v3/clients/{0}/privilege-nodes/{1}',
    // 根据父权限点id查询子权限点(包括下级权限点)
    queryPrivilegeChildNodesByPid: '/v3/clients/{0}/privilege-nodes/{1}/children',
    // 批量删除业务系统权限点（包括子权限点）
    deletePrivileges: '/v3/clients/{0}/privileges/delete',
    // 删除业务系统权限点（包括子权限点）
    deletePrivilegeById: '/v3/clients/{0}/privileges/{1}',
    // 修改业务系统权限点信息
    updatePrivilege: '/v3/clients/{0}/privileges/{1}'
};

export default privilegeManageUrl;
