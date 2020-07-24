
/**
 * DS3231 block
 */
//% weight=100 color=#70c0f0 icon="\uf042" block="DS3231"
namespace DS3231 {
    const I2C_ADDR = 0x68
    const REG_SECS = 0x00
    const REG_MINS = 0x01
    const REG_HOUR = 0x02
    const REG_CTRL = 0x0E

    function initialize() {
        let buf = pins.createBuffer(2)
        buf[0] = REG_CTRL
        buf[1] = 0x4C
        pins.i2cWriteBuffer(I2C_ADDR, buf)
    }

    initialize()

    function leadingZero(value: number): string {
        if (value < 10) {
            return "0" + value
        }
        return "" + value
    }

    function getRegister(register: number): number {
        let data = pins.createBuffer(1)
        data[0] = register
        pins.i2cWriteBuffer(I2C_ADDR, data)
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.Int8LE)
    }

    function setRegister(register: number, value: number) {
        let data = pins.createBuffer(2)
        data[0] = register
        data[1] = value
        pins.i2cWriteBuffer(I2C_ADDR, data)
    }

    /**
     * get time
     */
    //% blockId="DS3231_GET_TIME" block="getTime %u"
    //% weight=80 blockGap=8
    export function getTime(): number[] {
        let hour = bcd.Decode(getRegister(REG_HOUR))
        let mins = bcd.Decode(getRegister(REG_MINS))
        let secs = bcd.Decode(getRegister(REG_SECS))
        return [hour, mins, secs]
    }

    /**
     * setTime
     */
    //% block
    export function setTime(hour: number, mins: number, secs: number) {
        setRegister(REG_HOUR, bcd.Encode(hour))
        setRegister(REG_MINS, bcd.Encode(mins))
        setRegister(REG_SECS, bcd.Encode(secs))
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