import { api, getGroupId, getEpicIid } from '../lib/gitlabClient';

export async function listItems(epicGroupPath: string, epicTitle: string) {
    console.log(`Listing items in Epic "${epicTitle}" (Group: ${epicGroupPath})...`);

    try {
        // 1. Get Group ID
        const groupId = await getGroupId(epicGroupPath);

        // 2. Get Epic IID
        const epicIid = await getEpicIid(groupId, epicTitle);

        // 3. List Issues in Epic
        const issues = await api.EpicIssues.all(groupId, epicIid);

        if (issues.length === 0) {
            console.log('No items found in this Epic.');
            return;
        }

        console.log(`\nFound ${issues.length} items:`);
        issues.forEach((issue: any) => {
            const tags = issue.labels && issue.labels.length > 0 ? ` [Tags: ${issue.labels.join(', ')}]` : '';
            const milestone = issue.milestone ? ` [Milestone: ${issue.milestone.title}]` : '';
            console.log(`- [${issue.state}] ${issue.title}${tags}${milestone} (${issue.web_url})`);
        });

    } catch (error: any) {
        console.error('Failed to list items:', error.message);
        throw error;
    }
}
