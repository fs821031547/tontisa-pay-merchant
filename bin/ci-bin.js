// 接受到 webhook 的消息，拉取代码并编译
const cp = require('child_process');
const path = require('path');
const http = require('http');
const parse = require('co-body');
const Koa = require('koa');
const app = new Koa();

const token = 'you do not known what it is';
app.use(function* (next) {
  const ctx = this;
  if (ctx.is('json') && ctx.method == 'POST' && ctx.path == '/webhook') {
    // 解析请求体
    const body = yield parse.json(ctx.request);
    if (body.token == token || !body.token) {
      const projectPath = path.join('..', __dirname);
      if (body.event == 'push' || true) {
        // push 事件
        // 执行git拉取代码操作
        git(projectPath, out => {
          if (out) {
            console.log('git out ', out);
            // 编译操作
            build(projectPath, out => {
              if (out) {
                console.log('build out ', out);
              }
            }, err => {
              if (err) {
                console.log('build err ', err);
              }
            });
          }
        }, err => {
          if (err) {
            console.log('git err ', err);
          }
        })
      } else {
        console.log('不支持的事件');
      }
    } else {
      console.log('token 验证失败');
    }
  } else {
    console.log('请求方式或请求数据格式或请求路径不正确');
  }
  ctx.set('content-type', 'application/json');
  ctx.body = JSON.stringify({
    zen: '✌',
  });
});

app.listen(7777);
console.log('ci server start on 7777');

function build(path, outcb, errcb) {
  const cmd = `echo 'buld shell run'
cd ${path}
npm run compile:build`
  rum(cmd, outcb, errcb);
}

function git(path, outcb, errcb) {
  const cmd = `echo 'git shell run' &&
cd ${path}  &&
echo 'git shell 11111'  &&
git reset --hard  &&
git clean -f  &&
git pull`
  rum(cmd, outcb, errcb);
}


function rum(cmd, outcb, errcb) {
  const child = cp.exec(cmd);
  let out = '';
  let err = '';
  child.stdout.on('data', buffer => {
    out += buffer.toString();
  });
  child.stderr.on('data', buffer => {
    err += buffer.toString();
  });
  child.stderr.on('end', () => {
    if (typeof errcb === 'function') {
      errcb(err);
    }
  });
  child.stdout.on('end', () => {
    if (typeof outcb === 'function') {
      outcb(out);
    }
  });
}
