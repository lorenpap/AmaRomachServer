import * as nconf from 'nconf';

const Config = () => {
    nconf.file("default", "config/config.json");
};

export const get = (key) => nconf.get(key);

export default new Config();
