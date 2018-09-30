const localStorageKey = "wattenberger--"

export const setInStorage = (key, value) => {
    try {
        localStorage.setItem(`${localStorageKey}${key}`, JSON.stringify(value));
    } catch(e) {
        console.log(e)
    }
}

export const getFromStorage = key => {
    try {
        return JSON.parse(localStorage.getItem(`${localStorageKey}${key}`) || "")
    } catch(e) {
        console.log(e)
        return null
    }
}
