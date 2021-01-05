import * as nconf from 'nconf';

const Config = () => {
    nconf.argv().env("_");
    const environment = nconf.get("NODE:ENV") || "development";
    nconf.file(environment, "config/" + environment + ".json");
    nconf.file("default", "config/config.json");
};

Config.prototype.get = (key) => nconf.get(key);

export default new Config();
