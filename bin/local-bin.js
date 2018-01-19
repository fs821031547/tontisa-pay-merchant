const EggBin = require('egg-bin');
const debug = require('debug')('egg-bin');

class LocalEggBinCommand extends EggBin.DevCommand {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: local-bin [dir] [options]';
  }

  * run(context) {
    const devArgs = yield this.formatArgs(context);
    const options = {
      execArgv: context.execArgv,
      env: Object.assign({ NODE_ENV: 'development', EGG_SERVER_ENV: 'local' }, context.env),
    };
    debug('%s %j %j, %j', this.serverBin, devArgs, options.execArgv, options.env.NODE_ENV);
    yield this.helper.forkNode(this.serverBin, devArgs, options);
  }
}

new LocalEggBinCommand().start();