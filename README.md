[![npm Version](https://img.shields.io/npm/v/@cabinfo.eu/veml6030.svg)](https://www.npmjs.com/package/@cabinfo.eu/veml6030)
[![Downloads Per Month](https://img.shields.io/npm/dm/@cabinfo.eu/veml6030.svg)](https://www.npmjs.com/package/@cabinfo.eu/veml6030)
![GitHub last commit](https://img.shields.io/github/last-commit/alaindeseine/veml6030.svg)
![GitHub top language](https://img.shields.io/github/languages/top/alaindeseine/veml6030.svg)
![GitHub package.json version](https://img.shields.io/github/package-json/v/alaindeseine/veml6030.svg)
![NPM](https://img.shields.io/npm/l/@cabinfo.eu/veml6030.svg)

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

### Features

 * Ambient light sensing
 * Autocalibration mode
 * Manual mode
 * Promise based asynchronous call methods

### Installation

```
npm install --save veml6030
```

### Usage

#### Report the ambient light with auto calibration mode example.
```js
const VEML6030    = require('@cabinfo.eu/veml6030');

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
  rawValue: 144,
  rawLuxValue: 66.3552
  luxValue: 66.8638,
  useCorrectionFormula: true
  gain: 0.25,
  integrationTime: 50,
  autocalibrate: false,
  retry: 1,
  overflow: false
}
```


#### Report the ambient light with manual configuration example.

```js
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
```


Sample output:
```js
{
  rawValue: 144,
  rawLuxValue: 66.3552
  luxValue: 66.8638,
  useCorrectionFormula: true
  gain: 0.25,
  integrationTime: 50,
  autocalibrate: false,
  retry: 1,
  overflow: false
}
```

### VEML6030 class methods

- [Constructor options](#constructor-options)
- [VEML6030 methods](#veml6030-methods)
- [VEML6030 constants](#veml6030-constants)

#### Constructor options

VEML6030 class constructor accept an optionnal options object. 

None of theses options are mandatory, so you can invoke VEML6030 constructor without any parameters. In this case it will use options default values.

**Options**:

|Option name|Description|Default Value|
|:-----|:-----|:-----|
|debug|If debug is set to true, VEML6030 class will print to console debug information|false|
|i2cAddress|I2C address (in hex) of VEML6030 chipset|0x48|
|gain|Fix the gain the chipset should use for reading (use it for manual calibration mode). Authorized value are 0.125, 0.25, 1 or 2. |1|
|integrationTime|Fix the integration time (in ms) the chipset should use for reading (use it for manual calibration mode). Authorized values are 25, 50, 100, 200, 400 or 800.|100|
|ALSPersistenceProtectNumber|Leave this option to default value|1|
|ALSInterruptEnableSetting|Leave this option to default value|false|
|ALSShutDownSetting|Leave this option to default value|false|
|i2cBusNumber|I2C bus number. I most case leave this value to default value|1|

#### VEML6030 methods

- [init()](#init)
- [readSensorData()](#readSensorData)


##### init()
Returns a Promise that will be resolved with no arguments once the initial configuration has been wrote to the VEML6030 chipset, or will be rejected if an error occurs.

Configuration values are default ones if you invoke constructor without any options object. If you set some optionnal parameters in constructor call or if you invoke one or more parameter methods, it will be the current values that are send to chipset.

Once init resolve you can use the read readSensorData() method.
##### readSensorData()
Returns a Promise that will be resolved with an object once the VEML6030 chipset return the readed value, or will be rejected if an error occurs.

readSensorData accept one boolean parameter to indicat if you want an autocalibrating measure (prefered) or a raw measure with the current reading options values (gain, integration time, etc.)

If autocalibration parameter is set to true this method will adjust the gain and the integration time of the chipset according to VISHAY recommandations. 

If you set the parameter to false a simple reading is done with the parameters you set. This mode is intended to permit you to implement your own calibration method. 

We recommend using autocalibration once you don't need to implement your own measures scheme.

Object properties returned when promise resolve: 

* **rawValue**: The raw value readed from chipset
* **rawLuxValue**: The optimized raw illumination value calculated from raw value (in lux) according to VISHAY recommandations
* **luxValue**: The illumination value (in lux). If `rawLuxValue` is <= 100 `luxValue` and `rawLuxValue` are identical. If `rawLuxValue` is > 100 a correction formula is apply to `luxValue` according to VISHAY recommandations
* **useCorrectionFormula**: Indicate if a correction formula is applied to luxValue (true) or not (false)
* **gain**: The gain value used for reading
* **integrationTime**: the integration time (in ms) used for reading
* **autocalibrate**: Inditate if in autocalibration mode (true) or not (false)
* **retry**: Number of measures done. If autocalibration mode this number is > 1 due to gain and integration time adjustments.
* **overflow**: Indicate if an overflow is detected (true) or not (false)


Sample object: 

```js
{
  rawValue: 144,
  rawLuxValue: 66.3552
  luxValue: 66.8638,
  useCorrectionFormula: true
  gain: 0.25,
  integrationTime: 50,
  autocalibrate: false,
  retry: 1,
  overflow: false
}
```


#### VEML6030 constants

VEML6030 package publish folowing constants. You can use it when implementing your own implementation measures.

All theses constants are static, so you can use it like this:

```js
const VEML6030 = require('@cabinfo.eu/veml6030');
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


### Related Packages

- [i2c-bus](https://github.com/fivdi/i2c-bus) - I2C serial bus access

### Roadmap

* Implement shutdown/powerup during autocalibration according to Vishay documents.
* Implement white channel reading.
* Implement low and high threshold and interupt status reading.
