import * as log4js from 'log4js';

log4js.configure({
    appenders  : { out: { type: 'stdout' }, app: { type: 'file', filename: 'logs/test-cases-api.log' } },
    categories : { default: { appenders: ['app', 'out'], level: 'info' } },
});

export default log4js;
