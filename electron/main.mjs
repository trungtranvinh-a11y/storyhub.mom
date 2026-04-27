import { app, BrowserWindow, shell } from "electron";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";

let mainWindow = null;
let serverProcess = null;

function resolveEnvFile() {
  const packagedPath = path.join(app.getAppPath(), "desktop-bundle", ".env");
  const devPath = path.join(app.getAppPath(), ".env");

  if (fs.existsSync(packagedPath)) {
    return packagedPath;
  }

  return devPath;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/u);
  const values = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    values[key] = rawValue.replace(/^['"]|['"]$/gu, "");
  }

  return values;
}

function findAvailablePort(start = 3210) {
  return new Promise((resolve) => {
    const tryPort = (port) => {
      const server = net.createServer();
      server.unref();
      server.on("error", () => tryPort(port + 1));
      server.listen(port, "127.0.0.1", () => {
        const address = server.address();
        server.close(() => resolve(address.port));
      });
    };

    tryPort(start);
  });
}

function waitForServer(url, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const poll = () => {
      const request = net.createConnection({
        host: "127.0.0.1",
        port: Number(new URL(url).port),
      });

      request.once("connect", () => {
        request.end();
        resolve();
      });

      request.once("error", () => {
        request.destroy();
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error("Timed out waiting for the local app server."));
          return;
        }

        setTimeout(poll, 350);
      });
    };

    poll();
  });
}

function killServerProcess() {
  if (!serverProcess || serverProcess.killed) {
    return;
  }

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(serverProcess.pid), "/T", "/F"], {
      windowsHide: true,
    });
  } else {
    serverProcess.kill("SIGTERM");
  }
}

async function startBundledServer() {
  const port = await findAvailablePort();
  const envFile = resolveEnvFile();
  const fileEnv = loadEnvFile(envFile);

  const appRoot = app.isPackaged ? path.join(app.getAppPath(), "desktop-bundle") : app.getAppPath();
  const standaloneRoot = path.join(appRoot, ".next", "standalone");
  const serverPath = path.join(standaloneRoot, "server.js");

  if (!fs.existsSync(serverPath)) {
    throw new Error(`Missing bundled Next.js server at ${serverPath}`);
  }

  const nextAppUrl = `http://127.0.0.1:${port}`;
  const childEnv = {
    ...process.env,
    ...fileEnv,
    NODE_ENV: "production",
    PORT: String(port),
    HOSTNAME: "127.0.0.1",
    NEXTAUTH_URL: nextAppUrl,
    AUTH_TRUST_HOST: "true",
  };

  const bundledNodePath = path.join(appRoot, "bin", process.platform === "win32" ? "node.exe" : "node");
  const hasBundledNode = fs.existsSync(bundledNodePath);

  serverProcess = spawn(hasBundledNode ? bundledNodePath : process.execPath, [serverPath], {
    cwd: standaloneRoot,
    env: {
      ...childEnv,
      ...(hasBundledNode ? {} : { ELECTRON_RUN_AS_NODE: "1" }),
    },
    stdio: "pipe",
    windowsHide: true,
  });

  serverProcess.stdout.on("data", (chunk) => {
    process.stdout.write(`[desktop-server] ${chunk}`);
  });
  serverProcess.stderr.on("data", (chunk) => {
    process.stderr.write(`[desktop-server] ${chunk}`);
  });
  serverProcess.on("exit", (code) => {
    if (!app.isQuitting) {
      console.error(`Desktop server exited early with code ${code}`);
    }
  });

  await waitForServer(nextAppUrl);
  return nextAppUrl;
}

function createWindow(appUrl) {
  mainWindow = new BrowserWindow({
    width: 1540,
    height: 980,
    minWidth: 1200,
    minHeight: 800,
    backgroundColor: "#e8f0f7",
    title: "StoryHub",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      devTools: !app.isPackaged,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.loadURL(process.env.APP_SERVER_URL || appUrl);
}

app.on("window-all-closed", () => {
  killServerProcess();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  app.isQuitting = true;
  killServerProcess();
});

app.whenReady().then(async () => {
  try {
    const appUrl = process.env.APP_SERVER_URL || (app.isPackaged ? await startBundledServer() : null);
    createWindow(appUrl || "http://127.0.0.1:3000");
  } catch (error) {
    console.error(error);
    app.quit();
  }
});
