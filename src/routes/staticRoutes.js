import express from 'express';
import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(__filename);
const router = express.Router();

// 配置静态文件服务
// router.use(express.static(path.join(__dirname, '../../static')));
router.use(express.static(path.join(process.cwd(), '/static')));

// Demo页面路由
router.get('/demo', (req, res) => {
// router.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '/static/demo/index.html'));
});

export default router;