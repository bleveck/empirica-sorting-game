# Empirica Copilot

A starter template + skill pack for creating and testing [Empirica](https://empirica.ly/) experiments with AI assistance.

## What this repo is

- An empty Empirica project structure you can use as a starting point.
- A set of Copilot Skills (under `.github/skills/`) to help with:
  - experiment specification
  - experiment implementation
  - data schema validation
  - autonomous E2E-style testing

## Current status of the skills

- **Spec + implementation skills:** these have been tested in reproducing a couple of experiments from published papers, but still need a bit of handholding. 
- **Autonomous E2E testing + verification skills:** promising, and can work with strong guidance, but **not yet ready for generic adoption** across arbitrary experiments.

## Repository layout

- `client/` – Empirica client app scaffold
- `server/` – Empirica server app scaffold
- `.github/skills/` – Copilot Skill definitions and supporting scripts

## Assumptions and safety

- This repo assumes you already have:
  - Empirica installed and runnable from your shell (`empirica`)
  - a CLI coding agent installed (Copilot CLI, Claude Code, etc.)
- Be careful with agent permissions and command execution scope.
- You are solely responsible for reviewing, monitoring, and approving agent actions in your environment.

## Quick start

1. Install dependencies in `client/` and `server/`.
2. Start your CLI coding agent in this repository.
3. Ask the agent to start building a new Empirica experiment using the skills in `.github/skills/` (or by following those `SKILL.md` files directly).
4. Run Empirica from the repo root (`empirica`) when prompted by your workflow.

## Using this repo without GitHub Copilot (e.g., Claude Code)

The skill files are plain text instructions plus helper scripts. Even if your coding agent does not support Copilot Skills natively, you can still use this repo by:

1. Opening the relevant `SKILL.md` file in `.github/skills/<skill-name>/`.
2. Copying the workflow/instructions into your agent prompt.
3. Running the referenced scripts/commands directly from the terminal.

In short: `.github/skills/` is Copilot-native packaging, but the underlying guidance and scripts are tool-agnostic.
