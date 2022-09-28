[![Build Status](https://travis-ci.org/fivdi/veml6030.svg?branch=master)](https://travis-ci.org/fivdi/veml6030)
[![npm Version](http://img.shields.io/npm/v/veml6030.svg)](https://www.npmjs.com/package/veml6030)
[![Downloads Per Month](http://img.shields.io/npm/dm/veml6030.svg)](https://www.npmjs.com/package/veml6030)

# veml6030

Node.js I2C driver for the VISHAY VEML6030 ambient light sensor on Linux boards like the Raspberry Pi or BeagleBone.

Supports Node.js versions 10, 12, 14, 15 and 16.

VEML6030 chipset datasheet : https://www.vishay.com/docs/84366/veml6030.pdf

VEML6030 chipset application notes : https://www.vishay.com/docs/84367/designingveml6030.pdf?ICID=I-CT-TECH-RES-CLA-SEP_21-0


## Contents

 * [Features](#features)
 * [Installation](#installation)
 * [Usage](#usage)
 * [VEML6030 Class methods](#veml6030-class-methods)
 * [Related Packages](#related-packages)
 * [Roadmap](#Roadmap)

## Features

 * Ambient light sensing
 * Autocalibration mode
 * Manual mode
 * Promise based asynchronous call methods

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

## VEML6030 class methods

- [Constructor options](#constructor-options)
- [VEML6030 methods](#veml6030-methods)
- [VEML6030 constants](#veml6030-constants)

### Constructor options

VEML6030 class constructor accept an optionnal options object. 

None of theses options are mandatory, so you can invoke VEML6030 constructor without any parameters. In this case it will use options default values.

#### Options
|Option name|Description|Default Value|
|:-----|:-----|:-----|
|debug|If debug is set to true, VEML3060 class will print to console debug information|false|
|i2cAddress|I2C address (in hex) of VEML6030 chipset|0x48|
|gain|Fix the gain the chipset should use for reading (use it for manual calibration mode). Authorized value are 0.125, 0.25, 1 or 2. |1|
|integrationTime|Fix the integration time (in ms) the chipset should use for reading (use it for manual calibration mode)|100|
|ALSPersistenceProtectNumber|Leave this option to default value|1|
|ALSInterruptEnableSetting|Leave this option to default value|false|
|ALSShutDownSetting|Leave this option to default value|false|
|i2cBusNumber|I2C bus number. I most case leave this value to default value|1|

### VEML6030 methods

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


### VEML6030 constants

VEML6030 package publish folowing constants. You can use it when implementing your own implementation measures.

All theses constants are static, so you can use it like this:

```js
const VEML6030 = require('veml6030');
console.log('Read command is: %o', VEML6030.ALS_READ_REGISTER);
```

- **ALS_SETTING_REGISTER**: Send configuration command code. This constant value is 0x00.
- **ALS_WH_REGISTER**: Send an high value for threshold. This constant value is 0x01. This command is currently not used in this package.
- **ALS_WL_REGISTER**: Send an low value for threshold. This constant value is 0x02. This command is currently not used in this package.
- **ALS_POWER_SAVE_REGISTER**: Power saving command. This constant value is 0x03. This command is currently not used in this package.
- **ALS_READ_REGISTER**: Read command for ALS channel. This constant value is 0x04.
- **WHITE_READ_REGISTER**: Read command for white channel. This constant value is 0x05. This constant value is 0x03. This command is currently not used in this package.
- **ALS_INT_REGISTER**: Interrupt status command (use to detect low or high threshold). This constant value is 0x06. This command is currently not used in this package.
- **READ_BASE_RESOLUTION**: . This constant value is 0.0036.


## Related Packages

- [i2c-bus](https://github.com/fivdi/i2c-bus) - I2C serial bus access

## Roadmap

* Implement white channel reading
* Implement low and high threshold and interupt status reading
