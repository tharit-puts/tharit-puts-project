
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** tharit-puts-project
- **Date:** 2026-09-09
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

### Requirement: User Login

#### Test TC001 Log in with valid credentials
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/ee28ec57-18cc-46de-aa7d-008a0d28aa79
- **Status:** ❌ Failed
- **Analysis / Findings:** TestSprite logged in with a guessed credential pair (`example@gmail.com` / `password123`) that does not correspond to any real seeded account in the database, so the backend correctly rejected it with "Incorrect email, username, or password." This is a test-data gap, not an application bug — the login endpoint behaved correctly by rejecting unknown credentials.

#### Test TC018 Reject invalid login credentials
- **Status:** Not executed (dev-mode run capped at the 15 highest-priority tests; this Medium-priority case was not selected)

---

### Requirement: User Registration

#### Test TC002 Sign up with a new account
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/e2620ed1-82ce-4512-9306-abc3f37ea1d8
- **Status:** ✅ Passed
- **Analysis / Findings:** Registration with a unique name/username/email/password succeeded and correctly landed on the "Registration success" confirmation page.

---

### Requirement: Browse and Search Articles

#### Test TC004 Open an article from the home feed
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/66d84c3d-91cb-43b0-83ef-ef4594b8e7dd
- **Status:** ✅ Passed
- **Analysis / Findings:** Clicking an article card correctly navigated to `/post/25` and rendered the title and author image.

#### Test TC005 Browse the home feed by category and search
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/8c6deda6-fda8-4447-962f-199cc98bfe2a
- **Status:** ✅ Passed
- **Analysis / Findings:** Category filter and keyword search both updated the visible article list correctly.

#### Test TC011 Move through article pagination
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/26b40b36-d0b3-4dc6-8ff4-54f1bd13b527
- **Status:** ✅ Passed
- **Analysis / Findings:** The "View more" pagination control correctly loaded older articles.

---

### Requirement: Read Article Detail

#### Test TC003 Read a published article with author details
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/6569973f-7e62-41f1-bb3b-2836eeaf0710
- **Status:** ✅ Passed
- **Analysis / Findings:** Article content and author name rendered correctly on the detail page.

#### Test TC006 Like an article from the detail page
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/204b347e-f879-4311-9923-263a1fe9540d
- **Status:** ✅ Passed
- **Analysis / Findings:** Clicking like correctly incremented the like count from 233 to 234.

#### Test TC007 Comment on an article while signed in
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/d3aae5f2-a078-4c0b-91d3-8aeb36a26a8f
- **Status:** ⛔ Blocked
- **Analysis / Findings:** Blocked upstream by the same invalid guessed login credentials as TC001 — the test never reached the comment form. Not an application defect.

#### Test TC008 Prompt for login when commenting while signed out
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/73abe1c0-133c-4d2b-b4a7-454e928cb9f6
- **Status:** ✅ Passed
- **Analysis / Findings:** Attempting to comment while signed out correctly opened the "Create an account to continue" modal.

---

### Requirement: Create Article

#### Test TC009 Publish a new article
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/70f3d6e8-33ab-460f-b9af-73afa406f2a5
- **Status:** ✅ Passed
- **Analysis / Findings:** Unlike the login-dependent tests, this one worked around the missing credentials by self-registering a brand-new account first, then created and published an article with a properly formatted `## 1. ` heading. The "Article published" success toast and the article appearing in the management list were both verified.

#### Test TC010 Create and save a draft article
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/4efccef4-a131-4468-95e7-74d5705f2e8f
- **Status:** ⛔ Blocked
- **Analysis / Findings:** Blocked by the same invalid guessed login credentials as TC001 (this test used login instead of self-registering, unlike TC009).

---

### Requirement: Profile Management

#### Test TC012 Update profile details successfully
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/294fa3d4-c4bc-437a-98fe-e1b9bdde3264
- **Status:** ⛔ Blocked
- **Analysis / Findings:** Blocked upstream by invalid guessed login credentials.

---

### Requirement: Edit / Manage Articles

#### Test TC013 Update an existing article from the management list
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/34efeeb7-39b2-443c-8d35-90b4c5dfb9fe
- **Status:** ⛔ Blocked
- **Analysis / Findings:** Blocked upstream by invalid guessed login credentials.

#### Test TC015 Delete an article from the management list
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/8c0e2df9-a40e-463d-851c-d6491d42d8ff
- **Status:** ⛔ Blocked
- **Analysis / Findings:** Blocked upstream by invalid guessed login credentials.

---

### Requirement: Reset Password

#### Test TC014 Change password successfully
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/21cd8643-b6c8-5370-a6fe-98deae3c1cba/test/71dad89f-1c4f-4092-8119-6cd70cba45e1
- **Status:** ⛔ Blocked
- **Analysis / Findings:** Blocked upstream by invalid guessed login credentials.

---

## 3️⃣ Coverage & Matching Metrics

- **53.33%** of tests passed (8/15); **6.67%** failed (1/15); **40.00%** blocked (6/15)
- 12 of 27 generated test cases were not executed (dev-server mode caps execution at the 15 highest-priority tests to avoid overloading the Vite dev server)

| Requirement                   | Total Tests | ✅ Passed | ❌ Failed | ⛔ Blocked |
|--------------------------------|-------------|-----------|-----------|------------|
| User Login                     | 1           | 0         | 1         | 0          |
| User Registration              | 1           | 1         | 0         | 0          |
| Browse and Search Articles     | 3           | 3         | 0         | 0          |
| Read Article Detail            | 3           | 2         | 0         | 1          |
| Create Article                 | 2           | 1         | 0         | 1          |
| Profile Management             | 1           | 0         | 0         | 1          |
| Edit / Manage Articles         | 2           | 0         | 0         | 2          |
| Reset Password                 | 1           | 0         | 0         | 1          |
| **Total**                      | **15**      | **8**     | **1**     | **6**      |

---

## 4️⃣ Key Gaps / Risks

- **Single root cause behind almost every non-pass:** TestSprite had no real seeded test account to log in with, so it guessed `example@gmail.com` / `password123`. That single wrong guess cascaded into 1 failure + 6 blocked tests (login, comment, draft creation, profile update, article edit/delete, password reset) — none of these represent application bugs. **Action for next run:** supply a known-good test account via `additionalInstruction`, or seed one specifically for TestSprite before running.
- **TC009 shows the workaround already exists in the suite**: it self-registered a fresh account instead of relying on login, and passed cleanly. The other login-dependent tests could be made resilient the same way, or the test plan could be re-run once real credentials are supplied.
- **All-visitor/logged-out flows are solid**: browsing, search, pagination, reading an article, liking, and the logged-out comment prompt all passed without issue — these don't depend on the missing credentials.
- **Not yet covered by this run** (excluded by the 15-test dev-mode cap): admin category CRUD (TC021, TC024, TC026, TC027), notifications (TC020, TC022), duplicate-registration rejection (TC016), invalid-login-credentials rejection (TC018), publish-without-heading rejection (TC019), missing-required-field validation on create (TC017), and duplicate-username-on-profile rejection (TC023). Re-running against a production build (`npm run build && npm run preview`) would lift the cap to 30 tests and pick up more of these.
