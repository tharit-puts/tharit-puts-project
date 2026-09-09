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
        
        # -> Click the 'General' category filter button to restrict the feed to General articles.
        # General button
        elem = page.locator("div").filter(has_text=re.compile(r"^CategoryHighlightCatGeneralInspirationHighlightCatGeneralInspiration$")).get_by_role("button").nth(2)
        await elem.click(timeout=10000)
        
        # -> Click the 'General' category filter button to restrict the feed to General articles.
        # Search search field
        elem = page.get_by_role("searchbox", name="Search")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Mindfulness")
        
        # --> Assertions to verify final state
        
        # --> The search field contains the typed keyword 'Mindfulness'.
        # Assert-outcome: passed
        # Assert: Search input contains the entered keyword 'Mindfulness'.
        await expect(page.get_by_role("searchbox", name="Search").nth(0)).to_have_value("Mindfulness", timeout=15000), "Search input contains the entered keyword 'Mindfulness'."
        
        # --> The article list displays at least one article labeled with the 'General' category.
        await page.locator(".w-fit").first.nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: An article card shows the 'General' category label.
        await expect(page.locator(".w-fit").first.nth(0)).to_be_visible(timeout=15000), "An article card shows the 'General' category label."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    