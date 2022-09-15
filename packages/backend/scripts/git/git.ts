const $cExec = require('command-exec');

type Repo = {
    diskUsage: number,
    name: string,
    url: string
}

( async () => {
    const repo_organization = 'LatticeX-Foundation';
    const limit = 1000;
    const repos: Repo[] = JSON.parse(await $cExec(`gh repo list ${repo_organization} --limit ${limit} --json diskUsage,name,url`));
    //console.log(repos);
    for(const repo of repos) {
        if(repo.diskUsage < 300 * 1024) {
            $cExec(`git clone --recurse-submodules -j8 ${repo.url}`).then((it) => {
                console.log(`fetched: ${repo.url}` );
            }).catch((err) => {
                console.log(err)
            });

        }
        //console.log(repo);
    }
})();