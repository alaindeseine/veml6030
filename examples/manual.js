const VEML6030    = require('@cabinfo.eu/veml6030');

const options = {
    debug: true,
    gain: 0.25,
    integrationTime: 50
};

const veml6030 = new VEML6030(options);

veml6030.init()
.then(() => {
    veml6030.readSensorData(false)
    .then(datas => console.log('Datas readed: %o', datas))
    .catch(error => console.log(error));
})
.catch(error => console.log(error));
