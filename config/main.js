import {configLocal} from '../config/main-local';

console.log(configLocal);

/**
 * Main project config
 */
export var config = Object.assign({
    debug: true,
    db: {
        host        : 'localhost',
        user        : 'root',
        password    : '',
        database    : 'test',
        prefix      : 'sport_'
    },
    api: {
        token   : 'server-api-token',
        baseUrl : 'http://some-restfull-server-api'
    },
    targetGamesLimit    : 10,
    apiRequestDelay     : 7000
}, configLocal);
