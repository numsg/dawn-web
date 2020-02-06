
import { MessageBox } from 'element-ui';
import { ElMessageBoxOptions } from 'element-ui/types/message-box';
import i18n from '@/i18n';

export const asyncConfirm = (message: string, title?: any): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        let options: any = {
            confirmButtonText: i18n.tc('common.determine'),
            cancelButtonText: i18n.tc('common.cancel'),
        };
        if (!title) {
            title = options;
            options = undefined;
        }
        MessageBox
            .confirm(message, title, options)
            .then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
    });
};
