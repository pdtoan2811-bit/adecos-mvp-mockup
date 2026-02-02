import { chromium } from 'playwright';

(async () => {
    console.log("Starting verification...");
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        console.log("Navigating to http://localhost:5173");
        await page.goto('http://localhost:5173');

        // Wait for the input to be ready
        const inputSelector = 'input[type="text"]';
        await page.waitForSelector(inputSelector);

        console.log("Typing 'hello'...");
        await page.fill(inputSelector, 'hello');
        await page.press(inputSelector, 'Enter');

        console.log("Waiting for 'Adecos' response...");
        // Wait for the "Thinking" state first
        try {
            await page.waitForSelector('text=Adecos đang suy nghĩ...', { timeout: 3000 });
            console.log("Confirmed: Thinking state appeared.");
        } catch (e) {
            console.log("Note: Thinking state might have been too fast or missed.");
        }

        // Wait for actual response text
        // The response bubble usually contains "hello" or "Adecos" response logic.
        // Let's just wait for a text bubble that is NOT the thinking state.

        // We expect the AI to respond. 
        // Let's take a screenshot after 5 seconds to be safe.
        await page.waitForTimeout(5000);

        console.log("Taking screenshot...");
        await page.screenshot({ path: 'verify_chat_result.png', fullPage: true });

        console.log("Verification finished. Screenshot saved to verify_chat_result.png");

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await browser.close();
    }
})();
