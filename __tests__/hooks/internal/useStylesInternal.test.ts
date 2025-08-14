import { renderHook, act } from "@testing-library/react";
import { expect } from "@jest/globals";

import { useStylesInternal } from "../../../src/hooks/internal/useStylesInternal";
import { useStylesContext } from "../../../src/context/StylesContext";

// Mock the necessary context and service
jest.mock("../../../src/context/StylesContext");
jest.mock("../../../src/utils/configParser", () => ({
	deepClone: jest.fn(),
	getCombinedConfig: jest.fn(),
}));

/**
 * Test for useStylesInternal hook.
 */
describe("useStylesInternal Hook", () => {
	const setSyncedStylesMock = jest.fn();
	const mockStyles = {
		bodyStyle: {}
	}

	beforeEach(() => {
		jest.clearAllMocks();
		(useStylesContext as jest.Mock).mockReturnValue({
			styles: mockStyles,
			setSyncedStyles: setSyncedStylesMock,
			syncedStylesRef: { current: mockStyles },
		});
	})

	// Test to ensure initial values (styels and setSyncedStyles) are returned correctly from the hook
	it("should return initial values from context", () => {
		const { result } = renderHook(() => useStylesInternal());

		expect(result.current.styles).toEqual(mockStyles);
		expect(result.current.replaceStyles).toEqual(expect.any(Function));
		expect(result.current.updateStyles).toEqual(expect.any(Function));
	});

	it("should call setSyncedStyles from context, when styles are updated", () => {
		const { result } = renderHook(() => useStylesInternal());
		const styles = { tooltipStyle: {} };

		act(() => {
			result.current.updateStyles(styles);
		});
		// Argument passed to setSyncedStyles is not checked, because it is transformed with 
		// deepClone() and getCombinedConfig()
		expect(setSyncedStylesMock).toHaveBeenCalled();
	});

	it("should call setSyncedStyles from context with correct value, when styles are replaced", () => {
		const { result } = renderHook(() => useStylesInternal());
		const styles = { notificationBadgeStyle: {} };

		act(() => {
			result.current.replaceStyles(styles);
		});

		expect(setSyncedStylesMock).toHaveBeenCalledWith(styles);
	});

	it("should replace styles with callback function correctly", () => {
		const { result } = renderHook(() => useStylesInternal());

		act(() => {
			result.current.replaceStyles((currentStyles) => ({
				...currentStyles,
				newStyle: {},
			}));
		});

		expect(setSyncedStylesMock).toHaveBeenCalledWith({
			...mockStyles,
			newStyle: {},
		});
	});
});