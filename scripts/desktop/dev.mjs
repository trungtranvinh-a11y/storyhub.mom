import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import waitOn from "wait-on";

const root = process.cwd();
const nextPort = 3000;
const appUrl = `http://127.0.0.1:${nextPort}`;

const nextProcess = spawn(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(nextPort)],
  {
    cwd: root,
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      NEXTAUTH_URL: appUrl,
      AUTH_TRUST_HOST: "true",
    },
  },
);

function cleanup() {
  if (nextProcess.killed) {
    return;
  }

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(nextProcess.pid), "/T", "/F"], {
      windowsHide: true,
    });
  } else {
    nextProcess.kill("SIGTERM");
  }
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);

await waitOn({
  resources: [appUrl],
  timeout: 30000,
});

const electronBin = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "electron.cmd" : "electron");

const electronProcess = spawn(electronBin, ["."], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    APP_SERVER_URL: appUrl,
  },
});

electronProcess.on("exit", (code) => {
  cleanup();
  process.exit(code ?? 0);
});
