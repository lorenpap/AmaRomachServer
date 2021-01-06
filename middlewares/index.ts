import * as nconf from 'nconf';

const Config = () => {
    nconf.file("default", "config/config.json");
};

Config.prototype.get = (key) => nconf.get(key);

export default new Config();
