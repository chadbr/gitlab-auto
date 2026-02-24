#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const addItem_1 = require("./commands/addItem");
const listItems_1 = require("./commands/listItems");
const program = new commander_1.Command();
program
    .name('gitlab-epic-cli')
    .description('CLI to manage GitLab Epics')
    .version('0.0.1');
program.command('add-item')
    .description('Add a new Item to a repository and link it to an existing GitLab Epic')
    .argument('<epicGroupPath>', 'Path of the Group containing the Epic')
    .argument('<epicTitle>', 'Title of the Epic')
    .argument('<repoPath>', 'Path of the repository for the new Item')
    .argument('<itemTitle>', 'Title of the new Item')
    .argument('<itemContent>', 'Content/Body of the new Item')
    .action(async (epicGroupPath, epicTitle, repoPath, itemTitle, itemContent) => {
    try {
        await (0, addItem_1.addItem)(epicGroupPath, epicTitle, repoPath, itemTitle, itemContent);
    }
    catch (e) {
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
        process.exit(1);
    }
});
program.parse();
