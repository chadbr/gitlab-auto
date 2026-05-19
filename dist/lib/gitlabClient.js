"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
exports.getGroupId = getGroupId;
exports.getEpicIid = getEpicIid;
exports.getEpic = getEpic;
exports.getGroupMilestoneId = getGroupMilestoneId;
exports.getProjectId = getProjectId;
const rest_1 = require("@gitbeaker/rest");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.GITLAB_TOKEN;
if (!token) {
    console.error('Error: GITLAB_TOKEN environment variable is not set.');
    process.exit(1);
}
exports.api = new rest_1.Gitlab({
    host: 'https://community.opengroup.org',
    token: token,
});
async function getGroupId(groupPath) {
    try {
        // Remove leading and trailing slashes
        const cleanedPath = groupPath.replace(/^\/+|\/+$/g, '');
        const group = await exports.api.Groups.show(cleanedPath);
        return group.id;
    }
    catch (error) {
        console.error(`Error finding group with path ${groupPath}: ${error.message}`);
        throw error;
    }
}
async function getEpicIid(groupId, epicTitle) {
    try {
        const epics = await exports.api.Epics.all(groupId, { search: epicTitle });
        const epic = epics.find((e) => e.title === epicTitle);
        if (!epic) {
            throw new Error(`Epic with title "${epicTitle}" not found in group ${groupId}`);
        }
        return epic.iid;
    }
    catch (error) {
        console.error(`Error finding epic "${epicTitle}": ${error.message}`);
        throw error;
    }
}
async function getEpic(groupId, epicTitle) {
    try {
        const epics = await exports.api.Epics.all(groupId, { search: epicTitle });
        const epic = epics.find((e) => e.title === epicTitle);
        if (!epic) {
            throw new Error(`Epic with title "${epicTitle}" not found in group ${groupId}`);
        }
        return epic;
    }
    catch (error) {
        console.error(`Error finding epic "${epicTitle}": ${error.message}`);
        throw error;
    }
}
async function getGroupMilestoneId(groupId, milestoneTitle) {
    try {
        const milestones = await exports.api.GroupMilestones.all(groupId, { title: milestoneTitle });
        // The API might return multiple if the string matches partially depending on implementation, so let's find exact match
        const milestone = milestones.find((m) => m.title === milestoneTitle);
        if (!milestone) {
            throw new Error(`Milestone with title "${milestoneTitle}" not found in group ${groupId}`);
        }
        return milestone.id;
    }
    catch (error) {
        console.error(`Error finding milestone "${milestoneTitle}": ${error.message}`);
        throw error;
    }
}
async function getProjectId(projectPath) {
    try {
        // Project paths are URL encoded when using show
        const project = await exports.api.Projects.show(projectPath);
        return project.id;
    }
    catch (error) {
        console.error(`Error finding project with path ${projectPath}: ${error.message}`);
        throw error;
    }
}
