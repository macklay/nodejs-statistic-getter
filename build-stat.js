#!/usr/bin/env node

import {DefaultController} from './controllers/DefaultController';
import {Db} from './utils/Db';

// function exitHandler(options, err) {
// console.log('exitHandler');
//     Db.end();
// }
// process.on('exit', exitHandler);

(new DefaultController()).commandBuildStat();
