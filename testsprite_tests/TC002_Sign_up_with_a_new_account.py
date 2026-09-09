import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:5173")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Sign up' button in the page header to open the registration form.
        # Sign up button
        elem = page.get_by_role("button", name="Sign up")
        await elem.click(timeout=10000)
        
        # -> Fill the registration form fields (Name, Username, Email, Password) and click the 'Sign up' button.
        # Display name text field
        elem = page.get_by_role("textbox", name="Name", exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Autotest User 20260909")
        
        # -> Fill the registration form fields (Name, Username, Email, Password) and click the 'Sign up' button.
        # Username text field
        elem = page.get_by_role("textbox", name="Username")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("autotest20260909_01")
        
        # -> Fill the registration form fields (Name, Username, Email, Password) and click the 'Sign up' button.
        # Email text field
        elem = page.get_by_role("textbox", name="Email")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("autotest20260909_01@example.com")
        
        # -> Fill the registration form fields (Name, Username, Email, Password) and click the 'Sign up' button.
        # Password password field
        elem = page.get_by_role("textbox", name="Password")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Password123!")
        
        # -> Fill the registration form fields (Name, Username, Email, Password) and click the 'Sign up' button.
        # Sign up button
        elem = page.get_by_role("main").get_by_role("button", name="Sign up")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The registration confirmation page displays a 'Registration success' message.
        # Assert-outcome: passed
        # Assert: The confirmation card shows 'Registration success'.
        await expect(page.locator("#root").nth(0)).to_contain_text("Registration success", timeout=15000), "The confirmation card shows 'Registration success'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    