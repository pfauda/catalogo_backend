'use strict';

const path = require('path');
const globals = require('./globals');
var nodegit = require('nodegit');

/*
function square(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(Math.pow(x, 2));
      }, 2000);
    });
  }
  
  async function layer(x)
  {
    const value = await square(x);
    console.log(value);
  }
  
  layer(10);
*/

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
				return repo.getMasterCommit();
			})
			.then(function(firstCommitOnMaster){
				// History returns an event.
				walker = repo.createRevWalk();
				walker.push(firstCommitOnMaster.sha());
				walker.sorting(nodegit.Revwalk.SORT.Time);
				return walker.fileHistoryWalk(historyFile, 5000);
			})
			.then(compileHistory)
			.then(function() {
				historyCommits.forEach(function(entry) {
					commit = entry.commit;
					users.push({
						'fecha': commit.date(),
						'id': commit.sha(),
						'name': commit.author().name(),
						'email': commit.author().email(),
						'asunto': commit.summary()
					});

				});
			})
			.done((_rdone)=>{
				resolve_prom(users);
			},(_error) => {
				reject_prom('Falló LOG de GIT -> ' + _error.name + ': ' + _error.message);
			});

	});
  
}

async function getLogSync(historyFile) {
	const logs = await getLog(historyFile);
	return logs;
}

/*
var us = getLogSync('03_Design/Services/VepLINK/Service Schemas/plVepLINK_ConsultarPendientesPago.xsd');
console.log('us:', us);
*/

/*
getLogSync('03_Design/Services/VepLINK/Service Schemas/plVepLINK_ObtenerTokenAFIPTD.xsd').then((usrs)=>{
  console.log(usrs);
});
*/

getLogSync('03_Design/Services/VepLINK/Service Schemas/plVepLINK_ObtenerTokenAFIPTD.xsd').then((usrs)=>{
	console.log(usrs);
});

