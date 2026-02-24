"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpicDetails = getEpicDetails;
const gitlabClient_1 = require("../lib/gitlabClient");
async function getEpicDetails(epicGroupPath, epicTitle) {
    console.log(`Getting details for Epic "${epicTitle}" (Group: ${epicGroupPath})...`);
    try {
        // 1. Get Group ID
        const groupId = await (0, gitlabClient_1.getGroupId)(epicGroupPath);
        // 2. Get Epic
        const epic = await (0, gitlabClient_1.getEpic)(groupId, epicTitle);
        // 3. Output Details
        console.log('\nEpic Details:');
        console.log('--------------------------------------------------');
        console.log(`Title:       ${epic.title}`);
        console.log(`ID:          ${epic.id}`);
        console.log(`IID:         ${epic.iid}`);
        console.log(`State:       ${epic.state}`);
        console.log(`Web URL:     ${epic.web_url}`);
        console.log(`Created At:  ${epic.created_at}`);
        console.log(`Updated At:  ${epic.updated_at}`);
        if (epic.start_date)
            console.log(`Start Date:  ${epic.start_date}`);
        if (epic.due_date)
            console.log(`Due Date:    ${epic.due_date}`);
        console.log('--------------------------------------------------');
        if (epic.description) {
            console.log('Description:');
            console.log(epic.description);
            console.log('--------------------------------------------------');
        }
    }
    catch (error) {
        console.error('Failed to get epic details:', error.message);
        throw error;
    }
}
