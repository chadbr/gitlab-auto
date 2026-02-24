"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItem = addItem;
const gitlabClient_1 = require("../lib/gitlabClient");
const fs = __importStar(require("fs"));
async function addItem(epicGroupPath, epicTitle, repoListFilename, itemTitle, itemFilename) {
    console.log(`Adding item "${itemTitle}" to repos from "${repoListFilename}" and linking to Epic "${epicTitle}" in group "${epicGroupPath}" using content from "${itemFilename}"...`);
    let itemContent;
    try {
        itemContent = fs.readFileSync(itemFilename, 'utf8');
    }
    catch (err) {
        throw new Error(`Failed to read file ${itemFilename}: ${err.message}`);
    }
    let repoPaths = [];
    try {
        const repoListContent = fs.readFileSync(repoListFilename, 'utf8');
        repoPaths = repoListContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }
    catch (err) {
        throw new Error(`Failed to read repo list file ${repoListFilename}: ${err.message}`);
    }
    if (repoPaths.length === 0) {
        throw new Error(`No repositories found in ${repoListFilename}`);
    }
    try {
        // 1. Get Group ID
        const groupId = await (0, gitlabClient_1.getGroupId)(epicGroupPath);
        console.log(`Found Group ID: ${groupId}`);
        // 2. Get Epic IID
        const epicIid = await (0, gitlabClient_1.getEpicIid)(groupId, epicTitle);
        console.log(`Found Epic IID: ${epicIid}`);
        for (const repoPath of repoPaths) {
            console.log(`\n--- Processing repo: ${repoPath} ---`);
            try {
                // 3. Get Project ID
                const projectId = await (0, gitlabClient_1.getProjectId)(repoPath);
                console.log(`Found Project ID: ${projectId}`);
                // 4. Create Issue
                console.log('Creating issue...');
                const issue = await gitlabClient_1.api.Issues.create(projectId, itemTitle, {
                    description: itemContent,
                });
                console.log(`Created Issue #${issue.iid} in project ${projectId}: ${issue.web_url}`);
                // 5. Link Issue to Epic
                // POST /groups/:id/epics/:epic_iid/issues/:issue_id
                console.log('Linking issue to epic...');
                await gitlabClient_1.api.EpicIssues.assign(groupId, epicIid, issue.id);
                console.log('Successfully linked issue to Epic.');
            }
            catch (repoError) {
                console.error(`Failed to process repo ${repoPath}:`, repoError.message);
                // Continue with other repos
            }
        }
    }
    catch (error) {
        console.error('Failed to add items:', error.message);
        throw error;
    }
}
