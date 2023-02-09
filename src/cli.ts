import {readFile} from 'fs/promises';
import {program} from 'commander';
import updateNotifier from 'update-notifier';
import {exportAction} from './action/export.js';
import {importAction} from './action/import.js';

type PackageJson = {
    name : string;
    version : string;
};

const packageJson = JSON.parse(await readFile(
    new URL('../package.json', import.meta.url),
    {encoding: 'utf-8'}
)) as PackageJson;

updateNotifier({pkg: packageJson}).notify();

program
    .name('ssm-manager')
    .description('CLI tool for managing SSM parameters')
    .version(packageJson.version);

program
    .command('export')
    .description('export a given prefix to YAML')
    .argument('<region>', 'region of the parameters')
    .argument('<prefix>', 'prefix to export')
    .option('-k, --keep-prefix', 'do not remove the prefix from parameter names')
    .option('-f, --file <file>', 'output location for YAML file')
    .action(exportAction);

program
    .command('import')
    .description('import a YAML file into SSM')
    .argument('<region>', 'region of the parameters')
    .argument('<file>', 'file to import')
    .option('-p, --prefix <prefix>', 'prefix to use for the parameters')
    .action(importAction);

await program.parseAsync();
