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
Adds a new issue to repositories defined in `repo-info.json` and links it to an existing Epic.

```bash
node dist/index.js add-item \
  --epic-group-path "my-group/subgroup" \
  --epic-title "My Epic Title" \
  --item-title "New Feature Issue" \
  --item-filename "path/to/issue-description.md" \
  --filter "Language=Java" \
  --filter "Type Details=core" \
  --milestone "Milestone Title" \
  --labels "label1,label2,label3"
```

**Options:**
- `--epic-group-path <path>`: The full path to the group containing the Epic (e.g., `gitlab-org/gitlab`).
- `--epic-title <title>`: The exact title of the existing Epic.
- `--item-title <title>`: The title of the new issue.
- `--item-filename <filename>`: The path to a file containing the description/body of the new issue.
- `--filter <field=value>`: Filter repositories based on properties from the `repo-info.json` file. This option can be used multiple times to apply multiple filters (e.g., `--filter "Language=Java" --filter "Type=service"`).
- `--milestone <title>`: (Optional) The exact title of a Group Milestone to assign to each created issue.
- `--labels <labels>`: (Optional) A comma-separated list of labels to assign to each created issue.

> **Note:** The command reads repository targets from a `repo-info.json` file in the current directory. If no `--filter` options are provided, the interactive prompt will warn you and force a `y/n` confirmation before creating issues in **all** available repositories.

### Update Item in Epic
Updates an existing issue in repositories defined in `repo-info.json` strictly if it is linked to the specified Epic. Works exactly like `add-item`, but updates issues instead of creating new ones.

```bash
node dist/index.js update-item \
  --epic-group-path "my-group/subgroup" \
  --epic-title "My Epic Title" \
  --item-title "Existing Feature Issue" \
  --item-filename "path/to/updated-issue-description.md" \
  --filter "Language=Java" \
  --filter "Type Details=core" \
  --milestone "Milestone Title" \
  --labels "label1,label2,label3"
```

**Options:**
- `--epic-group-path <path>`: The full path to the group containing the Epic (e.g., `gitlab-org/gitlab`).
- `--epic-title <title>`: The exact title of the existing Epic.
- `--item-title <title>`: The exact title of the existing issue to update.
- `--item-filename <filename>`: The path to a file containing the updated description/body of the issue.
- `--filter <field=value>`: Filter repositories based on properties from the `repo-info.json` file.
- `--milestone <title>`: (Optional) The exact title of a Group Milestone to update on each modified issue.
- `--labels <labels>`: (Optional) A comma-separated list of labels to update on each modified issue.

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

```bash
npm start add-item -- \
  --epic-group-path "/osdu/platform/" \
  --epic-title="[Venus] Automated OpenAPI Specification Generation and Validation" \
  --item-title "[Venus] Automated OpenAPI Specification Generation and Validation" \
  --item-filename "item-content.md" \
  --filter "Language=Python" \
  --filter "Type=service" \
  --milestone "M27 - Release 0.30 (Venus - Preview 2)" \
  --labels "Venus,Issue::Task,Priority::Critical"
```

npm start get-epic "/osdu/platform/" "[Venus] Decouple CSP dependencies from pipelines"
npm start list-items "/osdu/platform/" "[Venus] Decouple CSP dependencies from pipelines"

```bash
npm start update-item -- \
  --epic-group-path "/osdu/platform/" \
  --epic-title="[Venus] Decouple CSP dependencies from pipelines" \
  --item-title "New Feature Issue" \
  --item-filename "item-content.md" \
  --filter "Language=Test" \
  --milestone "M27 - Release 0.30 (Venus - Preview 2)" \
  --labels "Venus,Issue::Task,Priority::Critical"
```
