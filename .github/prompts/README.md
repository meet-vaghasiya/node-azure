# Reusable Prompts and Agents Folder

This folder contains reusable prompt files and agent instructions for AI assistants like GitHub Copilot and custom MCP-based agents.

## Folder Structure

- `agents/`: Contains agent-specific prompt files that define behaviors for automated tasks (e.g., Git operations, code reviews).
  - `git-auto-commit-agent.md`: Agent for automated Git commits and pushes.
- `prompts/`: Contains general reusable prompts for common tasks, such as code generation, documentation, or analysis.
  - `code-review-prompt.md`: Prompt for performing code reviews.
- `README.md`: This file, providing usage instructions.

## How to Create Prompt Files

1. **Choose the appropriate subfolder**: Use `agents/` for task-specific agents, `prompts/` for general templates.
2. **File naming**: Use descriptive names with `.md` extension, e.g., `git-auto-commit-agent.md` or `code-review-prompt.md`.
3. **Content format**: Write prompts in Markdown, including:
   - Clear title and description.
   - Instructions for the AI model (e.g., "You are an agent using Grok Code Fast 1").
   - Specific tasks or behaviors.
   - Best practices and constraints.
4. **Incorporate MCP access**: For agents requiring external tools, specify Model Context Protocol (MCP) for secure integrations.

## How to Use Prompt Files

- **GitHub Copilot**: Place instructions in `.github/copilot-instructions.md` at the root for repository-wide guidance. For specific files, reference them in comments.
- **Custom Agents/MCP Servers**: Load these files as prompt templates in your MCP server implementation. Use the MCP `prompts` primitive to expose them.
- **Manual Use**: Copy-paste content into AI chat interfaces or IDE prompts.
- **Version Control**: Commit these files to track changes and share with team members.

## Best Practices

- Keep prompts concise and focused on specific tasks.
- Include error handling and security considerations.
- Test prompts in a safe environment before production use.
- Update prompts based on feedback and evolving needs.
- Respect repository conventions (e.g., .gitignore for sensitive data).

## Example Usage

To use the Git auto-commit agent:
1. Ensure MCP is configured for GitHub access.
2. Load `agents/git-auto-commit-agent.md` as the system prompt.
3. Activate the agent to perform automated commits.

For more details, refer to [Model Context Protocol documentation](https://modelcontextprotocol.io/) and [GitHub Copilot guides](https://docs.github.com/en/copilot).