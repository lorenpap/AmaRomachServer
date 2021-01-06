import * as winston from "winston";
import * as config from '../middlewares';

export const logger = winston.createLogger({
    level: config.get('logger:level'),
    format: winston.format.json(),
    transports: [new winston.transports.File({filename: config.get('logger:filename')})]
});
