DS3231.setDate(3, 29, 7, 2020)
DS3231.setTime(10, 19, 0)
basic.forever(function () {
    basic.showNumber(DS3231.seconds() % 10)
    basic.pause(100)
})
