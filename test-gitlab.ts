import { Gitlab } from '@gitbeaker/rest';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.GITLAB_TOKEN;
const host = 'https://community.opengroup.org';

console.log(`Using host: ${host}`);
console.log(`Token length: ${token?.length}`);

const api = new Gitlab({
    host: host,
    token: token,
});

async function test() {
    try {
        console.log('Fetching current user...');
        const user = await api.Users.showCurrentUser();
        console.log('User:', user.username);
    } catch (e: any) {
        console.error('User fetch failed:', e);
        if (e.cause) console.error('Cause:', e.cause);
    }

    try {
        const path = 'osdu/platform';
        console.log(`Fetching group ${path} (unencoded)...`);
        const group = await api.Groups.show(path);
        console.log('Group ID:', group.id);
    } catch (e: any) {
        console.error('Group fetch failed:', e);
        if (e.cause) console.error('Cause:', e.cause);
    }
}

test();
