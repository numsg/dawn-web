class AppendixContact {
  id: string = '';
  name: string = '';
  planId: string = '';
  cellId: string = '';
  outlineId: string = ''; // 附录大纲节点id
  orgNodeId: string = ''; // 组织节点大纲id
  organization: any[] = []; // 组织机构
  organizationStr: string = '';
  contacts: any[] = []; // 通讯录名单
  contactsStr: string = ''; // 通讯录名单
}

export default AppendixContact;
