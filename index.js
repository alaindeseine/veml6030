'use strict';

class VEML6030 {
    static ALS_SETTING_REGISTER = 0x00;
    static ALS_WH_REGISTER = 0x01;
    static ALS_WL_REGISTER = 0x02;
    static ALS_POWER_SAVE_REGISTER = 0x03;
    static ALS_READ_REGISTER = 0x04;
    static WHITE_READ_REGISTER = 0x05;
    static ALS_INT_REGISTER = 0x06;
    static READ_BASE_RESOLUTION = 0.0036;


    constructor(options) {
        const i2c = require('i2c-bus');

        this.debug                          = (options && options.hasOwnProperty('debug')) ? options.debug : false;
        this.VEML6030_ADDR                  = (options && options.hasOwnProperty('i2cAddress')) ? options.i2cAddress : 0x48;
        this.gain                           = (options && options.hasOwnProperty('gain')) ? this.setGain(options.gain) : 0x00;
        this.integrationTime                = (options && options.hasOwnProperty('integrationTime')) ? this.setIntegrationTime(options.integrationTime) : 0x00;
        this.ALSPersistenceProtectNumber    = (options && options.hasOwnProperty('ALSPersistenceProtectNumber')) ? this.setALSPersistenceProtectNumber(options.ALSPersistenceProtectNumber) : 0x00;
        this.ALSInterruptEnableSetting      = (options && options.hasOwnProperty('ALSInterruptEnableSetting')) ? this.setALSInterruptEnable(options.ALSInterruptEnableSetting) : 0x00;
        this.ALSShutDownSetting             = (options && options.hasOwnProperty('ALSShutDownSetting')) ? this.setALSShutdown(options.ALSShutDownSetting) : 0x00;

        if (this.debug){
            console.debug('Constructor: VEML6030_ADDR: %o', this.VEML6030_ADDR);
            console.debug('Constructor: gain: %o', this.getGain(this.gain));
            console.debug('Constructor: integrationTime: %o', this.getIntegrationTime(this.integrationTime));
            console.debug('Constructor: ALSPersistenceProtectNumber: %o', this.ALSPersistenceProtectNumber);
            console.debug('Constructor: ALSInterruptEnableSetting: %o', this.ALSInterruptEnableSetting);
            console.debug('Constructor: ALSShutDownSetting: %o', this.ALSShutDownSetting);    
        }

        this.i2cBus = i2c.openSync((options && options.hasOwnProperty('i2cBusNumber')) ? options.i2cBusNumber : 1);
    } // eo constructor


    init() {
        return new Promise((resolve, reject) => {
            this.writeConfiguration()
            .then(() => {
                resolve();
            })
            .catch( error => reject(error));
        });
    } // eo init method


    calculateLuxLevel(rawValue){
        let integrationFactor;
        let gainFactor;

        switch(this.gain){
            case 0x01 : {
                gainFactor = 1;
                break;
            }
            case 0x00 : {
                gainFactor = 2;
                break;
            }
            case 0x03 : {
                gainFactor = 8;
                break;
            }
            case 0x02 : {
                gainFactor = 16;
                break;
            }
        }

        switch(this.integrationTime){
            case 0x03 : {
                integrationFactor = 1;
                break;
            }
            case 0x02 : {
                integrationFactor = 2;
                break;
            }
            case 0x01 : {
                integrationFactor = 4;
                break;
            }
            case 0x00 : {
                integrationFactor = 8;
                break;
            }
            case 0x08 : {
                integrationFactor = 16;
                break;
            }
            case 0x0c : {
                integrationFactor = 32;
                break;
            }
        }

        return rawValue * VEML6030.READ_BASE_RESOLUTION * gainFactor * integrationFactor;

    } // eo initResolutionMatrix method


    setGain(gain){
        switch(gain){
            case 0.125 : {
                this.gain = 0x02;
                break;
            }
            case 0.25 : {
                this.gain = 0x03;
                break;
            }
            case 1.0 : {
                this.gain = 0x00;
                break;
            }
            case 2.0 : {
                this.gain = 0x01;
                break;
            }
            default : {
                this.gain = 0x00;
            }
        }

        return this.gain;
    } // eo setGain method


   getGain(){
        switch(this.gain){
            case 0x03 : {
                return 0.25;
            }
            case 0x02 : {
                return 0.125;
            }
            case 0x01 : {
                return 2.0;
            }
            case 0x00 : {
                return 1.0;
            }
        }
    } // eo getGain method


    setIntegrationTime(integrationTime){
        switch(integrationTime){
            case 25 : {
                this.integrationTime = 0x0c;
                break;
            }
            case 50 : {
                this.integrationTime = 0x08;
                break;
            }
            case 100 : {
                this.integrationTime = 0x00;
                break;
            }
            case 200 : {
                this.integrationTime = 0x01;
                break;
            }
            case 400 : {
                this.integrationTime = 0x02;
                break;
            }
            case 800 : {
                this.integrationTime = 0x03;
                break;
            }
            default : {
                this.integrationTime = 0x00;
            }
        }

        return this.integrationTime;
    } // eo setIntegrationTime method


    getIntegrationTime(){
        switch(this.integrationTime){
            case 0x03 : {
                return 800;
            }
            case 0x02 : {
                return 400;
            }
            case 0x01 : {
                return 200;
            }
            case 0x00 : {
                return 100;
            }
            case 0x08 : {
                return 50;
            }
            case 0x0c : {
                return 25;
            }
        }
    } // eo getIntegrationTime method


    setALSPersistenceProtectNumber(protectNumber){
        switch(protectNumber){
            case 1 : {
                this.ALSPersistenceProtectNumber = 0x00;
                break;
            }
            case 2 : {
                this.ALSPersistenceProtectNumber = 0x01;
                break;
            }
            case 4 : {
                this.ALSPersistenceProtectNumber = 0x02;
                break;
            }
            case 8 : {
                this.ALSPersistenceProtectNumber = 0x03;
                break;
            }
            default : {
                this.ALSPersistenceProtectNumber = 0x00;
            }
        }

        return this.ALSPersistenceProtectNumber;
    } // eo setALSPersistenceProtectNumber method


    setALSInterruptEnable(protectNumber){
        switch(protectNumber){
            case false : {
                this.ALSInterruptEnableSetting = 0x00;
                break;
            }
            case true : {
                this.ALSInterruptEnableSetting = 0x01;
                break;
            }
            default : {
                this.ALSInterruptEnableSetting = 0x00;
            }
        }

        return this.ALSInterruptEnableSetting;
    } // eo setALSPersistenceProtectNumber method


    setALSShutdown(protectNumber){
        switch(protectNumber){
            case false : {
                this.ALSShutDownSetting = 0x00;
                break;
            }
            case true : {
                this.ALSShutDownSetting = 0x01;
                break;
            }
            default : {
                this.ALSShutDownSetting = 0x00;
            }
        }

        return this.ALSShutDownSetting;
    } // eo setALSShutdown method


    writeConfiguration(){
        return new Promise((resolve, reject) => {
            let command = (this.gain << 11) + (this.integrationTime << 6) + (this.ALSPersistenceProtectNumber << 4) + (this.ALSInterruptEnableSetting << 1) + (this.ALSShutDownSetting << 0);

            if (this.debug){
                console.log('Configuration: %o', command.toString(2));
            }

            this.i2cBus.writeWord(this.VEML6030_ADDR, VEML6030.ALS_SETTING_REGISTER, command, (error) => {
                if (error) {
                    return reject(error);
                } 
                else {
                    if(this.debug){
                        console.debug('writeConfiguration: configuration saved');
                    }

                    return resolve(true);
                }
            });
        });
    } // eo writeConfiguration method


    async writeConfigurationSync() {
        let command = (this.gain << 11) + (this.integrationTime << 6) + (this.ALSPersistenceProtectNumber << 4) + (this.ALSInterruptEnableSetting << 1) + (this.ALSShutDownSetting << 0);

        if (this.debug){
            console.log('Configuration: %o', command.toString(2));
        }

        this.i2cBus.writeWordSync(this.VEML6030_ADDR, VEML6030.ALS_SETTING_REGISTER, command);

        if(this.debug){
            console.debug('writeConfigurationSync: configuration saved');
        }
    } // eo writeConfigurationSync method


    readSensorData(autoCalibrate = false) {
        return new Promise((resolve, reject) => {
            if (! autoCalibrate){
                // No auto calibrate, make a simple measure.
                this.i2cBus.readWord(this.VEML6030_ADDR, VEML6030.ALS_READ_REGISTER, (error, readBuffer) => {
                    if(error) {
                        return reject(error);
                    }

                    return resolve({
                        rawValue : readBuffer,
                        luxValue : this.calculateLuxLevel(readBuffer),
                        gain : this.getGain(this.gain),
                        integrationTime : this.getIntegrationTime(this.integrationTime),
                        autocalibrate: false, 
                        retry: 1
                    });
                });                
            }
            else {
                // Auto calibrate.
                let readValue = 0;
                let timeoutCount = 25;
                let count = 0;
                let hasValue = false;
                // Set initial gain and integration time.
                this.gain = this.setGain(0.125);
                this.integrationTime = this.setIntegrationTime(100);
                this.writeConfigurationSync();

                while (! hasValue){
                    // Check if we should go to timeout.
                    if (count == timeoutCount){
                        hasValue = true;
                        return reject("Reading timeout");
                    }

                    // read value from I2C
                    readValue = this.i2cBus.readWordSync(this.VEML6030_ADDR, VEML6030.ALS_READ_REGISTER);

                    // Check if readed value is lower than 100.
                    if (readValue <= 100) {
                        // Readed value is lower than 100, increase resolution and make measure again.
                        if (this.debug){
                            console.debug('readValue: %o', readValue);
                        }

                        this.increaseResolution();
                        this.writeConfigurationSync();
                    }
                    else {
                        // Readed value is greater than 100, check for overflow.
                        if (this.checkForOverflow(readValue)){
                            // Overflow detected, decrease resolution.
                            this.decreaseResolution();
                            this.writeConfigurationSync();
                        }
                        else {
                            // No overflow, reading is ok.
                            hasValue = true;
                        }
                    }

                    count++;
                }

                return resolve({
                    rawValue : readValue,
                    luxValue : this.calculateLuxLevel(readValue),
                    gain : this.getGain(this.gain),
                    integrationTime : this.getIntegrationTime(this.integrationTime),
                    autocalibrate: true,
                    retry: count
                });
            }
        });
    } // eo readSensorData method


    checkForOverflow(readValue){
        let isOverflow = false;

        if ( this.gain == 0x01 && this.integrationTime == 0x03 && readValue >= 236){
            isOverflow = true;
        }

        if ( this.gain == 0x01 && this.integrationTime == 0x02 && readValue >= 472){
            isOverflow = true;
        }

        if ( this.gain == 0x01 && this.integrationTime == 0x01 && readValue >= 944){
            isOverflow = true;
        }

        if ( this.gain == 0x01 && this.integrationTime == 0x00 && readValue >= 1887){
            isOverflow = true;
        }

        if ( this.gain == 0x01 && this.integrationTime == 0x08 && readValue >= 3775){
            isOverflow = true;
        }

        if ( this.gain == 0x01 && this.integrationTime == 0x0c && readValue >= 7550){
            isOverflow = true;
        }

        if ( this.gain == 0x00 && this.integrationTime == 0x03 && readValue >= 472){
            isOverflow = true;
        }

        if ( this.gain == 0x00 && this.integrationTime == 0x02 && readValue >= 944){
            isOverflow = true;
        }

        if ( this.gain == 0x00 && this.integrationTime == 0x01 && readValue >= 1887){
            isOverflow = true;
        }

        if ( this.gain == 0x00 && this.integrationTime == 0x00 && readValue >= 3775){
            isOverflow = true;
        }

        if ( this.gain == 0x00 && this.integrationTime == 0x08 && readValue >= 7550){
            isOverflow = true;
        }

        if ( this.gain == 0x00 && this.integrationTime == 0x0c && readValue >= 15099){
            isOverflow = true;
        }

        if ( this.gain == 0x03 && this.integrationTime == 0x03 && readValue >= 1887){
            isOverflow = true;
        }

        if ( this.gain == 0x03 && this.integrationTime == 0x02 && readValue >= 3775){
            isOverflow = true;
        }

        if ( this.gain == 0x03 && this.integrationTime == 0x01 && readValue >= 7550){
            isOverflow = true;
        }

        if ( this.gain == 0x03 && this.integrationTime == 0x00 && readValue >= 15099){
            isOverflow = true;
        }

        if ( this.gain == 0x03 && this.integrationTime == 0x08 && readValue >= 30199){
            isOverflow = true;
        }

        if ( this.gain == 0x03 && this.integrationTime == 0x0c && readValue >= 60398){
            isOverflow = true;
        }

        if ( this.gain == 0x02 && this.integrationTime == 0x03 && readValue >= 3775){
            isOverflow = true;
        }

        if ( this.gain == 0x02 && this.integrationTime == 0x02 && readValue >= 7550){
            isOverflow = true;
        }

        if ( this.gain == 0x02 && this.integrationTime == 0x01 && readValue >= 15099){
            isOverflow = true;
        }

        if ( this.gain == 0x02 && this.integrationTime == 0x00 && readValue >= 30199){
            isOverflow = true;
        }

        if ( this.gain == 0x02 && this.integrationTime == 0x08 && readValue >= 60398){
            isOverflow = true;
        }

        if ( this.gain == 0x02 && this.integrationTime == 0x0c && readValue >= 120796){
            isOverflow = true;
        }

        return isOverflow;
    }

    increaseResolution(){
        let changed = false;

        if (this.debug){
            console.debug('increaseResolution (before): this.gain: %o', this.gain);
            console.debug('increaseResolution (before): this.integrationTime: %o', this.integrationTime);
        }

        if (this.gain == 0x02 && ! changed){
            // gain = 0.125 set to 0.25 
            this.setGain(0.25);
            changed = true;
        }

        if (this.gain == 0x03 && ! changed){
            // gain = 0.25 set to 1.0 
            this.setGain(1.0);
            changed = true;
        }

        if (this.gain == 0x00 && ! changed){
            // gain = 1.0 set to 2.0 
            this.setGain(2.0);
            changed = true;
        }

        if (this.gain == 0x01 && ! changed){
            // Maximum gain, set Integration time
            if (this.integrationTime == 0x0c && ! changed){
                // Integration time = 25 ms set to 50 ms
                this.setIntegrationTime(50);
                changed = true;
            }

            if (this.integrationTime == 0x08 && ! changed){
                // Integration time = 50 ms set to 100 ms
                this.setIntegrationTime(100);
                changed = true;
            }

            if (this.integrationTime == 0x00 && ! changed){
                // Integration time = 100 ms set to 200 ms
                this.setIntegrationTime(200);
                changed = true;
            }

            if (this.integrationTime == 0x01 && ! changed){
                // Integration time = 200 ms set to 400 ms
                this.setIntegrationTime(400);
                changed = true;
            }

            if (this.integrationTime == 0x02 && ! changed){
                // Integration time = 400 ms set to 800 ms
                this.setIntegrationTime(800);
                // changed = true;
            }
        }

        if (this.debug){
            console.debug('increaseResolution (after): this.gain: %o', this.gain);
            console.debug('increaseResolution (after): this.integrationTime: %o', this.integrationTime);
        }
    } // eo increaseResolution method


    decreaseResolution(){
        let changed = false;

        if (this.integrationTime == 0x03 && ! changed){
            // Integration time = 800 ms set to 400 ms
            this.setIntegrationTime(400);
            changed = true;
        }

        if (this.integrationTime == 0x02 && ! changed){
            // Integration time = 400 ms set to 200 ms
            this.setIntegrationTime(200);
            changed = true;
        }

        if (this.integrationTime == 0x01 && ! changed){
            // Integration time = 200 ms set to 100 ms
            this.setIntegrationTime(100);
            changed = true;
        }

        if (this.integrationTime == 0x00 && ! changed){
            // Integration time = 100 ms set to 50 ms
            this.setIntegrationTime(50);
            changed = true;
        }

        if (this.integrationTime == 0x08 && ! changed){
            // Integration time = 50 ms set to 25 ms
            this.setIntegrationTime(25);
            changed = true;
        }

        if (this.integrationTime == 0x0c && ! changed){
            // Minimum Integration time (25 ms), decrease gain
            if (this.gain == 0x01 && ! changed){
                // gain = 2.0 set to 1.0 
                this.setGain(1.0);
                changed = true;
            }

            if (this.gain == 0x00 && ! changed){
                // gain = 1.0 set to 0.25 
                this.setGain(0.25);
                changed = true;
            }

            if (this.gain == 0x03 && ! changed){
                // gain = 0.25 set to 0.125 
                this.setGain(0.125);
                // changed = true;
            }
        }
    } // eo decreaseResolution method

} // eo VEML6030 class

module.exports = VEML6030;