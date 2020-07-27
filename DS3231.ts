
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
    export function HexString(value: number): string {
        return DecToHexString(value, 16)
    }

    /**
     * BinaryString
     */
    //% block
    export function BinaryString(value: number): string {
        return DecToHexString(value, 2)
    }

    /**
     * DecimalString
     */
    //% block
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
     * get temperature string
     */
    //% block
    export function getTemperatureString(): string {
        let msb_temp = getRegister(DS3231_MSB_TEMP)
        let lsb_temp = getRegister(DS3231_LSB_TEMP)
        return `${msb_temp}:${lsb_temp}`
    }


    /**
     * DS3231 Status
     */
    //% blockId="DS3231_STATUS" block="status"
    export function Status(): number {
        let status = getRegister(DS3231_STATUS_ADDR)
        return status
    }

    /**
     * DS3231 Control
     */
    //% blockId="DS3231_CONTROL" block="control"
    export function Control(): number {
        let ctrl = getRegister(DS3231_CONTROL_ADDR)
        return ctrl
    }

    /**
     * DateString
     */
    //% blockId="DS3231_DATA_STRING" block="DateString"
    export function DateString(): string {
        let day = getRegister(DS3231_WEEKDAY)
        let date = getRegister(DS3231_DAY)
        let month = getRegister(DS3231_MONTH) & 0x1F
        let year = getRegister(DS3231_YEAR) + 2000
        return `${day}:${date}:${month}:${year}`
    }

    /**
     * setDate
     */
    //% block
    export function setDate(weekday: number, day: number, month: number, year: number) {
        setRegister(DS3231_WEEKDAY, weekday)
        setRegister(DS3231_DAY, day)
        setRegister(DS3231_MONTH, month)
        setRegister(DS3231_YEAR, year)
    }


    /**
     * SetYear
     */
    //% block
    export function SetYear(year: number) {
        if(year >= 2000 && year < 3000)  {
          setRegister(DS3231_YEAR, year-2000)
    }
    }


    /**
     * SetMonth
     */
    //% block
    export function SetMonth(month: number) {
        setRegister(DS3231_MONTH, month)
    }

    /**
     * SetDay
     */
    //% block
    export function SetDay(day: number) {
        setRegister(DS3231_DAY, day)
    }

    /**
     * SetWeekDay
     */
    //% block
    export function SetWeekDay(weekday: number) {
        setRegister(DS3231_WEEKDAY, weekday)
    }

    /**
     * get time
     */
    //% blockId="DS3231_GET_TIME"
    //% block="getTime %u"
    //% weight=80 blockGap=8
    export function getTime(): number[] {
        let hour = Decode(getRegister(DS3231_HOURS))
        let mins = Decode(getRegister(DS3231_MINUTES))
        let secs = Decode(getRegister(DS3231_SECONDS))
        return [hour, mins, secs]
    }

    /**
     * setTime
     */
    //% block="set DS3231 time from:|hour: $hour mins: $mins secs: $secs"
    //% weight=1
    export function setTime(hour: number, mins: number, secs: number) {
        setRegister(DS3231_HOURS, Encode(hour))
        setRegister(DS3231_MINUTES, Encode(mins))
        setRegister(DS3231_SECONDS, Encode(secs))
    }


    /**
     * TimeString
     */
    //% blockId="DS3231_TIME_STRING" block="TimeString"
    export function TimeString(): string {
        let time = getTime()
        let hour = leadingZero(time[0])
        let mins = leadingZero(time[1])
        let secs = leadingZero(time[2])
        return `${hour}:${mins}:${secs}`
    }




}