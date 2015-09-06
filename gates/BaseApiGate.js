import {config} from '../config/main';
import * as http from 'http';
import * as url from 'url';

/**
 * Base class of any gate API
 */
export class BaseApiGate
{
    /**
     * Get api config getter
     * @public
     */
    static get config() {
        return config.api;
    }

    /**
     * Execute api command
     * @param {string} path
     * @param {function} callback
     * @public
     */
    static execute(path, callback) {
        let uri = url.parse(`${BaseApiGate.config.baseUrl}${path}`);
        uri.query = uri.query || {};
        uri.query.api_key = BaseApiGate.config.token;

        let uriStr = url.format(uri);
        if (config.debug) {
            console.log('API request:', uriStr);
        }
        http.get(uriStr, (res) => {
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                callback(null, JSON.parse(Buffer.concat(data)));
            });
        }).on('error', (e) => {
            callback(`Could not get document[${uriStr}]:  + ${e.message}`);
        });
    }
}
