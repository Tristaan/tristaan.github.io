---
layout: post
title: BME680 Driver on top of Embedded HAL
categories: [rust, programming]
tags: [rust, programming, bme680, i2c]
---

This post is not only about the driver, but also about how to design a piece of software, from the initial idea to the implementation (which should always happen last). I choose this sensor because I had it laying around and found out that embedded Rust works on the Arduino Nano to test it using this microcontroller.

## The requirements
So the requirement here is quite simple, we need a driver for the well-known Bosch BME680 temperature, humidity, pressure and gas sensor. The driver consists of a user interface which are just simple read and write operations to and from the i2c interface. The general behaviour should be something like in this PDF below (note: The sequence diagram does not show dependencies of the called functions, once you have a bme680 instance you are free to call functions as you like):

{% pdf "/files/BME680.pdf" %}

## The sensor
The sensor datasheet can be found [Here](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme680-ds001.pdf). There also exists some [example API](https://github.com/BoschSensortec/BME68x-Sensor-API) implementation in C. I won't copy paste the specs of the sensor. Please read them up in the datasheet if you are interested.
The BME680 has 2 interfaces, a i2c interface and a SPI interface. We will focus on the i2c interface.

The sensor supports reading of:
* Temperature
* Pressure
* Humidity
* Gas resistance

Pressure, Humidity and Gas resistance have a dependency on temperature. This implies a design decision we have to make, should we read the temperature and calculate it on each reading of the other values, add a parameter to the read functions or store the last read temperature in the BME680 struct?
After some thought I have decided on storing the *t_fine* value inside the BME680 as an Option type, so that we can read it if it's not existing or use it if it is. Please note that *t_fine* is a byproduct of the temperature calculation. So our read_temperature() function will have a side-effect of updating the BME680 struct. This side effect must be documented.
Speaking of *t_fine*, it can be found in the **example API** from Bosch linked above. It is also referenced in the Datasheet but no info whatsoever on it inside of the datasheet. So the datasheet is almost useless without the **example API**. I sense some possibility-of-improvement on Bosches side. No harm intended.

## The implementation

```rust
pub struct BME680 {
    pub i2c: I2c,
    t_fine: Option<i32>,
    parameters: BME680Parameters,
    pub temperature_oversampling: BME680Oversampling,
    pub pressure_oversampling: BME680Oversampling,
    pub humidity_oversampling: BME680Oversampling,
    pub gas_resistance_oversampling: BME680Oversampling,
}

impl BME680 {
    pub fn new(i2c: I2c, temp_os: BME680Oversampling, press_os: BME680Oversampling, hum_os: BME680Oversampling, g_r_os: BME680Oversampling) -> Self {}
    pub fn read_temperature(&self) -> Result<i16, Error> {}
    pub fn read_pressure(&self) -> Result<u16, Error> {}
    pub fn read_humidity(&self) -> Result<u16, Error> {}
    pub fn read_gas_resistance(&self) -> Result<u16, Error> {}
    pub fn read(&self) -> Result<BME680Reading, Error> {}

    fn calc_temperature(temp_adc: u32) -> i16 {}
    fn calc_pressure(press_adc: u32) -> u16 {}
    fn calc_humidity(hum_adc: u32) -> u16 {}
    fn calc_gas_resistance(g_r_adc: u32) -> u16 {}

    pub fn enable_heater(profile: BME680HeaterProfile) -> Result<(), Error> {}
}
```

### read_temperature()
This function is quite straightforward, read some bytes from the i2c bus addressing the sensor, do some additional calculations according to the datasheet and store the *t_fine* data inside the struct. I have gone forward and split the calculation stuff into another function for better readability. so the **calculate_temperature()** function is the one having the side-effect of storing *t_fine* inside **BME680**.