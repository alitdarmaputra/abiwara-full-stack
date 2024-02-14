import { useState } from "react"

export const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
		const value = window.localStorage.getItem(keyName)

		if (value) {
			return value;
		}

		if (defaultValue) {
			window.localStorage.setItem(keyName, defaultValue);
			return defaultValue;
		}
    });

    const setValue = (newValue) => {
		if(newValue) {
			window.localStorage.setItem(keyName, newValue);
			setStoredValue(newValue);
			return;
		}
		
		window.localStorage.removeItem(keyName);
		setStoredValue();
    }

    return [storedValue, setValue]
}

