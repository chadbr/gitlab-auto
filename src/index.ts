#!/usr/bin/env ts-node

import { Command } from 'commander';
import { addItem } from './commands/addItem';
import { listItems } from './commands/listItems';

const program = new Command();

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
            await addItem(epicGroupPath, epicTitle, repoPath, itemTitle, itemContent);
        } catch (e: any) {
            process.exit(1);
        }
    });

program.command('list-items')
    .description('List Items in a GitLab Epic')
    .argument('<epicGroupPath>', 'Path of the Group containing the Epic')
    .argument('<epicTitle>', 'Title of the Epic')
    .action(async (epicGroupPath, epicTitle) => {
        try {
            await listItems(epicGroupPath, epicTitle);
        } catch (e: any) {
            process.exit(1);
        }
    });

import { getEpicDetails } from './commands/getEpic';

program.command('get-epic')
    .description('Get details of a GitLab Epic')
    .argument('<epicGroupPath>', 'Path of the Group containing the Epic')
    .argument('<epicTitle>', 'Title of the Epic')
    .action(async (epicGroupPath, epicTitle) => {
        try {
            await getEpicDetails(epicGroupPath, epicTitle);
        } catch (e: any) {
            process.exit(1);
        }
    });

program.parse();
