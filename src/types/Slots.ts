import React from "react";

/**
 * Defines the structure for custom components (e.g. header) that can be passed to the ChatBot.
 * Each property is optional and corresponds to a major section of the ChatBot UI.
 * If a component is provided, it will be rendered in place of the default component.
 */
export type Slots = {
	/** Custom component to render the header of the ChatBot. */
	header?: React.ElementType;
	/** Custom component to render the body/content area of the ChatBot. */
	body?: React.ElementType;
	/** Custom component to render the input area of the ChatBot. */
	input?: React.ElementType;
	/** Custom component to render the footer of the ChatBot. */
	footer?: React.ElementType;
}
