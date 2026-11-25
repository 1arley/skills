import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";
import { decideOffline, handoffQuestion, inputSchema } from "../scripts/handoff-advisor.js";

const packageDir = new URL("..", import.meta.url).pathname;
const cli = join(packageDir, "node_modules", "tsx", "dist", "cli.mjs");
const script = join(packageDir, "scripts", "handoff-advisor.ts");

const catalog = [
  { name: "grill-with-jev", description: "Maps a decision tree and asks the frontier in rounds." },
  { name: "tdd", description: "Test-driven development.", restriction: "explicit invocation only" },
];

test("input rejects empty step and entries missing description", () => {
  assert.ok(inputSchema.safeParse({ step: "run tests", catalog }).success);
  assert.ok(!inputSchema.safeParse({ step: "", catalog }).success);
  assert.ok(!inputSchema.safeParse({ step: "s", catalog: [{ name: "x" }] }).success);
  assert.ok(!inputSchema.safeParse({ step: "s", catalog: [...catalog, ...catalog] }).success);
});

test("empty catalog is 'none' before any provider call", () => {
  const out = decideOffline({ step: "run tests", catalog: [] });
  assert.equal(out.status, "none");
});

test("offline mock picks the first catalog entry and stays scoped to one skill", () => {
  const out = decideOffline({ step: "run tests", catalog });
  assert.equal(out.status, "next_skill");
  assert.equal(out.capability, "grill-with-jev");
  assert.equal(out.additional_work, "unassessed");
});

test("question wires every candidate as a choice criterion plus 'none'", () => {
  const { state, body } = handoffQuestion({ step: "implement the port", catalog });
  const question = body.questions.H1;
  assert.equal(question.type, "choice");
  assert.deepEqual(Object.keys(question.criteria).sort(), ["grill-with-jev", "none", "tdd"]);
  assert.match(question.criteria.tdd, /\(explicit invocation only\)/);
  assert.match(state, /implement the port/);
});

test("--no-tax lets the advisor call run without local pricing", async () => {
  let requests = 0;
  const server = createServer((req, res) => {
    requests++;
    req.resume();
    req.on("end", () => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ answers: { H1: { type: "choice", choice: "grill-with-jev", confidence: 0.95, probabilities: { "grill-with-jev": 0.95, none: 0.05 } } } }));
    });
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); assert.ok(address && typeof address === "object");
  const endpoint = `http://127.0.0.1:${address.port}/v1`;
  const dir = await mkdtemp(join(tmpdir(), "jev-advisor-no-tax-"));
  const home = await mkdtemp(join(tmpdir(), "jev-home-"));
  try {
    await mkdir(join(home, ".config", "jev"), { recursive: true });
    await writeFile(join(home, ".config", "jev", "config.json"), JSON.stringify({ provider: "typesafe", apiKey: "local-canary", model: "jev-latest", baseUrl: endpoint, customBaseUrlConfirmed: endpoint }));
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn(process.execPath, [cli, script, "--no-tax"], { cwd: dir, env: { PATH: process.env.PATH, HOME: home }, stdio: ["pipe", "pipe", "pipe"] });
      let stdout = "", stderr = "";
      child.stdout.on("data", chunk => stdout += chunk); child.stderr.on("data", chunk => stderr += chunk);
      child.on("error", reject); child.on("close", () => resolve({ stdout, stderr }));
      child.stdin.end(JSON.stringify({ step: "choose the next tool", catalog: [{ name: "grill-with-jev", description: "Grill decisions." }] }));
    });
    assert.equal(JSON.parse(result.stdout).status, "next_skill", result.stderr);
    assert.equal(requests, 1);
  } finally {
    await rm(dir, { recursive: true, force: true }); await rm(home, { recursive: true, force: true });
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

test("advisor rejects non-System-One credentials before any request", async () => {
  const dir = await mkdtemp(join(tmpdir(), "jev-advisor-provider-guard-"));
  const home = await mkdtemp(join(tmpdir(), "jev-home-"));
  const endpoint = "http://127.0.0.1:1/v1";
  try {
    await mkdir(join(home, ".config", "jev"), { recursive: true });
    await writeFile(join(home, ".config", "jev", "config.json"), JSON.stringify({ provider: "openai", apiKey: "local-canary", model: "gpt-test", baseUrl: endpoint, customBaseUrlConfirmed: endpoint }));
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn(process.execPath, [cli, script, "--no-tax"], { cwd: dir, env: { PATH: process.env.PATH, HOME: home }, stdio: ["pipe", "pipe", "pipe"] });
      let stdout = "", stderr = "";
      child.stdout.on("data", chunk => stdout += chunk); child.stderr.on("data", chunk => stderr += chunk);
      child.on("error", reject); child.on("close", () => resolve({ stdout, stderr }));
      child.stdin.end(JSON.stringify({ step: "choose the next tool", catalog: [{ name: "grill-with-jev", description: "Grill decisions." }] }));
    });
    assert.deepEqual(JSON.parse(result.stdout), { status: "error", reason: "advisor requires a System One provider", provider: "openai" });
    assert.equal(result.stderr, "");
  } finally { await rm(dir, { recursive: true, force: true }); await rm(home, { recursive: true, force: true }); }
});

test("advisor errors discard untrusted usage fields", async () => {
  const marker = "private provider diagnostic";
  const server = createServer((req, res) => {
    req.resume();
    req.on("end", () => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ answers: {}, usage: { debug: marker } }));
    });
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address(); assert.ok(address && typeof address === "object");
  const endpoint = `http://127.0.0.1:${address.port}/v1`;
  const dir = await mkdtemp(join(tmpdir(), "jev-advisor-usage-"));
  const home = await mkdtemp(join(tmpdir(), "jev-home-"));
  try {
    await mkdir(join(home, ".config", "jev"), { recursive: true });
    await writeFile(join(home, ".config", "jev", "config.json"), JSON.stringify({ provider: "typesafe", apiKey: "local-canary", model: "jev-latest", baseUrl: endpoint, customBaseUrlConfirmed: endpoint }));
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn(process.execPath, [cli, script, "--no-tax"], { cwd: dir, env: { PATH: process.env.PATH, HOME: home }, stdio: ["pipe", "pipe", "pipe"] });
      let stdout = "", stderr = "";
      child.stdout.on("data", chunk => stdout += chunk); child.stderr.on("data", chunk => stderr += chunk);
      child.on("error", reject); child.on("close", () => resolve({ stdout, stderr }));
      child.stdin.end(JSON.stringify({ step: "choose the next tool", catalog: [{ name: "grill-with-jev", description: "Grill decisions." }] }));
    });
    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "error");
    assert.deepEqual(output.usage, {});
    assert.equal(`${result.stdout}${result.stderr}`.includes(marker), false);
  } finally {
    await rm(dir, { recursive: true, force: true }); await rm(home, { recursive: true, force: true });
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
