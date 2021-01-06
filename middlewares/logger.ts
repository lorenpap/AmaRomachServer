import * as winston from "winston";
import * as config from '../middlewares';

export const logger = winston.createLogger({
    level: config.default.get('logger:level'),
    format: winston.format.json(),
    transports: [new winston.transports.File({filename: config.default.get('logger:filename')})]
});
