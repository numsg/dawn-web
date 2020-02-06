export default {
    getBase64(target: any, type: any) {
        const canvas: any = document.createElement('canvas');
        const ctx: any = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 656;
        ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/' + type);
        return dataUrl;
    }
};
