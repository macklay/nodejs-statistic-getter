import {config} from '../config/main';
import {Db} from '../utils/Db';
import * as _ from 'underscore';

/**
 * NBA games statistics model
 */
export class NbaGamesModel
{
    /**
     * Clear one game statistic
     * @param {string} game GUID
     * @public
     */
    clearPlayerStatByGameId(gameId) {
        Db.inst.query(`DELETE FROM ${config.db.prefix}players_stat WHERE game_guid=?`, [gameId], function(err, result) {
          Db.end();
          if (err) {
              throw err;
          }
        });
    }

    /**
     * Insert game statistic item
     * @param {object} table "players_stat" columns data
     * @public
     */
    setPlayerStat(stat) {
        Db.inst.query(`INSERT INTO ${config.db.prefix}players_stat SET ?`, stat, function(err, result) {
          Db.end();
          if (err) {
              throw err;
          }
        });
    }
}
