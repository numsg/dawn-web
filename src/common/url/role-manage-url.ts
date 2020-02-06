export const roleManageUrl = {
  systemRoleListUrl: '/v3/clients/{clientidentifier}/roles',
  allAuthorityListUrl: '/v3/clients/{clientidentifier}/privilege-nodes',
  addRoleUrl: '/v3/clients/{clientidentifier}/roles',
  deleteRolesUrl: '/v3/clients/{clientidentifier}/roles/delete',
  deleteRoleUrl: '/v3/clients/{clientidentifier}/roles/{code}',
  codeReferRoleDetailUrl: '/v3/clients/{clientidentifier}/roles/{code}',
  modificationRoleDetailUrl: '/v3/clients/{clientidentifier}/roles/{code}',
  codeReferRolePrivilegesUrl: '/v3/clients/{clientidentifier}/roles/{code}/privileges',

  roleManageUrl: '/v3/clients/{clientidentifier}',

  rolePris: '/v1/clients/{clientIdentifier}/roles/{code}/privileges',
  roleMenus: '/v3/clients/{clientidentifier}/roles/{code}/menu_nodes',
  codeRolePris: '/v3/clients/{clientidentifier}/roles/{code}/privileges'
};
