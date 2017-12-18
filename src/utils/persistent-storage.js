/**
 * Fetches the value associated with key from localStorage.  If the key/value aren't in localStorage, you can optional provide a callback to run as a fallback getter.
 * The callback will also be run if the localStorage cache has expired.  You can use persistentStorage.setItem in the callback to save the results from the callback back to localStorage.
 *
 * @example <caption>Fetch from localStorage with no callback and get the response returned.</caption>
 * var response = persistentStorage.getItem('key');
 *
 * @example <caption>Fetch from localStorage and handle response in a callback.</caption>
 * persistentStorage.getItem('key', function(response) {
      *   if (response === null) {
      *     // Nothing in localStorage.
      *   } else {
      *     // Got data back from localStorage.
      *   }
      * });
 *
 * @kind function
 * @function persistentStorage#getItem
 *
 * @param {!string} key - Name of the key in localStorage.
 * @param {?function} [optionalCallback=null] - If you want to handle the response in a callback, provide a callback and check the response.
 * @returns {*} Returns null if localStorage isn't supported, or the key/value isn't in localStorage, returns anything if it was in localStorage, or returns a callback if key/value was empty in localStorage and callback was provided.
 */
export const getItem = (key, optionalCallback) => {
    if (!supportsLocalStorage()) {
        return null;
    }

    const callback = data => {
        const newData = typeof data !== 'undefined' ? data : null;

        return typeof optionalCallback === 'function'
            ? optionalCallback(newData)
            : newData;
    };

    let value = localStorage.getItem(key);

    if (value !== null) {
        value = JSON.parse(value);

        if (Object.prototype.hasOwnProperty.call(value, '__expiry')) {
            const expiry = value.__expiry;
            const now = Date.now();

            if (now >= expiry) {
                removeItem(key);

                return callback();
            }
            // Return the data object only.
            return callback(value.__data);
        }
        // Value doesn't have expiry data, just send it wholesale.
        return callback(value);
    }
    return callback();
};

/**
 * Saves an item in localStorage so it can be retrieved later.  This method automatically encodes the value as JSON, so you don't have to.  If you don't supply a value, this method will return false immediately.
 *
 * @example <caption>set localStorage that persists until it is manually removed</caption>
 * persistentStorage.setItem('key', 'value');
 *
 * @example <caption>set localStorage that persists for the next 30 seconds before being busted</caption>
 * persistentStorage.setItem('key', 'value', 30);
 *
 * @kind function
 * @function persistentStorage#setItem
 *
 * @param {!string} key - Name of the key in localStorage.
 * @param {!*} value - Value that should be stored in localStorage.  Must be able to be encoded/decoded as JSON.  Please ensure your object doesn't have the key __expiry as this will accidentally conflict with the expiry handler.
 * @param {?int} [expiry=null] - Time in seconds that the localStorage cache should be considered valid.
 * @returns {boolean} Returns true if it was stored in localStorage, false otherwise.
 */
export const setItem = (key, value, expiry) => {
    if (
        !supportsLocalStorage() ||
        typeof value === 'undefined' ||
        key === null ||
        value === null
    ) {
        return false;
    }

    let newValue = value;
    if (typeof expiry === 'number') {
        newValue = {
            __data: value,
            __expiry: Date.now() + parseInt(expiry, 10) * 1000,
        };
    }

    try {
        localStorage.setItem(key, JSON.stringify(newValue));

        return true;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Unable to store ${key} in localStorage due to ${e.name}`);

        return false;
    }
};

/**
 * Removes an item from localStorage.  No need to pay attention to the return value as localStorage doesn't offer a return status on completion.
 *
 * @kind function
 * @function persistentStorage#removeItem
 *
 * @param {!string} key - Name of the key in localStorage.
 * @returns {void} Remove the key/value combo from the localStorage storage container.
 */
export const removeItem = (key) => {
    if (supportsLocalStorage()) {
        localStorage.removeItem(key);
    }
};

/**
 * Remove all items from localStorage.  Takes no parameters and returns nothing.
 *
 * @kind function
 * @function persistentStorage#clear
 *
 * @returns {void} Remove all keys from localStorage
 */
export const clear = () => {
    if (supportsLocalStorage()) {
        localStorage.clear();
    }
};

/**
 * Determines whether the browser supports localStorage or not.
 *
 * This method is required due to iOS Safari in Private Browsing mode incorrectly says it supports localStorage, when it in fact does not.
 *
 * @kind function
 * @function persistentStorage#supportsLocalStorage
 *
 * @returns {boolean} Returns true if setting and removing a localStorage item is successful, or false if it's not.
 */
export const supportsLocalStorage = () => {
    try {
        localStorage.setItem('_', '_');
        localStorage.removeItem('_');

        return true;
    } catch (e) {
        return false;
    }
};

export const tryGetItem = (key, defaultValue) => {
    if (!supportsLocalStorage()) {
        return defaultValue;
    }
    let value = getItem(key);
    return value === null ? defaultValue : value;
};
