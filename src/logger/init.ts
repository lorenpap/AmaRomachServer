import * as winston from "winston";
import * as nconf from 'nconf';

export const logger = winston.createLogger({
    level: nconf.get('logger:level'),
    format: winston.format.json(),
    transports: [new winston.transports.File({filename: nconf.get('logger:filename')})]
});
