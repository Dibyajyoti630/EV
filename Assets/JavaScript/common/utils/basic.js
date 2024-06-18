
// Get Random Item from Array
export const getRandItem = (array) => {
    let randIndex = Math.floor(Math.random() * array.length)
    return array[randIndex]
}

// Format string objects
export const sFormater = (value, toLower = false) => {
    value = value.trim()
    if (toLower) value = value.toLowerCase()
    return value
}

// Sort a J-Object by its key with value of datetime object
export const sortbyDateTime = (obj, sortBy, reverse = false) => {
    let keys = Object.keys(obj)
    keys.sort((a, b) => {
        let dateTime1 = dateTimeToMilliSec(obj[a][sortBy])
        let dateTime2 = dateTimeToMilliSec(obj[b][sortBy])
        if (dateTime1 < dateTime2) return -1
        else if (dateTime1 > dateTime2) return 1
        return 0
    })
    return reverse ? keys.reverse() : keys
}
const dateTimeToMilliSec = (obj) => { return new Date(obj).getTime() }

// Sort a J-Object by its key with value of integer object
export const sortbyInteger = (obj, sortBy, reverse = false) => {
    let keys = Object.keys(obj)
    keys.sort((a, b) => {
        let integer1 = obj[a][sortBy]
        let integer2 = obj[b][sortBy]
        if (integer1 < integer2) return -1
        else if (integer1 > integer2) return 1
        return 0
    })
    return reverse ? keys.reverse() : keys
}