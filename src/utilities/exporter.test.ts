import { exportModules, exportModulesSync } from "./exporter";

describe("#exportModules(__dirname)", () => {
  it("should export module", async () => {
    const modules = await exportModules(__dirname);
    expect(modules.exporter).toBeTruthy();
  });
});

describe("#exportModulesSync(__dirname)", () => {
  it("should export module", () => {
    const modules = exportModulesSync(__dirname);
    expect(modules.exporter).toBeTruthy();
  });
});