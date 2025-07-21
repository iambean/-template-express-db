
// 生成随机的唯一ID
export function generateRandomId () {
  const length = Math.floor(Math.random() * 3) + 6; // 6-8位
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 导出响应工具类
export { ResponseHelper } from './responseHelper.js';