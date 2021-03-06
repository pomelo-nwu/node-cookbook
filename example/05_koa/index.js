'use strict';

const path = require('path');
const Koa = require('koa');
const staticCache = require('koa-static-cache');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

// 引入处理逻辑
const accessLog = require('./app/middleware/access_log');
const notFound = require('./app/middleware/not_found');
const errorHandler = require('./app/middleware/error_handler');

const home = require('./app/controller/home');
const todo = require('./app/controller/todo');

// 实例化应用
const app = new Koa();

// 挂载中间件，无需区分前置后置

// 静态资源
app.use(staticCache({
  prefix: '/public',
  dir: path.join(__dirname, 'public'),
  dynamic: true,
  preload: false,
}));

app.use(errorHandler); // 错误处理
app.use(bodyParser()); // Body 解析
app.use(accessLog); // 打印访问日志
app.use(notFound); // 兜底处理

// 路由映射
const router = new Router();
router.get('/', home);
router.get('/api/todo', todo.list);
router.post('/api/todo', todo.add);
router.put('/api/todo', todo.update);
router.delete('/api/todo/:id(\\d+)', todo.remove);

// 挂载路由
app.use(router.routes());
app.use(router.allowedMethods());

// 直接执行的时候，启动服务
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
  });
}

module.exports = app.callback();
