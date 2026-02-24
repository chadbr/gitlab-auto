"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItem = addItem;
const gitlabClient_1 = require("../lib/gitlabClient");
async function addItem(epicGroupPath, epicTitle, repoPath, itemTitle, itemContent) {
    console.log(`Adding item "${itemTitle}" to repo "${repoPath}" and linking to Epic "${epicTitle}" in group "${epicGroupPath}"...`);
    try {
        // 1. Get Group ID
        const groupId = await (0, gitlabClient_1.getGroupId)(epicGroupPath);
        console.log(`Found Group ID: ${groupId}`);
        // 2. Get Epic IID
        const epicIid = await (0, gitlabClient_1.getEpicIid)(groupId, epicTitle);
        console.log(`Found Epic IID: ${epicIid}`);
        // 3. Get Project ID
        const projectId = await (0, gitlabClient_1.getProjectId)(repoPath);
        console.log(`Found Project ID: ${projectId}`);
        // 4. Create Issue
        console.log('Creating issue...');
        const issue = await gitlabClient_1.api.Issues.create(projectId, itemTitle, {
            description: itemContent,
        });
        console.log(`Created Issue #${issue.iid} in project ${projectId}`);
        // 5. Link Issue to Epic
        // POST /groups/:id/epics/:epic_iid/issues/:issue_id
        console.log('Linking issue to epic...');
        await gitlabClient_1.api.EpicIssues.assign(groupId, epicIid, issue.id);
        console.log('Successfully linked issue to Epic.');
    }
    catch (error) {
        console.error('Failed to add item:', error.message);
        throw error;
    }
}
