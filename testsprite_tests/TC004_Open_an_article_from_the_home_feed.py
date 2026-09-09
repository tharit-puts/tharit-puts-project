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
        
        # -> Click the article card titled 'The Art of Mindfulness: Finding Peace in a Busy World' on the home page to open its detail page.
        # The Art of Mindfulness: Finding Peace in a Busy... link
        elem = page.get_by_role("link", name="The Art of Mindfulness:").first
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The browser navigated to and opened the article detail URL /post/25.
        # Assert-outcome: passed
        # Assert: URL contains /post/25 indicating the article detail page opened.
        await expect(page).to_have_url(re.compile("/post/25"), timeout=15000), "URL contains /post/25 indicating the article detail page opened."
        
        # --> The article title 'The Art of Mindfulness: Finding Peace in a Busy World' is visible on the page.
        # Assert-outcome: passed
        # Assert: The page contains the expected article title text.
        await expect(page.locator("#root").nth(0)).to_contain_text("The Art of Mindfulness: Finding Peace in a Busy World", timeout=15000), "The page contains the expected article title text."
        
        # --> An article image with alt text 'Thompson P.' is visible on the page.
        await page.get_by_role("img", name="Thompson P.").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The article image (alt='Thompson P.') is visible.
        await expect(page.get_by_role("img", name="Thompson P.").nth(0)).to_be_visible(timeout=15000), "The article image (alt='Thompson P.') is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    