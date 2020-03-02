'use strict';

const globals = require('./globals');

var nodegit = require('nodegit'),
	path = require('path');

function getLog(historyFile) {

	var walker,
		historyCommits = [],
		commit,
		repo,
		users = [];

	// This code walks the history of the master branch and prints results
	// that look very similar to calling `git log` from the command line

	function compileHistory(resultingArrayOfCommits) {

		var lastSha;

		if (historyCommits.length > 0) {
			lastSha = historyCommits[historyCommits.length - 1].commit.sha();
			if (resultingArrayOfCommits.length == 1 &&
            resultingArrayOfCommits[0].commit.sha() == lastSha
			) {
				return;
			}
		}

		resultingArrayOfCommits.forEach(function(entry) {
			historyCommits.push(entry);
		});

		lastSha = historyCommits[historyCommits.length - 1].commit.sha();

		walker = repo.createRevWalk();
		walker.push(lastSha);
		walker.sorting(nodegit.Revwalk.SORT.TIME);

		return walker.fileHistoryWalk(historyFile, 5000)
			.then(compileHistory);

	}

	return new Promise(function(resolve_prom, reject_prom) {

		nodegit.Repository.open(path.resolve(globals.ROOT_DIR, './.git'))
			.then(function(r) {
				repo = r;
				//return repo.getMasterCommit();
				return repo.getBranchCommit('origin/staging');
			})
			.then(function(firstCommitOnMaster){
				// History returns an event.
				walker = repo.createRevWalk();
				walker.push(firstCommitOnMaster.sha());
				walker.sorting(nodegit.Revwalk.SORT.Time);
				return walker.fileHistoryWalk(historyFile, 2500);
			})
			.then(compileHistory)
			.then(function() {
				historyCommits.forEach(function(entry) {
					commit = entry.commit;

					users.push({
						'date': commit.date(),
						'sha': commit.sha(),
						'name': commit.author().name(),
						'email': commit.author().email(),
						'summary': commit.summary(),
						'body': commit.body()
					});

				});
			})
			.done((_rdone)=>{
				resolve_prom(users);
			},(_rerror) => {
				reject_prom('Falló las obtención del LOG de modificaciones de GIT!');
			});

	});
  
}

async function getLogSync(_historyFile) {
	const users = await getLog(_historyFile);
	return users;
}

module.exports = {
	getLog,
	getLogSync
};