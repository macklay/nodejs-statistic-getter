import {NbaApiGate} from '../gates/NbaApiGate';
import {NbaGamesModel} from '../models/NbaGamesModel';
import {MathHelper} from '../utils/MathHelper';
import * as _ from 'underscore';

/**
 * NBA games business logic layer
 */
export class NbaGames
{
    /**
     * Get all games in season.
     * @param {integer} season year
     * @param {function} callback
     * @public
     */
    static getGamesBySeason(year, callback) {
        NbaApiGate.fullSchedulesCommand(year, (err, res) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, res.games);
        });
    }

    /**
     * Get one game play-by-play details.
     * @param {string} game GUID
     * @param {function} callback
     * @public
     */
    static getGameStat(gameId, callback) {
        NbaApiGate.playByPlayCommand(gameId, (err, res) => {
            if (err) {
                callback(err);
                return;
            }

            let data = {};
            res.periods.forEach((period) => {
                period.events.forEach((event) => {
                    if (!event.statistics) {
                        return;
                    }
                    let statistics = _.compact(event.statistics.map(NbaGames._getCorrectedStatisticItem));

                    statistics.forEach((statistic) => {
                        if (undefined === data[statistic.player.id]) {
                            data[statistic.player.id] = [];
                        }
                        if (undefined === data[statistic.player.id][period.id]) {
                            data[statistic.player.id][period.id] = [];
                        }
                        // console.log(period);
                        statistic.period = {
                            id      : period.id,
                            number  : `${period.number}/${period.sequence}`
                        };
                        data[statistic.player.id][period.id].push(statistic);
                    });
                });
            });
            callback(null, data);
        });
    }

    /**
     * Save one game statistic into DB.
     * @param {object} game data
     * @param {object} statistics data
     * @public
     */
    static saveGameStat(game, statistics) {
        let model = NbaGames._nbaModel;

        model.clearPlayerStatByGameId(game.id);

        for (let playerGuid in statistics) {
            if (!statistics.hasOwnProperty(playerGuid)) {
                continue;
            }
            let playerStat = statistics[playerGuid];
            let summaryGameStat = null;

            for (let periodGuid in playerStat) {
                if (!playerStat.hasOwnProperty(periodGuid)) {
                    continue;
                }

                let periodStat = playerStat[periodGuid];

                let summaryPeriodsStat = {
                    game_guid               : game.id,
                    game_description        : `${game.home.alias}-${game.away.alias}`,
                    points                  : 0,
                    fieldgoal_points        : 0,
                    fieldgoal_three_points  : 0,
                    fieldgoal_two_points    : 0,
                    freethrow_points        : 0,
                    rebound_points          : 0,
                    assist_points           : 0,
                    block_points            : 0,
                    steal_points            : 0,
                    turnover_points         : 0,
                };

                periodStat.forEach((statItem) => {
                    if (undefined === summaryPeriodsStat.player) {
                        summaryPeriodsStat.player_guid = statItem.player.id;
                        summaryPeriodsStat.player_description = `${statItem.player.full_name}, ${statItem.player.jersey_number}`;
                        summaryPeriodsStat.period = statItem.period.number;
                    }
                    MathHelper.increment(summaryPeriodsStat, 'points', statItem.points);

                    MathHelper.increment(summaryPeriodsStat, `${statItem.type}_points`, statItem.points);
                    if (statItem.type == 'fieldgoal') {
                        let fieldgoalType = statItem.points == 3 ? 'three' : 'two';
                        MathHelper.increment(summaryPeriodsStat, `fieldgoal_${fieldgoalType}_points`, statItem.points);
                    }
                });

                model.setPlayerStat(summaryPeriodsStat);

                if (summaryGameStat === null) {
                    summaryGameStat = _.clone(summaryPeriodsStat);
                    summaryGameStat.period = null;
                } else {
                    MathHelper.increment(summaryGameStat, 'points', summaryPeriodsStat.points);
                    MathHelper.increment(summaryGameStat, 'fieldgoal_points', summaryPeriodsStat.fieldgoal_points);
                    MathHelper.increment(summaryGameStat, 'fieldgoal_three_points', summaryPeriodsStat.fieldgoal_three_points);
                    MathHelper.increment(summaryGameStat, 'fieldgoal_two_points', summaryPeriodsStat.fieldgoal_two_points);
                    MathHelper.increment(summaryGameStat, 'freethrow_points', summaryPeriodsStat.freethrow_points);
                    MathHelper.increment(summaryGameStat, 'rebound_points', summaryPeriodsStat.rebound_points);
                    MathHelper.increment(summaryGameStat, 'assist_points', summaryPeriodsStat.assist_points);
                    MathHelper.increment(summaryGameStat, 'block_points', summaryPeriodsStat.block_points);
                    MathHelper.increment(summaryGameStat, 'steal_points', summaryPeriodsStat.steal_points);
                    MathHelper.increment(summaryGameStat, 'turnover_points', summaryPeriodsStat.turnover_points);
                }
            }
            model.setPlayerStat(summaryGameStat);
        }
    }

    /**
     * Collect only needed item data.
     * @param {object} item data
     * @private
     */
    static _getCorrectedStatisticItem(item) {
        let eventTypes = {
            fieldgoal   : null,
            freethrow   : 1,
            rebound     : 1.2,
            assist      : 1.5,
            block       : 2,
            steal       : 2,
            turnover    : -1,
        };
        let type = null,
            points = null;

        if (item.player && undefined !== eventTypes[item.type]) {
            type = item.type;
            if (item.type != 'fieldgoal') {
                points = eventTypes[item.type];
            } else {
                points = item.three_point_shot ? 3 : 2;
            }
        } else {
            return false;
        }

        return {
            type,
            points,
            player: item.player,
            team: item.team
        }
    }

    /**
     * Get NbaGamesModel instance.
     * @private
     */
    static get _nbaModel () {
        return new NbaGamesModel();
    }
}
