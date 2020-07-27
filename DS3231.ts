
/**
 * DS3231 block
 */
//% weight=100 color=#00cc00 icon="\uf042" block="DS3231 RTC"
namespace DS3231 {

    const DS3231_I2C_ADDR=0x68

    // Timekeeing Registers

    const DS3231_SECONDS = 0x00
    const DS3231_MINUTES = 0x01
    const DS3231_HOURS   = 0x02
    const DS3231_WEEKDAY = 0x03
    const DS3231_DAY = 0x04
    const DS3231_MONTH = 0x05
    const DS3231_YEAR = 0x06

    const DS3231_A1_SECONDS = 0x07
    const DS3231_A1_MINUTES = 0x08
    const DS3231_A1_HOURS   = 0x09
    const DS3231_A1_DAY_DATA = 0x0A

    const DS3231_A2_MINUTES = 0x0B
    const DS3231_A2_HOURS   = 0x0D
    const DS3231_A2_DAY_DATA = 0x0A

    const DS3231_CONTROL_ADDR = 0x0E
    const DS3231_STATUS_ADDR = 0x0F

    const DS3231_AGING_OFFSET = 0x10
    const DS3231_MSB_TEMP = 0x11
    const DS3231_LSB_TEMP = 0x12


    function DS3231_init() {
        let buffer = pins.createBuffer(2)
        buffer[0] = DS3231_CONTROL_ADDR
        buffer[1] = 0x4C
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buffer)
    }

    DS3231_init()


    /**
     * DecToHexString
     *
     * https://stackoverflow.com/questions/50967455/from-decimal-to-hexadecimal-without-tostring
     */
    function DecToHexString(int: number, base: number): string {
        let letters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        let returnVal = "";
        if (base > 1 && base < 37) {
            while (int != 0) {
                let rest = int % base;
                int = Math.floor(int / base);
                returnVal = letters[rest] + returnVal;
            }
        }
        return returnVal;
    }


    /**
     * HexString
     */
    //% block
    //% weight=0
    export function HexString(value: number): string {
        return DecToHexString(value, 16)
    }

    /**
     * BinaryString
     */
    //% block
    //% weight=0
    export function BinaryString(value: number): string {
        return DecToHexString(value, 2)
    }

    /**
     * DecimalString
     */
    //% block
    //% weight=0
    export function DecimalString(value: number): string {
        return DecToHexString(value, 10)
    }


// ==========================================================================

    function Encode(value: number): number {
        return (Math.floor(value / 10) << 4) + (value % 10)
    }

    function Decode(value: number): number {
        return Math.floor(value / 16) * 10 + (value % 16)
    }

// ==========================================================================

    function leadingZero(value: number): string {
        if (value < 10) {
            return "0" + value
        }
        return "" + value
    }

    function getRegister(register: number): number {
        let data = pins.createBuffer(1)
        data[0] = register
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, data)
        return pins.i2cReadNumber(DS3231_I2C_ADDR, NumberFormat.UInt8LE)
    }

    function setRegister(register: number, value: number) {
        let data = pins.createBuffer(2)
        data[0] = register
        data[1] = value
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, data)
    }

// ==========================================================================


    /**
     * setTime
     */
    //% block="set time:|hour $hour mins $mins secs $secs"
    //% weight=100
    //% hour.min=0 hour.max=23 mins.min=0 mins.max=59 secs.min=0 secs.max=59
    export function setTime(hour: number, mins: number, secs: number) {
        if(hour > 0 && hour < 24 && mins > 0 && mins < 60 && secs > 0 && secs < 60 ) {
            setRegister(DS3231_HOURS, Encode(hour))
            setRegister(DS3231_MINUTES, Encode(mins))
            setRegister(DS3231_SECONDS, Encode(secs))
        }
    }

    /**
     * getTime
     */
    function getTime(): number[] {
        let hour = Decode(getRegister(DS3231_HOURS))
        let mins = Decode(getRegister(DS3231_MINUTES))
        let secs = Decode(getRegister(DS3231_SECONDS))
        return [hour, mins, secs]
    }

    /**
     * timeString
     */
    //% block="current time (string)"
    //% weight=90
    export function timeString(): string {
        let time = getTime()
        let hour = leadingZero(time[0])
        let mins = leadingZero(time[1])
        let secs = leadingZero(time[2])
        return `${hour}:${mins}:${secs}`
    }


    /**
     * setDate
     */
    //% block="set date:|weekday $weekday day $day month $month year $year"
    //% weight=80
    //% inlineInputMode=inline
    //% weekday.min=0 weekday.max=7 day.min=0 day.max=31 month.min=0 month.max=12 year.min=2000 year.max=2100
    export function setDate(weekday: number, day: number, month: number, year: number) {
        if(weekday >= 0 && weekday <= 7 && day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2000 && year < 2100) {
            setRegister(DS3231_WEEKDAY, weekday)
            setRegister(DS3231_DAY, day)
            setRegister(DS3231_MONTH, month)
            setRegister(DS3231_YEAR, year-2000)
        }
    }

    /**
     * dateString
     */
    //% block="current date (string)"
    //% weight=70
    export function dateString(): string {
        let day = getRegister(DS3231_WEEKDAY)
        let date = getRegister(DS3231_DAY)
        let month = getRegister(DS3231_MONTH) & 0x1F
        let year = getRegister(DS3231_YEAR) + 2000
        return `${day}:${date}:${month}:${year}`
    }

    /**
     * temperature
     */
    //% block "temperature"
    export function temperature(): number {
        let msb_temp = getRegister(DS3231_MSB_TEMP)
        let lsb_temp = getRegister(DS3231_LSB_TEMP)
        let rtn_val = ((msb_temp << 8) | lsb_temp) >> 8
        return rtn_val
    }


    /**
     * status
     */
    //% block "status"
    //% weight=50
    export function status(): number {
        let status = getRegister(DS3231_STATUS_ADDR)
        return status
    }

    /**
     * set status
     */
    //% block "set status:| status $value"
    //% weight=40
    export function setStatus(value: number) {
        let buffer = pins.createBuffer(2)
        buffer[0] = DS3231_STATUS_ADDR
        buffer[1] = value
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buffer)
    }


    /**
     * control
     */
    //% block "control"
    //% weight=30
    export function control(): number {
        let ctrl = getRegister(DS3231_CONTROL_ADDR)
        return ctrl
    }

    /**
     * set control
     */
    //% block "set control:| status $value"
    //% weight=20
    export function setControl(value: number) {
        let buffer = pins.createBuffer(2)
        buffer[0] = DS3231_CONTROL_ADDR
        buffer[1] = value
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buffer)
    }


    /**
     * alarm1
     */
    //% block="set alarm1:|hour $hour mins $mins secs $secs"
    //% weight=60
    //% hour.min=0 hour.max=23 mins.min=0 mins.max=59 secs.min=0 secs.max=59
    export function alarm1(hour: number, mins: number, secs: number) {
        if(hour > 0 && hour < 24 && mins > 0 && mins < 60 && secs > 0 && secs < 60 ) {
            setControl(0x04)
            setRegister(DS3231_A1_HOURS, Encode(hour))
            setRegister(DS3231_A1_MINUTES, Encode(mins))
            setRegister(DS3231_A1_SECONDS, Encode(secs))
            setRegister(DS3231_A1_DAY_DATA, 0x80)
            setStatus(0)
            setControl(0x05)
        }
    }

    /**
     * clear alarms
     */
    //% block="clear alarms"
    //% weight=55
    export function clearAlarms() {
        setControl(0)
    }

}