#!/bin/bash
git pull
export NODE_ENV=production
pnpm clean
pnpm install
pnpm build
