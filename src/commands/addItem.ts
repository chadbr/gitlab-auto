import { api, getGroupId, getEpicIid, getProjectId } from '../lib/gitlabClient';

export async function addItem(
    epicGroupPath: string,
    epicTitle: string,
    repoPath: string,
    itemTitle: string,
    itemContent: string
) {
    console.log(`Adding item "${itemTitle}" to repo "${repoPath}" and linking to Epic "${epicTitle}" in group "${epicGroupPath}"...`);

    try {
        // 1. Get Group ID
        const groupId = await getGroupId(epicGroupPath);
        console.log(`Found Group ID: ${groupId}`);

        // 2. Get Epic IID
        const epicIid = await getEpicIid(groupId, epicTitle);
        console.log(`Found Epic IID: ${epicIid}`);

        // 3. Get Project ID
        const projectId = await getProjectId(repoPath);
        console.log(`Found Project ID: ${projectId}`);

        // 4. Create Issue
        console.log('Creating issue...');
        const issue = await api.Issues.create(projectId, itemTitle, {
            description: itemContent,
        });
        console.log(`Created Issue #${issue.iid} in project ${projectId}`);

        // 5. Link Issue to Epic
        // POST /groups/:id/epics/:epic_iid/issues/:issue_id
        console.log('Linking issue to epic...');
        await api.EpicIssues.assign(groupId, epicIid, issue.id);
        console.log('Successfully linked issue to Epic.');

    } catch (error: any) {
        console.error('Failed to add item:', error.message);
        throw error;
    }
}
