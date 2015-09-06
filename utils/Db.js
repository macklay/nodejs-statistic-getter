import * as mysql from 'mysql';
import {config} from '../config/main';

/**
 * Mysql heper util
 */
export class Db
{
    /**
     * Db connection instance getter.
     * @public
     */
    static get inst() {
        if (!Db._db) {
            Db._db = mysql.createConnection(config.db);
            Db._db.connect();
        }
        return Db._db;
    }

    /**
     * Db connection destructor.
     * @public
     */
    static end() {
        if(!Db._db) {
            return;
        }
        Db._db.end(function(err){
            Db._db = null;
        });
    }
}
