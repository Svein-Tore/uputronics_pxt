/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */
/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace GPS {
    /**
     * Converts a hex string to character
     * @param hexnumber describe value here, eg: "0x33"
     */
    //% block
    export function hexToChar(hexnumber: string): string {
        let tall1 = parseFloat(hexnumber.substr(2, 1))
        let tall2 = parseFloat(hexnumber.substr(3, 1))
        for (let index = 0; index <= 5; index++) {
            if (hexnumber.substr(2, 1) == String.fromCharCode(65 + index) || hexnumber.substr(2, 1) == String.fromCharCode(97 + index)) {
                tall1 = 10 + index
            }
        }
        for (let index2 = 0; index2 <= 5; index2++) {
            if (hexnumber.substr(3, 1) == String.fromCharCode(65 + index2) || hexnumber.substr(3, 1) == String.fromCharCode(97 + index2)) {
                tall2 = 10 + index2
            }
        }
        return String.fromCharCode(16 * tall1 + tall2)
    }
    /**
     * Get latitude from GPS sensor
     */
    //% block
    export function Latitude(): number {
        let NMEAString = ""
        let NotEOL = true
        let latitude = 0
        while (NotEOL) {
            //pins.i2cWriteNumber(66, 1, NumberFormat.Int8LE, false)
            let Byte = pins.i2cReadNumber(66, NumberFormat.UInt8LE, false)
            if (Byte < 255) {
                NMEAString = "" + NMEAString + String.fromCharCode(Byte)
                if (String.fromCharCode(Byte) == "*" && NMEAString.length > 60) {
                    NotEOL = false
                    //basic.showString(NMEAString)
                }
            }
        }
        let GPS_data = NMEAString.split(',')
        let latitude_parted = GPS_data[3].split(".")
        //format: (d)ddmm.mmmm eller ddmm.mmmm
        //Må multiåplisere med 100 for å få nøyaktig nok verdi (får da 2 flere desimaler).  
        let WholeNumberString = convertToText(parseInt(latitude_parted[0]))
        latitude = parseInt(WholeNumberString.substr(0, 2)) * 100 + parseFloat(WholeNumberString.substr(2, 2)) * 100 / 60 + parseFloat("0." + latitude_parted[1]) * 100 / 60
        //basic.showString(convertToText(latitude_parted[0] + "," + latitude_parted[1]))
        return latitude
    }
    /**
     * Get longitude from GPS sensor
     */
    //% block
    export function Longitude(): number {
        let NMEAString = ""
        let NotEOL = true
        let longitude = 0
        while (NotEOL) {
            //pins.i2cWriteNumber(66, 1, NumberFormat.Int8LE, false)
            let Byte = pins.i2cReadNumber(66, NumberFormat.UInt8LE, false)
            if (Byte < 255) {
                NMEAString = "" + NMEAString + String.fromCharCode(Byte)
                if (String.fromCharCode(Byte) == "*" && NMEAString.length > 60) {
                    NotEOL = false
                    //basic.showString(NMEAString)
                }
            }
        }
        let GPS_data = NMEAString.split(',')
        let longitude_parted = GPS_data[5].split(".")
        let WholeNumberString = convertToText(parseInt(longitude_parted[0]))
        longitude = parseInt(WholeNumberString.substr(0, 2)) * 100 + parseFloat(WholeNumberString.substr(2, 2)) * 100 / 60 + parseFloat("0." + longitude_parted[1]) * 100 / 60
        //basic.showString(convertToText(longitude_parted[0] + "," + longitude_parted[1]))
        return longitude
    }
    /**
     * Get altitude from GPS sensor
     */
    //% block
    export function Altitude(): number {
        let NotEOL = true
        let NMEAString = ""
        let counter = 0
        pins.i2cWriteNumber(66, 1, NumberFormat.Int8LE, false)
        for (let index = 0; index < 3; index++) {
            while (NotEOL) {
                let Byte = pins.i2cReadNumber(66, NumberFormat.Int8LE, false)
                if (Byte < 255) {
                    NMEAString = "" + NMEAString + String.fromCharCode(Byte)
                    if (String.fromCharCode(Byte) == "*" && NMEAString.length > 60) {
                        NotEOL = false
                    }
                }
            }
            counter += 1
            if (counter == 2) {
                NMEAString = ""
            }
            NotEOL = true
        }
        let GPS_data = NMEAString.split(',')
        let altitude = GPS_data[9]
        return parseFloat(altitude.substr(0, 5))
    }
}
