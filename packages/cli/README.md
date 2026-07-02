# @run402/cli

The Run402 command-line interface. Set up, diagnose, and test your integration without leaving the terminal.

```bash
npx run402 <command>
# in this monorepo:
pnpm cli <command>
```

## Commands

| Command | Description |
| --- | --- |
| `run402 init` | Interactive setup → generates a typed `run402.config.ts` |
| `run402 login` | Save your credentials to `~/.run402` |
| `run402 doctor` | Diagnose config, network, env, dependencies, Node version |
| `run402 dev` | Live request stream for your project |
| `run402 test` | Run the full 402 → payment → 200 flow end-to-end |
| `run402 status` | Project status + registered endpoints |
| `run402 logs` | Recent request logs (`--limit`, `--status`) |
| `run402 version` | CLI + Node versions |

Every command has colored output, spinners, and `--help`.

## Config resolution

The CLI resolves your project key in this order: `run402.config.ts` → saved
login (`~/.run402/credentials.json`) → `RUN402_SECRET_KEY`.

Secrets are never written into `run402.config.ts` — it reads from the
environment.
