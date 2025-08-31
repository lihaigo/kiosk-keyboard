describe("Content UI Injection", () => {
  it("should locate the injected content UI div on example.com`", async () => {
    await browser.url("https://example.com");

    const contentUIDiv = await $("#kiosk-keyboard-root").getElement();
    await expect(contentUIDiv).toBeDisplayed();
  });
});
