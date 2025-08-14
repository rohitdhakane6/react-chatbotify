import { renderHook } from "@testing-library/react";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { useSettingsInternal } from "../../../src/hooks/internal/useSettingsInternal";
import { deepClone, getCombinedConfig } from "../../../src/utils/configParser";
import { act } from "react";
import { Settings } from "../../../src/types/Settings";
import { Styles } from "../../../src/types/Styles";

jest.mock("../../../src/context/SettingsContext", () => ({
	useSettingsContext: jest.fn(),
}));

jest.mock("../../../src/utils/configParser", () => ({
	deepClone: jest.fn(),
	getCombinedConfig: jest.fn(),
}));

describe("useSettingsInternal", () => {
	const setSyncedSettingsMock = jest.fn();
	const mockSettings: Settings = { general: { primaryColor: "red" } };

	beforeEach(() => {
		jest.clearAllMocks();
		(useSettingsContext as jest.Mock).mockReturnValue({
			settings: mockSettings,
			setSyncedSettings: setSyncedSettingsMock,
			syncedSettingsRef: { current: mockSettings },
		});
	});

	it("should return settings, replaceSettings and updateSettings method", () => {
		const { result } = renderHook(() => useSettingsInternal());

		expect(result.current.settings).toEqual(mockSettings);
		expect(result.current.replaceSettings).toBeDefined();
		expect(result.current.updateSettings).toBeDefined();
		expect(typeof result.current.replaceSettings).toBe("function");
		expect(typeof result.current.updateSettings).toBe("function");
	});

	it("should update settings using deepClone and getCombinedConfig", () => {
		const mockUpdatedFields: Settings | Styles = {
			general: { secondaryColor: "black" },
		};
		const mockCombinedConfig: Settings | Styles = {
			general: { primaryColor: "red", secondaryColor: "black" },
		};

		(getCombinedConfig as jest.Mock).mockReturnValue(mockCombinedConfig);
		(deepClone as jest.Mock).mockReturnValue(mockCombinedConfig);

		const { result } = renderHook(() => useSettingsInternal());

		act(() => {
			result.current.updateSettings(mockUpdatedFields);
		});

		expect(getCombinedConfig).toHaveBeenCalledWith(
			mockUpdatedFields,
			mockSettings
		);
		expect(deepClone).toHaveBeenCalledWith(mockCombinedConfig);
		expect(setSyncedSettingsMock).toHaveBeenCalledWith(mockCombinedConfig);
	});

	it("should handle updateSettings with empty fields", () => {
		(getCombinedConfig as jest.Mock).mockReturnValue(mockSettings);
		(deepClone as jest.Mock).mockReturnValue(mockSettings);

		const { result } = renderHook(() => useSettingsInternal());

		act(() => {
			result.current.updateSettings({});
		});

		expect(getCombinedConfig).not.toHaveBeenCalledWith({}, mockSettings);
		expect(deepClone).not.toHaveBeenCalledWith(mockSettings);
		expect(setSyncedSettingsMock).not.toHaveBeenCalledWith(mockSettings);
	});

	it("should replace settings with new settings object", () => {
		const newSettings: Settings = { general: { primaryColor: "blue" } };
		const { result } = renderHook(() => useSettingsInternal());

		act(() => {
			result.current.replaceSettings(newSettings);
		});

		expect(setSyncedSettingsMock).toHaveBeenCalledWith(newSettings);
	});

	it("should replace settings with callback function correctly", () => {
		const { result } = renderHook(() => useSettingsInternal());

		act(() => {
			result.current.replaceSettings((currentSettings) => ({
				...currentSettings,
				general: {
					...currentSettings.general,
					primaryColor: "blue",
				}
			}));
		});

		expect(setSyncedSettingsMock).toHaveBeenCalledWith({
			...mockSettings,
			general: {
				...mockSettings.general,
				primaryColor: "blue",
			}
		});
	});
});
