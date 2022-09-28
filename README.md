[![Build Status](https://travis-ci.org/fivdi/veml6030.svg?branch=master)](https://travis-ci.org/fivdi/veml6030)
[![npm Version](http://img.shields.io/npm/v/veml6030.svg)](https://www.npmjs.com/package/veml6030)
[![Downloads Per Month](http://img.shields.io/npm/dm/veml6030.svg)](https://www.npmjs.com/package/veml6030)

# veml6030

Node.js I2C driver for the VISHAY VEML6030 ambient light sensor on Linux boards like the Raspberry Pi or BeagleBone.

Supports Node.js versions 10, 12, 14, 15 and 16.

## Contents

 * [Features](#features)
 * [Installation](#installation)
 * [Usage](#usage)
 * [API](#api)
 * [Related Packages](#related-packages)

## Features

 * Ambient light sensing
 * Normal and forced mode
 * Oversampling
 * Filtering
 * Standby period
 * Promise based asynchronous API

## Installation

```
npm install --save veml6030
```

## Usage

#### Circuit

![](doc/bme280-pi.png)

#### Report the ambient light with auto calibration mode example.
```js
const VEML6030    = require('veml6030');

const veml6030 = new VEML6030({debug: true});

veml6030.init()
.then(() => {
    veml6030.readSensorData(true)
    .then(datas => console.log('%o', datas))
    .catch(error => console.log(error));
})
.catch(error => console.log(error));
```

Sample output:
```js
{
  rawValue: 1101,
  luxValue: 31.7088,
  gain: 2,
  integrationTime: 100,
  autocalibrate: true,
  retry: 6
}
```

## API

- [Constructor options](#constructor-options)
- [Class Bme280](#class-bme280)
- [Enum OVERSAMPLE](#enum-oversample)
- [Enum FILTER](#enum-filter)
- [Enum STANDBY](#enum-standby)

### Constructor options

VEML6030 class constructor accept an optionnal options object. 

None of theses options are mandatory, so you can invoke VEML6030 constructor without any parameters. In this case it will use options default values.

#### options
|Option name|Description|Default Value|
|:-----|:-----|:-----|
|debug|If debug is set to true, VEML3060 class will print to console debug information|false|
|i2cAddress|I2C address (in hex) of VEML6030 chipset|0x48|
|gain|Fix the gain the chipset should use for reading (use it for manual calibration mode). Authorized value are 0.125, 0.25, 1 or 2. |1|
|integrationTime|Fix the integration time (in ms) the chipset should use for reading (use it for manual calibration mode)|100|
|ALSPersistenceProtectNumber||0x00|
|ALSInterruptEnableSetting||0x00|
|ALSShutDownSetting||0x00|
|i2cBusNumber||1|
### Class VEML6030

- [init()](#init)
- [readSensorData()](#readSensorData)
- [typicalMeasurementTime()](#typicalmeasurementtime)
- [maximumMeasurementTime()](#maximummeasurementtime)
- [close()](#close)

#### init()
Returns a Promise that will be resolved with an object containing the last
sensor reading on success, or will be rejected if an error occurs.

An object containing a sensor reading has the following properties:
- humidity - number, relative humidity in percent
- pressure - number, pressure in hectopascal (1 hPa = 1 millibar)
- temperature - number, temperature in degrees Celsius

#### readSensorData()
Returns a Promise that will be resolved with no arguments once the BME280 has
been triggered to perform a forced measurement, or will be rejected if an
error occurs.

triggerForcedMeasurement should only be called in forced mode.

Calling triggerForcedMeasurement will only trigger the BME280 to perform a
forced measurement. It will not wait for that measurement to complete. It is
the responsibility of the application to wait for the measurement to complete
before invoking read to get the reading.

#### typicalMeasurementTime()
Returns the typical measurement time in milliseconds.

The typical measurement time depends on the selected values for humidity,
pressure and temperature oversampling.

If OVERSAMPLE.X1 (the default) is used for humidity, pressure and temperature
oversampling, the typical measurement time is 8 milliseconds.

If OVERSAMPLE.X16 is used for humidity, pressure and temperature oversampling,
the typical measurement time is 98 milliseconds.

#### maximumMeasurementTime()
Returns the maximum measurement time in milliseconds.

The maximum measurement time depends on the selected values for humidity,
pressure and temperature oversampling.

If OVERSAMPLE.X1 (the default) is used for humidity, pressure and temperature
oversampling, the maximum measurement time is 10 milliseconds.

If OVERSAMPLE.X16 is used for humidity, pressure and temperature oversampling,
the maximum measurement time is 113 milliseconds.

#### close()
Returns a Promise that will be resolved with no arguments once the underlying
resources have been released, or will be rejected if an error occurs while
closing.

### Enum OVERSAMPLE

Controls oversampling of sensor data.

- **SKIPPED** - Measurement skipped. The corresponding property in a sensor
reading object will be undefined.
- **X1** - Oversampling × 1
- **X2** - Oversampling × 2
- **X4** - Oversampling × 4
- **X8** - Oversampling × 8
- **X16** - Oversampling × 16

### Enum FILTER

The filter is used to slow down the response to the sensor inputs.

- **OFF** - Filter off
- **F2** - Filter coefficient = 2
- **F4** - Filter coefficient = 4
- **F8** - Filter coefficient = 8
- **F16** - Filter coefficient = 16

### Enum STANDBY

Controls the inactive standby period in normal mode.

- **MS_0_5** - 0.5 milliseconds
- **MS_62_5** - 62.5 milliseconds
- **MS_125** - 125 milliseconds
- **MS_250** - 250 milliseconds
- **MS_500** - 500 milliseconds
- **MS_1000** - 1000 milliseconds
- **MS_10** - 10 milliseconds
- **MS_20** - 20 milliseconds

## Related Packages

- [i2c-bus](https://github.com/fivdi/i2c-bus) - I2C serial bus access

