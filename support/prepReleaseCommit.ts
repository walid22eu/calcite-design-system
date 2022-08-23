import type { Options } from "standard-version";

import pify from "pify";
import yargs from "yargs";

(async function prepReleaseCommit(): Promise<void> {
  const childProcess = await import("child_process");
  const { promises: fs } = await import("fs");
  const { default: gitSemverTags } = await import("git-semver-tags");
  const { dirname, normalize } = await import("path");
  const prettier = await import("prettier");
  const { default: semver } = await import("semver");
  const { quote } = await import("shell-quote");
  const { default: standardVersion } = await import("standard-version");
  const { fileURLToPath } = await import("url");

  const exec = pify(childProcess.exec);
  const header = `# Changelog\n\nThis document maintains a list of released versions and changes introduced by them.\nThis project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)\n`;
  const unreleasedSectionTokenStart = "<!--@unreleased-section-start-->";
  const unreleasedSectionTokenEnd = "<!--@unreleased-section-end-->";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const changelogPath = quote([normalize(`${__dirname}/../CHANGELOG.md`)]);
  const readmePath = quote([normalize(`${__dirname}/../readme.md`)]);

  const { next } = yargs(process.argv.slice(2))
    .options({ next: { type: "boolean", default: false } })
    .parseSync();

  // deepen the history when fetching tags due to shallow clone
  await exec("git fetch --deepen=250 --tags");

  const previousReleasedTag = (await exec("git describe --abbrev=0 --tags", { encoding: "utf-8" })).trim();
  const prereleaseVersionPattern = /-next\.\d+$/;
  const previousReleaseIsPrerelease = prereleaseVersionPattern.test(previousReleasedTag);
  const semverTags = await pify(gitSemverTags)();
  let standardVersionOptions: Options;

  const baseErrorMessage = "an error occurred generating the changelog";

  try {
    // create options before temp-deleting (prerelease) tags to prevent standard-version's tagging getting out of sync
    standardVersionOptions = await getStandardVersionOptions(next, semverTags);
  } catch (error) {
    console.log(baseErrorMessage);
    process.exitCode = 1;
    return;
  }

  const changelogGenerationErrorMessage = `${baseErrorMessage} (releasing as: ${standardVersionOptions.releaseAs})`;

  if (!previousReleaseIsPrerelease) {
    try {
      await runStandardVersion(next, standardVersionOptions);
    } catch (error) {
      console.log(changelogGenerationErrorMessage);
      process.exitCode = 1;
    }
    return;
  }

  const indexOfNonNextTag = semverTags.findIndex((tag) => !prereleaseVersionPattern.test(tag));
  const nextTagsSinceLastRelease = semverTags.slice(0, indexOfNonNextTag);

  try {
    // delete prerelease tags locally, so they can be ignored when generating the changelog
    await exec(`git tag --delete ${nextTagsSinceLastRelease.join(" ")}`);

    await runStandardVersion(next, standardVersionOptions);
  } catch (error) {
    console.log(changelogGenerationErrorMessage);
    process.exitCode = 1;
  } finally {
    // restore deleted prerelease tags
    await exec(`git fetch --tags`);
  }

  async function getStandardVersionOptions(next: boolean, semverTags: string[]): Promise<Options> {
    const target = next ? "next" : "beta";
    const targetVersionPattern = new RegExp(`-${target}\\.\\d+$`);

    console.log(semverTags);

    // we keep track of `beta` and `next` releases since `standard-version` resets the version number when going in between
    // this should not be needed after v1.0.0 since there would no longer be a beta version to keep track of
    const targetDescendingOrderTags = semverTags.filter((tag) => targetVersionPattern.test(tag)).sort(semver.rcompare);
    const targetReleaseVersion = semver.inc(targetDescendingOrderTags[0], "prerelease", target);

    console.log(targetDescendingOrderTags);

    if (!targetVersionPattern.test(targetReleaseVersion)) {
      throw new Error(`target release version does not have prerelease identifier (${target})`);
    }

    const standardVersionOptions: Options = {
      commitAll: true,
      noVerify: true,
      header,
      releaseAs: targetReleaseVersion,
      releaseCommitMessageFormat: "{{currentTag}}"
    };

    if (next) {
      // prerelease changelogs are updated in a separate method
      standardVersionOptions.skip = { changelog: true };
    }

    return standardVersionOptions;
  }

  async function runStandardVersion(next: boolean, standardVersionOptions: Options): Promise<void> {
    if (next) {
      await appendUnreleasedNotesToChangelog();
      await exec(`git add ${changelogPath}`);
    } else {
      await updateReadmeCdnUrls(standardVersionOptions.releaseAs);
      await exec(`git add ${readmePath}`);
    }

    await standardVersion(standardVersionOptions);
  }

  async function appendUnreleasedNotesToChangelog(): Promise<void> {
    let changelogContent: string = await fs.readFile(changelogPath, { encoding: "utf8" });

    const needsUnreleasedSectionTokens = !changelogContent.includes(unreleasedSectionTokenStart);

    if (needsUnreleasedSectionTokens) {
      changelogContent = changelogContent.replace(
        header,
        `${header}\n${unreleasedSectionTokenStart}${unreleasedSectionTokenEnd}\n`
      );
    }

    const unreleasedSectionPattern = new RegExp(
      `(${unreleasedSectionTokenStart})(.*)(${unreleasedSectionTokenEnd})`,
      "s"
    );
    const unreleasedSectionContent = await getUnreleasedChangelogContents();
    const unreleasedHeaderPattern = /## Unreleased \(\d{4}-\d{2}-\d{2}\)/;
    const hasUnreleasedContent = unreleasedSectionContent.replace(unreleasedHeaderPattern, "").trim().length > 0;

    if (hasUnreleasedContent) {
      changelogContent = changelogContent.replace(unreleasedSectionPattern, `$1\n${unreleasedSectionContent}\n$3`);

      // remove date to make linking easier
      // https://github.com/Esri/calcite-components/blob/master/CHANGELOG.md#unreleased
      changelogContent = changelogContent.replace(unreleasedHeaderPattern, "## Unreleased");
    }

    changelogContent = prettier.format(changelogContent, { parser: "markdown" });

    await fs.writeFile(changelogPath, changelogContent);
  }

  async function getUnreleasedChangelogContents(): Promise<string> {
    // invoking this way since we want the CLI module behavior, which doesn't provide a way to programmatically use it
    return (
      await exec(
        "npx conventional-changelog --release-count 1 --output-unreleased --preset conventionalcommits --context support/.unreleased-changelog-context.json",
        { encoding: "utf-8" }
      )
    ).trim();
  }

  async function updateReadmeCdnUrls(version: string): Promise<void> {
    const scriptTagPattern = /(<script\s+type="module"\s+src=").+("\s*><\/script>)/m;
    const linkTagPattern = /(<link\s+rel="stylesheet"\s+type="text\/css"\s+href=").+("\s*\/>)/m;
    const baseCdnUrl = `https://unpkg.com/@esri/calcite-components@${version}/dist/calcite/calcite.`;

    const readmeContent: string = await fs.readFile(readmePath, { encoding: "utf8" });
    const updatedReadmeContent = readmeContent
      .replace(scriptTagPattern, `$1${baseCdnUrl}esm.js$2`)
      .replace(linkTagPattern, `$1${baseCdnUrl}css$2`);

    await fs.writeFile(readmePath, updatedReadmeContent);
  }
})();
