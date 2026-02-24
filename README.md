# GitLab Epic Manager CLI Walkthrough

## Prerequisites
- Node.js installed
- GitLab Personal Access Token with `api` scope.

## Setup
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Build**:
    ```bash
    npm run build
    # or
    npx tsc
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root directory:
    ```
    GITLAB_TOKEN=your_token_here
    ```

## Usage

### Run CLI
You can run the CLI using `node dist/index.js` or `ts-node src/index.ts`.

### Add Item to Epic
Adds a new issue to a repository and links it to an existing Epic.

```bash
node dist/index.js add-item "my-group/subgroup" "My Epic Title" "my-group/my-project" "New Feature Issue" "Details about the feature..."
```

**Parameters:**
1.  **Epic Group Path**: The full path to the group containing the Epic (e.g., `gitlab-org/gitlab`).
2.  **Epic Title**: The exact title of the existing Epic.
3.  **Repo Path**: The path to the repository where the issue should be created (e.g., `gitlab-org/gitlab-runner`).
4.  **Item Title**: The title of the new issue.
5.  **Item Content**: The description/body of the new issue.

### List Items in Epic
Lists all issues linked to an Epic.

```bash
node dist/index.js list-items "my-group/subgroup" "My Epic Title"
```

**Parameters:**
1.  **Epic Group Path**: The full path to the group containing the Epic.
2.  **Epic Title**: The exact title of the Epic.

### Get Epic Details
Gets details of an existing Epic.

```bash
node dist/index.js get-epic "my-group/subgroup" "My Epic Title"
```

**Parameters:**
1.  **Epic Group Path**: The full path to the group containing the Epic.
2.  **Epic Title**: The exact title of the Epic.

## Troubleshooting
- **Token Error**: Ensure `GITLAB_TOKEN` is set in `.env` or exported in your shell.
- **Not Found**: Double check the paths and titles. Titles are case-sensitive and must be exact matches for the search to work reliably.


---
Venus epic specifics

npm start add-item "/osdu/platform/" "[Venus] Decouple CSP dependencies from pipelines" "osdu/platform/system/reference/schema-upgrade" "New Feature Issue" "Details about the feature..."

npm start get-epic "/osdu/platform/" "[Venus] Decouple CSP dependencies from pipelines"
npm start list-items "/osdu/platform/" "[Venus] Decouple CSP dependencies from pipelines"
