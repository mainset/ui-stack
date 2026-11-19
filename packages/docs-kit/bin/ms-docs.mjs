#!/usr/bin/env node
import { runDocsCli } from '../dist/esm/node/cli.mjs';

runDocsCli(process.argv.slice(2));
