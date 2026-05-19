import { api, getGroupId, getEpicIid, getProjectId, getGroupMilestoneId } from '../lib/gitlabClient';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

export interface UpdateItemOptions {
    epicGroupPath: string;
    epicTitle: string;
    itemTitle: string;
    itemFilename: string;
    filter?: string[];
    milestone?: string;
    labels?: string;
}

export async function updateItem(options: UpdateItemOptions) {
    const { epicGroupPath, epicTitle, itemTitle, itemFilename, filter, milestone, labels } = options;
    console.log(`Updating item "${itemTitle}" in Epic "${epicTitle}" in group "${epicGroupPath}" using content from "${itemFilename}"...`);

    let itemContent: string;
    try {
        itemContent = fs.readFileSync(itemFilename, 'utf8');
    } catch (err: any) {
        throw new Error(`Failed to read file ${itemFilename}: ${err.message}`);
    }

    let repos: any[] = [];
    try {
        const repoInfoPath = path.resolve(process.cwd(), 'repo-info.json');
        const repoListContent = fs.readFileSync(repoInfoPath, 'utf8');
        repos = JSON.parse(repoListContent);
    } catch (err: any) {
        throw new Error(`Failed to read repo-info.json: ${err.message}`);
    }

    let filteredRepos = repos.filter(repo => repo.Repository && typeof repo.Repository === 'string' && repo.Repository.startsWith('https://community.opengroup.org/'));

    if (filter && filter.length > 0) {
        console.log(`Applying filters: ${filter.join(', ')}`);
        for (const f of filter) {
            const [key, value] = f.split('=', 2);
            if (key && value !== undefined) {
                filteredRepos = filteredRepos.filter(repo => repo[key] === value);
            }
        }
    } else {
        console.warn('WARNING: No filters provided. This will update the item in ALL repositories.');
        const rl = readline.createInterface({ input, output });
        const answer = await rl.question('Are you sure you want to proceed? (y/n): ');
        rl.close();
        if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
            console.log('Operation aborted by user.');
            return;
        }
    }

    if (filteredRepos.length === 0) {
        throw new Error(`No repositories matched the specified criteria.`);
    }

    try {
        // 1. Get Group ID
        const groupId = await getGroupId(epicGroupPath);
        console.log(`Found Group ID: ${groupId}`);

        // 2. Get Epic IID
        const epicIid = await getEpicIid(groupId, epicTitle);
        console.log(`Found Epic IID: ${epicIid}`);

        let milestoneId: number | undefined;
        if (milestone) {
            console.log(`Looking up milestone ID for "${milestone}" in group "osdu/platform"...`);
            const milestoneGroupId = await getGroupId('osdu/platform');
            milestoneId = await getGroupMilestoneId(milestoneGroupId, milestone);
            console.log(`Found Milestone ID: ${milestoneId}`);
        }

        console.log('Fetching issues currently linked to Epic...');
        const epicIssues = await api.EpicIssues.all(groupId, epicIid);

        for (const repo of filteredRepos) {
            const repoPath = repo.Repository.replace('https://community.opengroup.org/', '');
            console.log(`\n--- Processing repo: ${repoPath} ---`);
            try {
                // 3. Get Project ID
                const projectId = await getProjectId(repoPath);
                console.log(`Found Project ID: ${projectId}`);

                // 4. Find Issue to Update
                const issueToUpdate = epicIssues.find((i: any) => i.project_id === projectId && i.title === itemTitle);

                if (!issueToUpdate) {
                    console.log(`Issue "${itemTitle}" not found in this epic for project ${projectId}. Skipping.`);
                    continue;
                }

                // 5. Update Issue
                console.log(`Updating issue #${issueToUpdate.iid}...`);
                const issueData: any = { description: itemContent };
                if (milestoneId) {
                    issueData.milestoneId = milestoneId;
                }
                if (labels) {
                    issueData.labels = labels;
                }

                // @gitbeaker/rest Issues.edit signature: (projectId, issueIid, options)
                const updatedIssue: any = await api.Issues.edit(projectId, issueToUpdate.iid, issueData);
                console.log(`Updated Issue #${updatedIssue.iid} in project ${projectId}: ${updatedIssue.web_url}`);
            } catch (repoError: any) {
                console.error(`Failed to process repo ${repoPath}:`, repoError.message);
                // Continue with other repos
            }
        }

    } catch (error: any) {
        console.error('Failed to update items:', error.message);
        throw error;
    }
}
