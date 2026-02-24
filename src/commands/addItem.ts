import { api, getGroupId, getEpicIid, getProjectId } from '../lib/gitlabClient';
import * as fs from 'fs';

export async function addItem(
    epicGroupPath: string,
    epicTitle: string,
    repoListFilename: string,
    itemTitle: string,
    itemFilename: string
) {
    console.log(`Adding item "${itemTitle}" to repos from "${repoListFilename}" and linking to Epic "${epicTitle}" in group "${epicGroupPath}" using content from "${itemFilename}"...`);

    let itemContent: string;
    try {
        itemContent = fs.readFileSync(itemFilename, 'utf8');
    } catch (err: any) {
        throw new Error(`Failed to read file ${itemFilename}: ${err.message}`);
    }

    let repoPaths: string[] = [];
    try {
        const repoListContent = fs.readFileSync(repoListFilename, 'utf8');
        repoPaths = repoListContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    } catch (err: any) {
        throw new Error(`Failed to read repo list file ${repoListFilename}: ${err.message}`);
    }

    if (repoPaths.length === 0) {
        throw new Error(`No repositories found in ${repoListFilename}`);
    }

    try {
        // 1. Get Group ID
        const groupId = await getGroupId(epicGroupPath);
        console.log(`Found Group ID: ${groupId}`);

        // 2. Get Epic IID
        const epicIid = await getEpicIid(groupId, epicTitle);
        console.log(`Found Epic IID: ${epicIid}`);

        for (const repoPath of repoPaths) {
            console.log(`\n--- Processing repo: ${repoPath} ---`);
            try {
                // 3. Get Project ID
                const projectId = await getProjectId(repoPath);
                console.log(`Found Project ID: ${projectId}`);

                // 4. Create Issue
                console.log('Creating issue...');
                const issue: any = await api.Issues.create(projectId, itemTitle, {
                    description: itemContent,
                });
                console.log(`Created Issue #${issue.iid} in project ${projectId}: ${issue.web_url}`);

                // 5. Link Issue to Epic
                // POST /groups/:id/epics/:epic_iid/issues/:issue_id
                console.log('Linking issue to epic...');
                await api.EpicIssues.assign(groupId, epicIid, issue.id);
                console.log('Successfully linked issue to Epic.');
            } catch (repoError: any) {
                console.error(`Failed to process repo ${repoPath}:`, repoError.message);
                // Continue with other repos
            }
        }

    } catch (error: any) {
        console.error('Failed to add items:', error.message);
        throw error;
    }
}
