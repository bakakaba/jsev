import { exportModules } from "./exporter";

describe("#exportModules(__dirname)", () => {
  it("should export module", async () => {
    const modules = await exportModules(__dirname);
    expect(modules.exporter).toBeTruthy();
  });
});
