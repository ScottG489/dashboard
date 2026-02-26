import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 30000,
  env: {
    backendUrl: "https://api.conjob.io/job/run?image=scottg489/gh-repo-build-status-job:latest&remove=true",
  },
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
  },
});
