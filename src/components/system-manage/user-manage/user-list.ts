
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './user-list.html';
import Styles from './user-list.mudule.scss';
import UserInfo from '@/models/user-manage/user-info';
import userManageService from '@/api/user-manage/user-manage.service';

@Component({
    template: Html,
    style: Styles,
    components: {

    }
})
export class UserListComponent extends Vue {

    // 选中的用户
    selectedUser: UserInfo = new UserInfo();

    // 用户列表
    userList: Array<UserInfo> = new Array<UserInfo>();

    sysUserAvatar: any = require('@/assets/img/useravatar.png');

    // 搜索值
    searchValue: string = '';

    // 当前用户名
    currentUserName: string = '';

    async mounted() {
        await this.queryUsers();
        this.selectedUser = this.userList[0];
        this.currentUserName = this.selectedUser.userName;
        this.$emit('select-user', this.selectedUser);
    }

    /**
     * 添加用户
     * @memberof UserListComponent
     */
    addUser() {
        this.$emit('add-user');
    }

    editUserInfo() {

    }

    /**
     * 删除用户
     * @memberof UserListComponent
     */
    deleteUser(userName: string) {
        this.$emit('delete-user', userName);
    }

    /**
     * 查询用户列表
     * @memberof UserManageComponent
     */
    async queryUsers() {
        this.userList = await userManageService.queryUsers();
        this.userList = this.userList.filter(e => e.userName !== 'super');
    }

    /**
     * 选择用户
     * @param {UserInfo} userinfo
     * @memberof UserManageComponent
     */
    selectUser(userinfo: UserInfo) {
        this.selectedUser = userinfo;
        this.$emit('select-user', this.selectedUser);
    }
}
