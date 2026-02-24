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
    .argument('<repoListFilename>', 'Filename containing a line-separated list of repository paths for the new Item')
    .argument('<itemTitle>', 'Title of the new Item')
    .argument('<itemFilename>', 'Filename to read the Content/Body of the new Item from')
    .action(async (epicGroupPath, epicTitle, repoListFilename, itemTitle, itemFilename) => {
    try {
        await (0, addItem_1.addItem)(epicGroupPath, epicTitle, repoListFilename, itemTitle, itemFilename);
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
