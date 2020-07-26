
/**
 * DS3231 block
 */
//% weight=100 color=#70c0f0 icon="\uf042" block="DS3231"
namespace DS3231 {

    const DS3231_I2C_ADDR=0x68

    // Timekeeing Registers

    const DS3231_SECONDS = 0x00
    const DS3231_MINUTES = 0x01
    const DS3231_HOURS   = 0x02
    const DS3231_DAY = 0x03
    const DS3231_DATE = 0x04
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
        let buf = pins.createBuffer(2)
        buf[0] = DS3231_CONTROL_ADDR
        buf[1] = 0x4C
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buf)
    }

    DS3231_init()


    /**
     * DecToHexText
     */
    //% block
    export function DecToHexText(dec_value: number): string {
        return dec_value.toString(16)
    }



    /**
     * HexToDec
     */
    //% block
    export function HexToDec(dat: number): number {
        return (dat >> 4) * 10 + (dat % 16);
    }

    /**
     * DecToHex
     */
    //% block
    export function DecToHex(dat: number): number {
        return Math.idiv(dat, 10) * 16 + (dat % 10)
    }


    function leftShift(a: Fx8, n: number) {
        return (a as any as number << n) as any as Fx8
    }
    function rightShift(a: Fx8, n: number) {
        return (a as any as number >> n) as any as Fx8
    }



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
        return pins.i2cReadNumber(DS3231_I2C_ADDR, NumberFormat.Int8LE)
    }

    function setRegister(register: number, value: number) {
        let data = pins.createBuffer(2)
        data[0] = register
        data[1] = value
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, data)
    }


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
     * setDate
     */
    //% block
    //% number.min=1 number.max=7 date.min=1 date.max=31 month.min=1 month.max=12 year.min=0 year.max=99
    export function setDate(day: number, date: number, month: number, year: number) {
        setRegister(DS3231_DAY, day)
        setRegister(DS3231_DATE, date)
        setRegister(DS3231_MONTH, month)
        setRegister(DS3231_YEAR, year)
    }



    /**
     * getDateString
     */
    //% block
    export function getDateString(): string {
        let day = getRegister(DS3231_DAY)
        let date = getRegister(DS3231_DATE)
        let month = getRegister(DS3231_MONTH)
        let year = getRegister(DS3231_YEAR)
        return `${day}:${date}:${month}:${year}`
    }



    /**
     * get time
     */
    //% blockId="DS3231_GET_TIME" block="getTime %u"
    //% weight=80 blockGap=8
    export function getTime(): number[] {
        let hour = bcd.Decode(getRegister(DS3231_HOURS))
        let mins = bcd.Decode(getRegister(DS3231_MINUTES))
        let secs = bcd.Decode(getRegister(DS3231_SECONDS))
        return [hour, mins, secs]
    }

    /**
     * setTime
     */
    //% block
    export function setTime(hour: number, mins: number, secs: number) {
        setRegister(DS3231_HOURS, bcd.Encode(hour))
        setRegister(DS3231_MINUTES, bcd.Encode(mins))
        setRegister(DS3231_SECONDS, bcd.Encode(secs))
    }

    /**
     * setTimeString
     */
    //% block
    export function setTimeString(input: string) {
        let time = helpers.stringSplit(input, ":")

        let hour = parseInt(time[0]) % 24;
        let mins = parseInt(time[1]) % 60;
        let secs = parseInt(time[2]) % 60;

        setTime(hour, mins, secs)
    }

    /**
     * getTimeString
     */
    //% block
    export function getTimeString(): string {
        let time = getTime()

        let hour = leadingZero(time[0])
        let mins = leadingZero(time[1])
        let secs = leadingZero(time[2])

        return `${hour}:${mins}:${secs}`
    }


}