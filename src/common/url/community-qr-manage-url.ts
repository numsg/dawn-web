export const communityQRManageUrl = {
  //   生成单个二维码
  generateQRCodeImage: '/qr-codes',
  // 批量生成二维码
  batchGenerateQRCodeImage: '/qr-codes/batch',
  // 根据Id查询二维码详情
  getQRCodeById: '/qr-codes/{businessId}',
  //  根据Ids查询二维码List
  getQRCodeListByIds: '/qr-codes/search'
};
