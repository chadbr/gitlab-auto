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
    .argument('<repoListFilename>', 'Filename containing a line-separated list of repository paths for the new Item')
    .argument('<itemTitle>', 'Title of the new Item')
    .argument('<itemFilename>', 'Filename to read the Content/Body of the new Item from')
    .action(async (epicGroupPath, epicTitle, repoListFilename, itemTitle, itemFilename) => {
        try {
            await addItem(epicGroupPath, epicTitle, repoListFilename, itemTitle, itemFilename);
        } catch (e: any) {
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
            await listItems(epicGroupPath, epicTitle);
        } catch (e: any) {
            console.error(e);
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
            console.error(e);
            process.exit(1);
        }
    });

program.parse();
