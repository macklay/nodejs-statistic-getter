import {BaseApiGate} from './BaseApiGate';

/**
 * NBA API gate
 */
export class NbaApiGate extends BaseApiGate
{
    /**
     * Get full season schedules
     * @param {integer} season year
     * @param {function} callback
     * @public
     */
    static fullSchedulesCommand(year, callback) {
        NbaApiGate.execute(`/nba-t3/games/${year}/REG/schedule.json`, callback);
    }

    /**
     * Get play-by-play detail
     * @param {string} game GUID
     * @param {function} callback
     * @public
     */
    static playByPlayCommand(gameId, callback) {
        NbaApiGate.execute(`/nba-t3/games/${gameId}/pbp.json`, callback);
    }
}
