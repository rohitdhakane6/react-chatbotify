import React from "react";

import { expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/jest-globals";

import UserMessage from "../../../src/components/ChatBotBody/UserMessage/UserMessage";
// import { DefaultSettings } from "../../../src/constants/internal/DefaultSettings";
import { Message } from "../../../src/types/Message";

import { TestChatBotProvider } from "../../__mocks__/TestChatBotContext";

/**
 * Helper function to render UserMessage with different settings and message content.
 *
 * @param message Message object to render
 * @param isNewSender boolean indicating if this message is from a new sender
 * @param settings custom settings to override defaults
 */
const renderUserMessage = (
	message: Message,
	isNewSender: boolean = true,
	settings: any = {}
) => {
	const initialSettings = {
		general: {
			primaryColor: "#007bff",
			...settings.general
		},
		userBubble: {
			showAvatar: false,
			animate: true,
			avatar: "test-avatar.png",
			...settings.userBubble
		},
		...settings
	};

	const initialStyles = {
		userBubbleStyle: {},
		...settings.styles
	};

	return render(
		<TestChatBotProvider initialSettings={initialSettings} initialStyles={initialStyles}>
			<UserMessage message={message} isNewSender={isNewSender} />
		</TestChatBotProvider>
	);
};

/**
 * Test for UserMessage component.
 */
describe("UserMessage Component", () => {
	const mockStringMessage: Message = {
		id: "1",
		content: "Hello, this is a test message",
		sender: "user",
		type: "string",
		timestamp: new Date().toISOString()
	};

	const mockJSXMessage: Message = {
		id: "2",
		content: <div data-testid="custom-jsx-content">Custom JSX Content</div>,
		sender: "user",
		type: "object",
		timestamp: new Date().toISOString()
	};

	const MockContentWrapper = ({ children }: { children: React.ReactNode }) => (
		<div data-testid="content-wrapper">{children}</div>
	);

	const mockMessageWithWrapper: Message = {
		id: "3",
		content: "Wrapped content",
		sender: "user",
		type: "string",
		timestamp: new Date().toISOString(),
		contentWrapper: MockContentWrapper
	};

	it("renders string content correctly with default settings", () => {
		renderUserMessage(mockStringMessage);

		// checks that the message container is present
		const container = document.querySelector('.rcb-user-message-container');
		expect(container).toBeInTheDocument();

		// checks that the string content is rendered
		expect(screen.getByText("Hello, this is a test message")).toBeInTheDocument();

		// checks that no avatar is shown by default
		const avatar = document.querySelector('.rcb-message-user-avatar');
		expect(avatar).not.toBeInTheDocument();
	});

	it("applies correct styles for string messages", () => {
		renderUserMessage(mockStringMessage);

		// retrieves the message bubble
		const messageBubble = screen.getByText("Hello, this is a test message").closest('div');
		
		// checks default styling
		expect(messageBubble).toHaveStyle({
			backgroundColor: "#007bff",
			color: "#fff",
			maxWidth: "70%"
		});

		// checks default classes
		expect(messageBubble).toHaveClass("rcb-user-message");
		expect(messageBubble).toHaveClass("rcb-user-message-entry");
	});

	it("shows avatar when showAvatar is enabled and isNewSender is true", () => {
		const settings = {
			userBubble: {
				showAvatar: true,
				avatar: "test-avatar.png"
			}
		};

		renderUserMessage(mockStringMessage, true, settings);

		// checks that avatar is displayed
		const avatar = document.querySelector('.rcb-message-user-avatar');
		expect(avatar).toBeInTheDocument();
		expect(avatar).toHaveStyle({
			backgroundImage: 'url("test-avatar.png")'
		});

		// checks that max width is adjusted for avatar
		const messageBubble = screen.getByText("Hello, this is a test message").closest('div');
		expect(messageBubble).toHaveStyle({
			maxWidth: "65%"
		});
	});

	it("hides avatar when showAvatar is enabled but isNewSender is false", () => {
		const settings = {
			userBubble: {
				showAvatar: true,
				avatar: "test-avatar.png"
			}
		};

		renderUserMessage(mockStringMessage, false, settings);

		// checks that avatar is not displayed
		const avatar = document.querySelector('.rcb-message-user-avatar');
		expect(avatar).not.toBeInTheDocument();

		// checks offset class is applied
		const messageBubble = screen.getByText("Hello, this is a test message").closest('div');
		expect(messageBubble).toHaveClass("rcb-user-message-offset");
	});

	it("disables animation when animate setting is false", () => {
		const settings = {
			userBubble: {
				animate: false
			}
		};

		renderUserMessage(mockStringMessage, true, settings);

		// checks that animation class is not applied
		const messageBubble = screen.getByText("Hello, this is a test message").closest('div');
		expect(messageBubble).not.toHaveClass("rcb-user-message-entry");
	});

	it("renders JSX content without bubble wrapper", () => {
		renderUserMessage(mockJSXMessage);

		// checks that JSX content is rendered
		expect(screen.getByTestId("custom-jsx-content")).toBeInTheDocument();
		expect(screen.getByText("Custom JSX Content")).toBeInTheDocument();

		// checks that no bubble styling is applied to JSX content
		const customContent = screen.getByTestId("custom-jsx-content");
		expect(customContent).not.toHaveStyle({
			backgroundColor: "#007bff"
		});
	});

	it("applies content wrapper when provided", () => {
		renderUserMessage(mockMessageWithWrapper);

		// checks that content wrapper is applied
		expect(screen.getByTestId("content-wrapper")).toBeInTheDocument();
		expect(screen.getByText("Wrapped content")).toBeInTheDocument();

		// checks that wrapped content is inside the wrapper
		const wrapper = screen.getByTestId("content-wrapper");
		expect(wrapper).toContainElement(screen.getByText("Wrapped content"));
	});

	it("applies custom styles from styles context", () => {
		const settings = {
			styles: {
				userBubbleStyle: {
					borderRadius: "20px",
					fontSize: "14px",
					padding: "12px"
				}
			}
		};

		renderUserMessage(mockStringMessage, true, settings);

		// checks that custom styles are applied
		const messageBubble = screen.getByText("Hello, this is a test message").closest('div');
		expect(messageBubble).toHaveStyle({
			borderRadius: "20px",
			fontSize: "14px",
			padding: "12px"
		});
	});

	it("uses custom primary color from settings", () => {
		const settings = {
			general: {
				primaryColor: "#ff6b35"
			}
		};

		renderUserMessage(mockStringMessage, true, settings);

		// checks that custom primary color is applied
		const messageBubble = screen.getByText("Hello, this is a test message").closest('div');
		expect(messageBubble).toHaveStyle({
			backgroundColor: "#ff6b35"
		});
	});

	it("handles complex scenario with avatar, custom styles, and wrapper", () => {
		const settings = {
			general: {
				primaryColor: "#28a745"
			},
			userBubble: {
				showAvatar: true,
				avatar: "complex-avatar.png",
				animate: true
			},
			styles: {
				userBubbleStyle: {
					borderRadius: "15px",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
				}
			}
		};

		renderUserMessage(mockMessageWithWrapper, true, settings);

		// checks avatar is shown
		const avatar = document.querySelector('.rcb-message-user-avatar');
		expect(avatar).toBeInTheDocument();
		expect(avatar).toHaveStyle({
			backgroundImage: 'url("complex-avatar.png")'
		});

		// checks bubble styling - find the actual bubble div with classes
		const messageBubble = document.querySelector('.rcb-user-message.rcb-user-message-entry');
		expect(messageBubble).toBeInTheDocument();
		expect(messageBubble).toHaveStyle({
			backgroundColor: "#28a745",
			borderRadius: "15px",
			boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
			maxWidth: "65%"
		});

		// checks content wrapper
		expect(screen.getByTestId("content-wrapper")).toBeInTheDocument();

		// checks animation class
		expect(messageBubble).toHaveClass("rcb-user-message-entry");
	});

	
});