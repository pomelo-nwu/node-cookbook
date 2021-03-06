'use strict';

// 简化示例，直接全局变量存储数据。
const Todo = require('../model/todo');
const db = new Todo([
  { id: '1', title: 'Read history of Express', completed: true },
  { id: '2', title: 'Learn Koa', completed: true },
  { id: '3', title: 'Star Egg', completed: false },
]);

// 查询列表，支持过滤 `/api/todo?completed=true`
exports.list = async ctx => {
  // query 参数均为字符串，需转换
  let { completed } = ctx.query;
  if (ctx.query.completed !== undefined) completed = completed === 'true';

  ctx.status = 200;
  ctx.body = await db.find({ completed });
};

// 创建任务
exports.add = async ctx => {
  // `ctx.requestBody` 为 body-parser 中间件的产物
  ctx.status = 201;
  ctx.body = await db.add(ctx.requestBody);
};

// 修改任务
exports.update = async ctx => {
  // `ctx.requestBody` 为 body-parser 中间件的产物
  ctx.status = 204;
  ctx.body = await db.update(ctx.requestBody);
};

// 删除操作
exports.remove = async ctx => {
  // URL 匹配参数
  const id = ctx.params[0];
  ctx.status = 204;
  await db.remove(id);
};
