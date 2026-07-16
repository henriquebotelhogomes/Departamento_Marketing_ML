import { spawn } from "node:child_process";

function run(command: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: "inherit", shell: true });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

async function main() {
  const code = await run("npx", ["prisma", "db", "seed"]);
  process.exit(code);
}

main();
