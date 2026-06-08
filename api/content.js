const crypto = require("crypto");

const DEFAULT_REPO = "glebbashlakov0-ship-it/OnlyBrokers";
const DEFAULT_BRANCH = "main";
const DEFAULT_CONTENT_PATH = "data/content.json";
const DEFAULT_UPLOAD_DIR = "assets/uploads";
const DEFAULT_PASSWORD_HASH = "3a0d5783d368406c2a170c7f15e20c14b0e49428420e9380a86dad740c3e9333";

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function timingSafeEqualString(left, right) {
  const leftBuffer = Buffer.from(left || "", "hex");
  const rightBuffer = Buffer.from(right || "", "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD_SHA256 || DEFAULT_PASSWORD_HASH;
  return timingSafeEqualString(sha256(password || ""), expected);
}

function env(name, fallback) {
  return process.env[name] || fallback;
}

async function readBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function github(path, options = {}) {
  const repo = env("GITHUB_REPO", DEFAULT_REPO);
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured in Vercel env.");
  }

  const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `GitHub API error ${response.status}`);
  }

  return data;
}

async function getGithubFile(path) {
  const branch = env("GITHUB_BRANCH", DEFAULT_BRANCH);
  return github(`/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(branch)}`);
}

async function putGithubFile(path, message, content, sha) {
  const branch = env("GITHUB_BRANCH", DEFAULT_BRANCH);
  const payload = {
    message,
    branch,
    content: Buffer.from(content).toString("base64")
  };

  if (sha) {
    payload.sha = sha;
  }

  return github(`/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

function parseContentFile(file) {
  const raw = Buffer.from(file.content || "", "base64").toString("utf8");
  const data = JSON.parse(raw);
  return data && typeof data === "object" ? data : { text: {}, images: {} };
}

function normalizeUploadName(name, fallback) {
  const extension = (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "") || fallback;
  return `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${base}.${extension}`;
}

async function saveUploads(uploads, content) {
  const uploadDir = env("UPLOAD_DIR", DEFAULT_UPLOAD_DIR).replace(/\/+$/, "");

  for (const [key, upload] of Object.entries(uploads || {})) {
    if (!upload?.data || !upload?.name) {
      continue;
    }

    const match = String(upload.data).match(/^data:([^;]+);base64,(.+)$/);
    if (!match || !match[1].startsWith("image/")) {
      throw new Error("Uploaded files must be images.");
    }

    const fileName = normalizeUploadName(upload.name, key);
    const path = `${uploadDir}/${fileName}`;
    const binary = Buffer.from(match[2], "base64");

    await putGithubFile(path, `Upload ${key} image`, binary, null);
    content.images[key] = path;
  }
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const file = await getGithubFile(env("CONTENT_PATH", DEFAULT_CONTENT_PATH));
      return json(res, 200, { ok: true, content: parseContentFile(file), sha: file.sha });
    }

    if (req.method !== "POST") {
      return json(res, 405, { ok: false, error: "Method not allowed" });
    }

    const body = JSON.parse(await readBody(req) || "{}");

    if (!checkPassword(body.password)) {
      return json(res, 401, { ok: false, error: "Неверный пароль." });
    }

    if (body.action === "verify") {
      return json(res, 200, { ok: true });
    }

    const contentPath = env("CONTENT_PATH", DEFAULT_CONTENT_PATH);
    const file = await getGithubFile(contentPath);
    const current = parseContentFile(file);
    const next = {
      text: { ...(current.text || {}), ...(body.content?.text || {}) },
      images: { ...(current.images || {}), ...(body.content?.images || {}) }
    };

    await saveUploads(body.uploads || {}, next);

    const saved = await putGithubFile(
      contentPath,
      "Update editable site content",
      JSON.stringify(next, null, 2) + "\n",
      file.sha
    );

    return json(res, 200, {
      ok: true,
      commit: saved?.commit?.sha || null,
      message: "Сохранено. Vercel обновит сайт после автодеплоя GitHub."
    });
  } catch (error) {
    return json(res, 500, { ok: false, error: error.message || "Unknown error" });
  }
};
