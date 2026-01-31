import * as core from '@actions/core';
import * as github from '@actions/github';
import { SecretFinding } from './types';

export async function annotateFindings(findings: SecretFinding[]): Promise<void> {
  if (findings.length === 0) {
    return;
  }

  // 1. Create Annotations (for the 'Files Changed' tab)
  for (const finding of findings) {
    core.error(
      `Secret detected: ${finding.rule}`,
      {
        file: finding.file,
        startLine: finding.line,
        title: 'NetShield: Secret Detected'
      }
    );
  }

  // 2. Build the Markdown Body for the PR Comment with custom logo
  const tableRows = findings
    .map(f => `| ${f.file} | ${f.line} | ${f.rule} |`)
    .join('\n');
  
  // Use your custom NetShield logo from the repository
  const logoUrl = `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/test-secrets/.github/assets/netshield-logo.jpeg`;
  
  const commentBody = 
    `<img src="${logoUrl}" alt="NetShield" width="100"/>\n\n` +
    `## NetShield: Secrets Detected\n\n` +
    `NetShield blocked this PR because **${findings.length}** secret(s) were found.\n\n` +
    `| File | Line | Rule |\n` +
    `| :--- | :--- | :--- |\n` +
    `${tableRows}\n\n` +
    `**Action Required:** Remove the detected secrets and push new commits.`;

  // 3. Post the Comment using Octokit
  try {
    const token = core.getInput('token') || process.env.GITHUB_TOKEN;
    if (token && github.context.payload.pull_request) {
      const octokit = github.getOctokit(token);
      await octokit.rest.issues.createComment({
        ...github.context.repo,
        issue_number: github.context.payload.pull_request.number,
        body: commentBody
      });
      core.info('✅ Posted findings as PR comment');
    } else {
      core.warning('No token available or not a PR - skipping comment');
    }
  } catch (error: any) {
    core.warning(`Failed to post PR comment: ${error.message}`);
  }

  // 4. Also write to the Job Summary (Actions tab)
  await core.summary
    .addHeading('NetShield: Secrets Detected', 2)
    .addRaw(`NetShield blocked this PR because ${findings.length} secret(s) were found.`)
    .addBreak()
    .addBreak()
    .addTable([
      [
        { data: 'File', header: true },
        { data: 'Line', header: true },
        { data: 'Rule', header: true }
      ],
      ...findings.map(f => [
        f.file,
        f.line.toString(),
        f.rule
      ])
    ])
    .addBreak()
    .addRaw('**Action Required:** Remove the detected secrets and push new commits.')
    .write();

  core.setFailed(`NetShield blocked: ${findings.length} secret(s) detected`);
}

export function reportSuccess(): void {
  core.info('✅ NetShield: No secrets detected');
  
  // Use custom logo for success too
  const logoUrl = `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/test-secrets/.github/assets/netshield-logo.jpeg`;
  
  core.summary
    .addHeading('NetShield: Passed', 2)
    .addRaw(`<img src="${logoUrl}" alt="NetShield" width="80"/>`)
    .addBreak()
    .addRaw('No secrets detected in this pull request.')
    .write();
}