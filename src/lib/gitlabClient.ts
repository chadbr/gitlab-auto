import { Gitlab } from '@gitbeaker/rest';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.GITLAB_TOKEN;

if (!token) {
    console.error('Error: GITLAB_TOKEN environment variable is not set.');
    process.exit(1);
}

export const api = new Gitlab({
    host: 'https://community.opengroup.org',
    token: token,
});

export async function getGroupId(groupPath: string): Promise<number> {
    try {
        // Remove leading and trailing slashes
        const cleanedPath = groupPath.replace(/^\/+|\/+$/g, '');

        const group = await api.Groups.show(cleanedPath);
        return group.id;
    } catch (error: any) {
        console.error(`Error finding group with path ${groupPath}: ${error.message}`);
        throw error;
    }
}

export async function getEpicIid(groupId: number, epicTitle: string): Promise<number> {
    try {
        const epics = await api.Epics.all(groupId, { search: epicTitle });
        const epic = epics.find((e: any) => e.title === epicTitle);

        if (!epic) {
            throw new Error(`Epic with title "${epicTitle}" not found in group ${groupId}`);
        }
        return epic.iid;
    } catch (error: any) {
        console.error(`Error finding epic "${epicTitle}": ${error.message}`);
        throw error;
    }
}

export async function getEpic(groupId: number, epicTitle: string): Promise<any> {
    try {
        const epics = await api.Epics.all(groupId, { search: epicTitle });
        const epic = epics.find((e: any) => e.title === epicTitle);

        if (!epic) {
            throw new Error(`Epic with title "${epicTitle}" not found in group ${groupId}`);
        }
        return epic;
    } catch (error: any) {
        console.error(`Error finding epic "${epicTitle}": ${error.message}`);
        throw error;
    }
}

export async function getGroupMilestoneId(groupId: number, milestoneTitle: string): Promise<number> {
    try {
        const milestones = await api.GroupMilestones.all(groupId, { title: milestoneTitle });
        // The API might return multiple if the string matches partially depending on implementation, so let's find exact match
        const milestone = milestones.find((m: any) => m.title === milestoneTitle);

        if (!milestone) {
            throw new Error(`Milestone with title "${milestoneTitle}" not found in group ${groupId}`);
        }
        return milestone.id;
    } catch (error: any) {
        console.error(`Error finding milestone "${milestoneTitle}": ${error.message}`);
        throw error;
    }
}

export async function getProjectId(projectPath: string): Promise<number> {
    try {
        // Project paths are URL encoded when using show
        const project = await api.Projects.show(projectPath);
        return project.id;
    } catch (error: any) {
        console.error(`Error finding project with path ${projectPath}: ${error.message}`);
        throw error;
    }
}
