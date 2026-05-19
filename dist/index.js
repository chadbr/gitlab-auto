#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const addItem_1 = require("./commands/addItem");
const updateItem_1 = require("./commands/updateItem");
const listItems_1 = require("./commands/listItems");
const program = new commander_1.Command();
program
    .name('gitlab-epic-cli')
    .description('CLI to manage GitLab Epics')
    .version('0.0.1');
program.command('add-item')
    .description('Add a new Item to a repository and link it to an existing GitLab Epic')
    .requiredOption('--epic-group-path <path>', 'Path of the Group containing the Epic')
    .requiredOption('--epic-title <title>', 'Title of the Epic')
    .requiredOption('--item-title <title>', 'Title of the new Item')
    .requiredOption('--item-filename <filename>', 'Filename to read the Content/Body of the new Item from')
    .option('--filter <field=value>', 'Filter repositories based on properties from repo-info.json (can be used multiple times)', (val, prev) => prev.concat([val]), [])
    .option('--milestone <title>', 'Milestone title to assign to the new Item')
    .option('--labels <labels>', 'Comma-separated list of labels to assign to the new Item')
    .action(async (options) => {
    try {
        await (0, addItem_1.addItem)(options);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
});
program.command('update-item')
    .description('Update an existing Item in a repository that is linked to a GitLab Epic')
    .requiredOption('--epic-group-path <path>', 'Path of the Group containing the Epic')
    .requiredOption('--epic-title <title>', 'Title of the Epic')
    .requiredOption('--item-title <title>', 'Title of the Item to update')
    .requiredOption('--item-filename <filename>', 'Filename to read the updated Content/Body of the Item from')
    .option('--filter <field=value>', 'Filter repositories based on properties from repo-info.json (can be used multiple times)', (val, prev) => prev.concat([val]), [])
    .option('--milestone <title>', 'Milestone title to assign to the updated Item')
    .option('--labels <labels>', 'Comma-separated list of labels to assign to the updated Item')
    .action(async (options) => {
    try {
        await (0, updateItem_1.updateItem)(options);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
});
program.command('list-items')
    .description('List Items in a GitLab Epic')
    .argument('<epicGroupPath>', 'Path of the Group containing the Epic')
    .argument('<epicTitle>', 'Title of the Epic')
    .action(async (epicGroupPath, epicTitle) => {
    try {
        await (0, listItems_1.listItems)(epicGroupPath, epicTitle);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
});
const getEpic_1 = require("./commands/getEpic");
program.command('get-epic')
    .description('Get details of a GitLab Epic')
    .argument('<epicGroupPath>', 'Path of the Group containing the Epic')
    .argument('<epicTitle>', 'Title of the Epic')
    .action(async (epicGroupPath, epicTitle) => {
    try {
        await (0, getEpic_1.getEpicDetails)(epicGroupPath, epicTitle);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
});
program.parse();
