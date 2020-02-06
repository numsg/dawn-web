export const menuManageUrl = {
    // 添加菜单
    addMenu: '/v3/clients/{0}/menus',
    // 查询菜单
    queryMenuNodes: '/v3/clients/{0}/menu_nodes',
    // 查询业务系统一级菜单（不包括子菜单）
    queryMenuRootNodes: '/v3/clients/{0}/menu_root_nodes',
    // 根据Id查询业务系统菜单（包括子菜单）
    queryMenuNodesById: '/v3/clients/{0}/menu_nodes/{1}',
    // 修改业务系统菜单
    updateMenuNode: '/v3/clients/{0}/menus/{1}',
    // 删除业务系统菜单（包括子菜单）
    deleteMenuNode: '/v3/clients/{0}/menus/{1}'
};

export default menuManageUrl;
