import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import { workspacesPath } from 'src/utils';


const options: Partial<SimpleGitOptions> = {
    baseDir: workspacesPath,
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
};

export class VersionningRepository {
    private git: SimpleGit;

    constructor() {
        this.git = simpleGit(options);
        this.initiateRepos()
    }

    private async initiateRepos() {
        try {

            await this.git.init()
        } catch (error) {
            console.log(error);
        }
    }

    async addCommit(path: string, message: string, description: string, author: string) {
        try {
            await this.git.add(path)

            const name = author.split(' ')[0]
            const email = author.split('')[1]

            await this.git.addConfig("user.name",name)
            await this.git.addConfig("user.email",email)

            await this.git.commit(message, ["-m", description, `--author`, `${name} <${email}>`])

        } catch (error) {
            console.log(error)
        }
    }

    async logHistory(path: string) {
        const logs = await this.git.log(['--', path])
        /**
         * const query: string[] = [];
    const fileName = getFilePath()

    const { total: totalCount } = await this.git.log<DefaultLogFields>([
      ...query,
      '--',
      fileName,
    ]);

    const { all: commits, total: pageLength } =
      await this.git.log<DefaultLogFields>([
        `--max-count=${size}`,
        `--skip=${(page - 1) * size}`,
        ...query,
        '--',
        fileName,
      ]);

    const maxPages = Math.ceil(totalCount / size);

    return {
      items: commits,
      pageLength: pageLength,
      page: page,
      maxPages: maxPages,
      size: size,
      totalCount,
    };
         */
        return logs
    }

    async showContentAtCommit(path: string, commitHash: string) {
        const log = await this.git.show(`${commitHash}:${path}`)
        return log
    }

    async diffCommit(path: string, commitHash: string) {
        console.log("diff  ============================")

        const metaData= await this.git.log([commitHash,'--', path]);

        console.log(metaData.all)
        const changes = await this.git.show([commitHash, '--pretty=format:%b', '--', path]);
        return {changes,metaData: metaData.latest}
    }

    rollBack(commitHash: string) {
        return 'Rollback is not implemented yet!';
    }
}