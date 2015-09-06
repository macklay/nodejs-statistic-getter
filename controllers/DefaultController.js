import {NbaGames} from '../services/NbaGames';
import {config} from '../config/main';
import {Db} from '../utils/Db';
import * as _ from 'underscore';

/**
 * Default controller of CLI application
 */
export class DefaultController
{
    /**
     * Constructor.
     * @public
     */
    constructor() {
        _.bindAll(this, '_getGamesBySeasonCallback');
    }

    /**
     * Build statistic command.
     * @public
     */
    commandBuildStat() {
        console.log(`\n*************************\n`);
        NbaGames.getGamesBySeason(2014, this._getGamesBySeasonCallback);
    }

    /**
     * Callback
     * @param {string} err
     * @param {array} games
     * @private
     */
    _getGamesBySeasonCallback(err, games) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Total games count: ${games.length}`);

        games = games.slice(0, config.targetGamesLimit);

        console.log(`Target games count: ${games.length}`);
        console.log(`\n*************************\n`);

        this._buildGamesStat(games);
    }

    /**
     * Handle games with timeout for fix "Developer Over Qps" API error.
     * @param {array} games
     * @param {integer} current index
     * @private
     */
    _buildGamesStat(games, index = 0) {
        if (undefined === games[index]) {
            console.log(`\nWork complete!`);
            console.log(`\n**************\n`);
            return;
        }

        let game = games[index];
        let guid = game.id

        console.log(`\nAnalyzing game ${guid}... ${index + 1} from ${games.length}`);

        NbaGames.getGameStat(guid, (err, statistics) => {
            if (err) {
                console.error(err);
                return;
            }

            let statLen = _.keys(statistics.length);
            if (!statLen) {
                console.error('Calulated statistic is empty. Something wrong, maybe...');
                return;
            }

            console.log(`Save stat in DB for game ${guid}`);
            NbaGames.saveGameStat(game, statistics);
            _.delay(() => {this._buildGamesStat(games, index + 1)}, config.apiRequestDelay);
        });
    }
}
