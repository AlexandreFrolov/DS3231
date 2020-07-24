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

}