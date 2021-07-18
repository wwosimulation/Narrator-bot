// requirements

module.exports = class Util {
    constructor(client) {
        this.client = client;
    };

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
}