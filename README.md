# DS3231

## MakeCode DS3231 RTC Extension for micro:bit


![](ds3231.jpg)

https://www.maximintegrated.com/en/products/analog/real-time-clocks/DS3231.html

## Add extension

Copy and paste this to Extension search box:
https://github.com/AlexandreFrolov/DS3231

## Date


* set Date day, month and year

```blocks
setDate(weekday: number, day: number, month: number, year: number)

input.onButtonPressed(Button.A, function () {
    DS3231.setDate(2, 28, 7, 2020)
})

```

* show Date as a String

```blocks
function dateString()

function doTest () {
    OLED.writeStringNewLine(DS3231.dateString())
}
```

## Time

Currently support 24-hour mode only.

* set Time hours, minutes and seconds

```blocks
setTime(hour: number, mins: number, secs: number)

input.onButtonPressed(Button.A, function () {
    DS3231.setTime(11, 10, 50)
})

```

* show Time as a String

```blocks
function timeString()

function doTest () {
    OLED.writeStringNewLine(DS3231.timeString())
}
```


* show hours as a numbers

```blocks
hours()

function doTest () {
    OLED.writeNumNewLine(DS3231.hours())
}
```

* show minutes as a numbers

```blocks
minutes()

function doTest () {
    OLED.writeNumNewLine(DS3231.minutes())
}
```

* show seconds as a numbers

```blocks
seconds()

function doTest () {
    OLED.writeNumNewLine(DS3231.seconds())
}
```

* show year as a numbers

```blocks
year()

function doTest () {
    OLED.writeNumNewLine(DS3231.year())
}
```

* show month as a numbers

```blocks
month()

function doTest () {
    OLED.writeNumNewLine(DS3231.month())
}
```

* show day as a numbers

```blocks
day()

function doTest () {
    OLED.writeNumNewLine(DS3231.day())
}
```

* show week day as a numbers

```blocks
weekday()

function doTest () {
    OLED.writeNumNewLine(DS3231.weekday())
}
```

## Alarms

* set Alarm 1

```blocks
alarm1(hour: number, mins: number, secs: number)

input.onButtonPressed(Button.B, function () {
    DS3231.alarm1(11, 10, 30)
    doTest()
    basic.showIcon(IconNames.Diamond)
})
```

* set Alarm 2

```blocks
alarm2(hour: number, mins: number)

input.onButtonPressed(Button.B, function () {
    DS3231.alarm2(11, 11)
    doTest()
    basic.showIcon(IconNames.Diamond)
})
```

* clear Alarms

```blocks
clearAlarms()

input.onButtonPressed(Button.AB, function () {
    DS3231.clearAlarms()
})
```

## Temperature

* temperature

```blocks
temperature()

function doTest () {
    OLED.writeNumNewLine(DS3231.temperature())
}
```


## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)

