import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// 配置静态文件服务
router.use(express.static(path.join(__dirname, '../../static')));

// Demo页面路由
router.get('/demo', (req, res) => {
// router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../static/demo/index.html'));
});

export default router;