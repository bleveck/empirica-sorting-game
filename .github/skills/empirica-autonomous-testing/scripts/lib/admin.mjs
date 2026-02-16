export async function ensureAdminSession(page, { baseUrl, username, password }) {
  await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);

  const userInput = page.locator('input[name="username"], input[type="text"]');
  if ((await userInput.count()) === 0) return;

  await userInput.first().fill(username);
  const passInput = page.locator('input[name="password"], input[type="password"]');
  if ((await passInput.count()) > 0) {
    await passInput.first().fill(password);
  }
  const loginButton = page.getByRole("button", { name: /sign in|login/i });
  if ((await loginButton.count()) > 0) {
    await loginButton.first().click();
  }
  await page.waitForTimeout(1200);
}

export async function createAndStartBatch(page, { treatmentName, assignment = "complete" }) {
  await page.locator('[data-test="newBatchButton"]').first().click();
  await page.waitForSelector('[data-test="createBatchButton"]', { timeout: 10000 });

  if (assignment === "simple") {
    await page.locator('[data-test="simpleAssignmentButton"]').click();
  } else if (assignment === "custom") {
    await page.locator('[data-test="customAssignmentButton"]').click();
  } else {
    await page.locator('[data-test="completeAssignmentButton"]').click();
  }

  await page.selectOption('[data-test="treatmentSelect"]', { label: treatmentName });
  await page.click('[data-test="createBatchButton"]');
  await page.waitForTimeout(1800);

  const startCandidates = ['[data-test="startButton"]', 'button:has-text("Start")', 'button:has-text("Run")'];
  for (const sel of startCandidates) {
    const btn = page.locator(sel);
    if ((await btn.count()) > 0) {
      await btn.first().click();
      await page.waitForTimeout(1200);
      break;
    }
  }
}
