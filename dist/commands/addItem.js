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
const path = __importStar(require("path"));
const readline = __importStar(require("readline/promises"));
const process_1 = require("process");
async function addItem(options) {
    const { epicGroupPath, epicTitle, itemTitle, itemFilename, filter, milestone, labels } = options;
    console.log(`Adding item "${itemTitle}" and linking to Epic "${epicTitle}" in group "${epicGroupPath}" using content from "${itemFilename}"...`);
    let itemContent;
    try {
        itemContent = fs.readFileSync(itemFilename, 'utf8');
    }
    catch (err) {
        throw new Error(`Failed to read file ${itemFilename}: ${err.message}`);
    }
    let repos = [];
    try {
        const repoInfoPath = path.resolve(process.cwd(), 'repo-info.json');
        const repoListContent = fs.readFileSync(repoInfoPath, 'utf8');
        repos = JSON.parse(repoListContent);
    }
    catch (err) {
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
    }
    else {
        console.warn('WARNING: No filters provided. This will add the item to ALL repositories.');
        const rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
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
        const groupId = await (0, gitlabClient_1.getGroupId)(epicGroupPath);
        console.log(`Found Group ID: ${groupId}`);
        // 2. Get Epic IID
        const epicIid = await (0, gitlabClient_1.getEpicIid)(groupId, epicTitle);
        console.log(`Found Epic IID: ${epicIid}`);
        let milestoneId;
        if (milestone) {
            console.log(`Looking up milestone ID for "${milestone}" in group "osdu/platform"...`);
            const milestoneGroupId = await (0, gitlabClient_1.getGroupId)('osdu/platform');
            milestoneId = await (0, gitlabClient_1.getGroupMilestoneId)(milestoneGroupId, milestone);
            console.log(`Found Milestone ID: ${milestoneId}`);
        }
        for (const repo of filteredRepos) {
            const repoPath = repo.Repository.replace('https://community.opengroup.org/', '');
            console.log(`\n--- Processing repo: ${repoPath} ---`);
            try {
                // 3. Get Project ID
                const projectId = await (0, gitlabClient_1.getProjectId)(repoPath);
                console.log(`Found Project ID: ${projectId}`);
                // 4. Create Issue
                console.log('Creating issue...');
                const issueData = { description: itemContent };
                if (milestoneId) {
                    issueData.milestoneId = milestoneId;
                }
                if (labels) {
                    issueData.labels = labels;
                }
                const issue = await gitlabClient_1.api.Issues.create(projectId, itemTitle, issueData);
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
