import { useCallback } from "react";

import { deepClone, getCombinedConfig } from "../../utils/configParser";
import { useStylesContext } from "../../context/StylesContext";
import { Styles } from "../../types/Styles";

/**
 * Internal custom hook for managing styles.
 */
export const useStylesInternal = () => {
	// handles styles
	const { styles, setSyncedStyles, syncedStylesRef } = useStylesContext();

	/**
	 * Updates the styles for the chatbot.
	 *
	 * @param fields fields to update
	 */
	const updateStyles = useCallback((fields: Styles) => {
		if (!fields || Object.keys(fields).length === 0) {
			return;
		}
		setSyncedStyles(deepClone(getCombinedConfig(fields, styles) as Styles));
	}, [styles])

	/**
	 * Replaces (overwrites entirely) the current styles with the new styles.
	 * 
	 * @param newStylesOrUpdater new styles or a function that receives current styles
	 * and returns new styles
	 */
	const replaceStyles = useCallback((
		newStylesOrUpdater: Styles | ((currentStyles: Styles) => Styles)
	) => {
		const newStyles = typeof newStylesOrUpdater === 'function'
			? newStylesOrUpdater(syncedStylesRef.current)
			: newStylesOrUpdater;
		setSyncedStyles(newStyles);
	}, [syncedStylesRef])

	return {
		styles,
		replaceStyles,
		updateStyles
	};
};
