// npm run dev DO NOT read this file
const workers = Number(require('os').cpus().length);
require('egg').startCluster({
  workers,
  baseDir: __dirname,
  port: process.env.PORT || 7001, // default to 7001
});
