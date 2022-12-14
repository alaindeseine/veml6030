const VEML6030    = require('@cabinfo.eu/veml6030');

const veml6030 = new VEML6030({debug: true});

veml6030.init()
.then(() => {
    veml6030.readSensorData(true)
    .then(datas => console.log('Datas readed: %o', datas))
    .catch(error => console.log(error));
})
.catch(error => console.log(error));
