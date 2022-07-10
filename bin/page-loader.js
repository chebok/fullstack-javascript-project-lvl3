#!/usr/bin/env node
import { program } from 'commander';
import pageLoad from '../src/pageLoad.js';

const command = (url) => pageLoad(url, program.opts().output)
  .then(console.log).catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0')
  .argument('<url>')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")')
  .action(command);
program.parse();
