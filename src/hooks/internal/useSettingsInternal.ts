import { useCallback } from "react";

import { deepClone, getCombinedConfig } from "../../utils/configParser";
import { useSettingsContext } from "../../context/SettingsContext";
import { Settings } from "../../types/Settings";

/**
 * Internal custom hook for managing settings.
 */
export const useSettingsInternal = () => {
	// handles settings
	const { settings, setSyncedSettings, syncedSettingsRef } = useSettingsContext();

	/**
	 * Updates the settings for the chatbot.
	 *
	 * @param fields fields to update
	 */
	const updateSettings = useCallback((fields: Settings) => {
		if (!fields || Object.keys(fields).length === 0) {
			return;
		}
		setSyncedSettings(deepClone(getCombinedConfig(fields, settings) as Settings));
	}, [settings])

	/**
	 * Replaces (overwrites entirely) the current settings with the new settings.
	 * 
	 * @param newSettingsOrUpdater new settings or a function that receives current settings
	 * and returns new settings
	 */
	const replaceSettings = useCallback((
		newSettingsOrUpdater: Settings | ((currentSettings: Settings) => Settings)
	) => {
		const newSettings = typeof newSettingsOrUpdater === 'function'
			? newSettingsOrUpdater(syncedSettingsRef.current)
			: newSettingsOrUpdater;
		setSyncedSettings(newSettings);
	}, [syncedSettingsRef])

	return {
		settings,
		replaceSettings,
		updateSettings
	};
};
