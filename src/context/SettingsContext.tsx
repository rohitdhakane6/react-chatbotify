import { useContext, createContext, Dispatch, SetStateAction, MutableRefObject } from "react";

import { Settings } from "../types/Settings";
import { DefaultSettings } from "../constants/internal/DefaultSettings";

/**
 * Creates the useSettingsContext() hook to manage settings for the chatbot.
 */
type SettingsContextType = {
	settings: Settings;
	setSyncedSettings: Dispatch<SetStateAction<Settings>>;
	syncedSettingsRef: MutableRefObject<Settings>;
};
const SettingsContext = createContext<SettingsContextType>({
	settings: {},
	setSyncedSettings: () => null,
	syncedSettingsRef: {current: {}}
});
const useSettingsContext = () => useContext(SettingsContext);

/**
 * Creates provider to wrap the chatbot container.
 */
const SettingsProvider = ({
	children,
	settings = DefaultSettings,
	setSyncedSettings,
	syncedSettingsRef,
}: {
	children: React.ReactNode;
	settings: Settings;
	setSyncedSettings: Dispatch<SetStateAction<Settings>>;
	syncedSettingsRef: MutableRefObject<Settings>;
}) => {
	return (
		<SettingsContext.Provider value={{ settings, setSyncedSettings, syncedSettingsRef }}>
			{children}
		</SettingsContext.Provider>
	);
};

export { useSettingsContext, SettingsProvider };
