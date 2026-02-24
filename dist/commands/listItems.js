"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listItems = listItems;
const gitlabClient_1 = require("../lib/gitlabClient");
async function listItems(epicGroupPath, epicTitle) {
    console.log(`Listing items in Epic "${epicTitle}" (Group: ${epicGroupPath})...`);
    try {
        // 1. Get Group ID
        const groupId = await (0, gitlabClient_1.getGroupId)(epicGroupPath);
        // 2. Get Epic IID
        const epicIid = await (0, gitlabClient_1.getEpicIid)(groupId, epicTitle);
        // 3. List Issues in Epic
        const issues = await gitlabClient_1.api.EpicIssues.all(groupId, epicIid);
        if (issues.length === 0) {
            console.log('No items found in this Epic.');
            return;
        }
        console.log(`\nFound ${issues.length} items:`);
        issues.forEach((issue) => {
            const tags = issue.labels && issue.labels.length > 0 ? ` [Tags: ${issue.labels.join(', ')}]` : '';
            const milestone = issue.milestone ? ` [Milestone: ${issue.milestone.title}]` : '';
            console.log(`- [${issue.state}] ${issue.title}${tags}${milestone} (${issue.web_url})`);
        });
    }
    catch (error) {
        console.error('Failed to list items:', error.message);
        throw error;
    }
}
