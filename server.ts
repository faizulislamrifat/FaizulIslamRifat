/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const MODEL_UPGRADES: Record<string, string> = {
  "gemini-2.5-flash": "gemini-3-flash-preview",
  "gemini-2.5-pro": "gemini-3.1-pro-preview",
  "gemini-3-pro-preview": "gemini-3.1-pro-preview",
  "gemini-2.0-flash": "gemini-3-flash-preview",
  "gemini-2.0-flash-exp": "gemini-3-flash-preview",
};

function resolveModel(model?: string): string {
  if (!model) return "gemini-3-flash-preview";
  return MODEL_UPGRADES[model] || model;
}

function serializeGenerateContentResponse(r: any) {
  return {
    candidates: r?.candidates,
    promptFeedback: r?.promptFeedback,
    usageMetadata: r?.usageMetadata,
    modelVersion: r?.modelVersion,
    responseId: r?.responseId,
    text: r?.text,
    functionCalls: r?.functionCalls,
    data: r?.data,
    executableCode: r?.executableCode,
    codeExecutionResult: r?.codeExecutionResult,
  };
}

const chats = new Map<string, any>();
const videoOps = new Map<string, any>();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  for (const dir of ["examples", "assets", "public"]) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      app.use(`/${dir}`, express.static(dirPath));
    }
  }

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  /* ============================================================
     NEWSLETTER SUBSCRIPTIONS STORAGE & MOCK API
     ============================================================ */
  const DATA_DIR = path.join(process.cwd(), "data");
  const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, "subscriptions.json");

  // Helper to read subscriptions safely from JSON file
  function getSubscriptions(): Array<{ id: string; email: string; timestamp: string; source?: string }> {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify([], null, 2), "utf-8");
        return [];
      }
      const data = fs.readFileSync(SUBSCRIPTIONS_FILE, "utf-8");
      return JSON.parse(data) || [];
    } catch (err) {
      console.error("[Newsletter] Failed to read subscriptions:", err);
      return [];
    }
  }

  // Helper to write subscriptions safely to JSON file
  function saveSubscriptions(subs: Array<any>): boolean {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subs, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("[Newsletter] Failed to write subscriptions:", err);
      return false;
    }
  }

  // POST /api/newsletter/subscribe
  app.post("/api/newsletter/subscribe", (req, res): any => {
    try {
      const { email, source } = req.body || {};
      const normalizedEmail = (typeof email === "string" ? email : "").trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email address. Please provide a valid email format.",
        });
      }

      const subscriptions = getSubscriptions();
      const existing = subscriptions.find((s) => s.email.toLowerCase() === normalizedEmail);

      if (existing) {
        return res.status(200).json({
          success: true,
          alreadySubscribed: true,
          message: "You are already subscribed to the newsletter!",
          email: normalizedEmail,
          totalSubscribers: subscriptions.length,
          subscribedAt: existing.timestamp,
        });
      }

      const newSubscriber = {
        id: "sub_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        email: normalizedEmail,
        timestamp: new Date().toISOString(),
        source: typeof source === "string" ? source : "footer",
      };

      subscriptions.push(newSubscriber);
      saveSubscriptions(subscriptions);

      console.log(`[Newsletter] New subscriber added: ${normalizedEmail} (Total: ${subscriptions.length})`);

      return res.status(201).json({
        success: true,
        alreadySubscribed: false,
        message: "Thank you for subscribing! Check your inbox soon for updates.",
        email: normalizedEmail,
        totalSubscribers: subscriptions.length,
        subscriber: newSubscriber,
      });
    } catch (error: any) {
      console.error("[Newsletter] Subscription error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Internal server error while saving subscription.",
      });
    }
  });

  // GET /api/newsletter/subscriptions (retrieve stored subscriptions from JSON file)
  app.get("/api/newsletter/subscriptions", (_req, res) => {
    const subs = getSubscriptions();
    res.json({
      success: true,
      count: subs.length,
      storageFile: "data/subscriptions.json",
      subscribers: subs,
    });
  });

  app.post("/api/generate-content", async (req, res): Promise<any> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "API key is not configured. Please add your GEMINI_API_KEY in Settings > Secrets.",
        });
      }
      const ai = new GoogleGenAI({ apiKey });
      const params = { ...req.body, model: resolveModel(req.body?.model) };
      const response = await ai.models.generateContent(params);
      return res.json(serializeGenerateContentResponse(response));
    } catch (error: any) {
      console.error("[Backend] /api/generate-content error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate content." });
    }
  });

  app.post("/api/generate-content-stream", async (req, res): Promise<any> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "API key is not configured. Please add your GEMINI_API_KEY in Settings > Secrets.",
        });
      }
      const ai = new GoogleGenAI({ apiKey });
      const params = { ...req.body, model: resolveModel(req.body?.model) };
      const stream = await ai.models.generateContentStream(params);
      res.setHeader("Content-Type", "application/x-ndjson");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      for await (const chunk of stream) {
        res.write(JSON.stringify(serializeGenerateContentResponse(chunk)) + "\n");
      }
      res.end();
    } catch (error: any) {
      console.error("[Backend] /api/generate-content-stream error:", error);
      if (!res.headersSent) {
        return res.status(500).json({ error: error.message || "Failed to stream content." });
      }
      res.end();
    }
  });

  app.post("/api/chat-message", async (req, res): Promise<any> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "API key is not configured. Please add your GEMINI_API_KEY in Settings > Secrets.",
        });
      }
      const { sessionId, model, config, history, message, msgConfig } = req.body || {};
      const ai = new GoogleGenAI({ apiKey });
      let chat = sessionId ? chats.get(sessionId) : undefined;
      if (!chat) {
        chat = ai.chats.create({
          model: resolveModel(model),
          config,
          history,
        });
        if (sessionId) chats.set(sessionId, chat);
      }
      const response = await chat.sendMessage({ message, config: msgConfig });
      return res.json(serializeGenerateContentResponse(response));
    } catch (error: any) {
      console.error("[Backend] /api/chat-message error:", error);
      return res.status(500).json({ error: error.message || "Failed to send chat message." });
    }
  });

  app.post("/api/chat-stream", async (req, res): Promise<any> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "API key is not configured. Please add your GEMINI_API_KEY in Settings > Secrets.",
        });
      }
      const { sessionId, model, config, history, message, msgConfig } = req.body || {};
      const ai = new GoogleGenAI({ apiKey });
      let chat = sessionId ? chats.get(sessionId) : undefined;
      if (!chat) {
        chat = ai.chats.create({
          model: resolveModel(model),
          config,
          history,
        });
        if (sessionId) chats.set(sessionId, chat);
      }
      const stream = await chat.sendMessageStream({ message, config: msgConfig });
      res.setHeader("Content-Type", "application/x-ndjson");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      for await (const chunk of stream) {
        res.write(JSON.stringify(serializeGenerateContentResponse(chunk)) + "\n");
      }
      res.end();
    } catch (error: any) {
      console.error("[Backend] /api/chat-stream error:", error);
      if (!res.headersSent) {
        return res.status(500).json({ error: error.message || "Failed to stream chat message." });
      }
      res.end();
    }
  });

  app.post("/api/generate-images", async (req, res): Promise<any> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "API key is not configured. Please add your GEMINI_API_KEY in Settings > Secrets.",
        });
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateImages(req.body);
      return res.json(response);
    } catch (error: any) {
      console.error("[Backend] /api/generate-images error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate images." });
    }
  });

  app.post("/api/generate-videos", async (req, res): Promise<any> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "API key is not configured. Please add your GEMINI_API_KEY in Settings > Secrets.",
        });
      }
      const ai = new GoogleGenAI({ apiKey });
      const body = { ...req.body };
      if (body.video?.uri && String(body.video.uri).includes("/api/video-download?b64=")) {
        const b64Part = String(body.video.uri).split("b64=")[1]?.split("&")[0] || "";
        if (b64Part) {
          body.video = { ...body.video, uri: Buffer.from(b64Part, "base64url").toString("utf-8") };
        }
      }
      const op = await ai.models.generateVideos(body);
      if (op.name) {
        videoOps.set(op.name, op);
      }
      return res.json({
        name: op.name,
        done: op.done,
        metadata: op.metadata,
        error: op.error,
        response: op.response,
      });
    } catch (error: any) {
      console.error("[Backend] /api/generate-videos error:", error);
      return res.status(500).json({ error: error.message || "Failed to start video generation." });
    }
  });

  app.post("/api/videos-operation", async (req, res): Promise<any> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "API key is not configured. Please add your GEMINI_API_KEY in Settings > Secrets.",
        });
      }
      const ai = new GoogleGenAI({ apiKey });
      const opName = req.body?.operation?.name;
      const storedOp = opName ? videoOps.get(opName) : undefined;
      if (!storedOp) {
        return res.status(404).json({ error: "Video operation not found on server." });
      }
      const op = await ai.operations.getVideosOperation({ operation: storedOp });
      if (op.name) {
        videoOps.set(op.name, op);
      }
      const responseCopy = op.response ? JSON.parse(JSON.stringify(op.response)) : undefined;
      if (op.done && responseCopy?.generatedVideos) {
        for (const gv of responseCopy.generatedVideos) {
          if (gv.video?.uri) {
            const b64 = Buffer.from(gv.video.uri, "utf-8").toString("base64url");
            gv.video.uri = `/api/video-download?b64=${b64}`;
          }
        }
      }
      return res.json({
        name: op.name,
        done: op.done,
        metadata: op.metadata,
        error: op.error,
        response: responseCopy,
      });
    } catch (error: any) {
      console.error("[Backend] /api/videos-operation error:", error);
      return res.status(500).json({ error: error.message || "Failed to poll video operation." });
    }
  });

  app.get("/api/video-download", async (req, res): Promise<any> => {
    try {
      const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || "").trim();
      if (!apiKey) {
        return res.status(503).json({ error: "API key is not configured." });
      }
      let rawUri = "";
      if (req.query.b64) {
        rawUri = Buffer.from(String(req.query.b64).split("&")[0], "base64url").toString("utf-8");
      } else {
        rawUri = String(req.query.uri || "").split("&key=")[0];
      }
      if (!rawUri) {
        return res.status(400).json({ error: "Missing uri parameter." });
      }
      const sep = rawUri.includes("?") ? "&" : "?";
      const downloadUrl = `${rawUri}${sep}key=${apiKey}`;
      const upstream = await fetch(downloadUrl);
      if (!upstream.ok) {
        const errText = await upstream.text().catch(() => "");
        return res.status(upstream.status).send(errText || upstream.statusText);
      }
      res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
      const arrayBuf = await upstream.arrayBuffer();
      return res.send(Buffer.from(arrayBuf));
    } catch (error: any) {
      console.error("[Backend] /api/video-download error:", error);
      return res.status(500).json({ error: error.message || "Failed to download video." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    app.use((req, _res, next) => {
      if (req.method === "GET" && !req.path.includes(".") && req.path !== "/") {
        const potentialHtml = path.join(process.cwd(), `${req.path.slice(1)}.html`);
        if (fs.existsSync(potentialHtml)) {
          req.url = `${req.path}.html`;
        }
      }
      next();
    });

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { extensions: ["html"] }));
    app.use((req, res) => {
      const cleanPath = req.path.replace(/^\//, "");
      const targetFile = path.join(distPath, `${cleanPath}.html`);
      if (cleanPath && fs.existsSync(targetFile)) {
        return res.sendFile(targetFile);
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
