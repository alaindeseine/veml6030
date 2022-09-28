'use strict';

const VEML6030 = require('../');

const veml6030 = new VEML6030({debug: true});

veml6030.init()
.then(() => {
    veml6030.readSensorData(true)
    .then(datas => console.log('Datas readed: %o', datas))
    .catch(error => console.log(error));
})
.catch(error => console.log(error));
