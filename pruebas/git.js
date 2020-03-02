"use strict";

const GIT_DIR = 'C:\\Repositorio_Arq';
const FILENAME = 'plCajaAhorro_Crear.xsd';
const NodeGit = require("nodegit");
const Path = require("path");

/*
function GetMasterCommit(repo) {
  return repo.getMasterCommit();
}

function GetHistory(firstCommitOnMaster) {
    // History returns an event.
    var history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.TIME);
    //var history = firstCommitOnMaster.fileHistoryWalk;

    // History emits "commit" event for each commit in the branch's history
    history.on("commit", GetCommit);
    history.start();
}

function GetCommit(commit) {
  console.log("commit " + commit.sha());
  console.log("Author:", commit.author().name() + " <" + commit.author().email() + ">");
  console.log("Date:", commit.date());
  console.log("Commit:", commit.message());
  console.log("Sumary:", commit.summary());
  console.log("Body:", commit.body());
  console.log("Tree:", commit.getTree().contents());
//  commit.tree().contents (err, gitTreeContents) ->
//  console.log gitTreeContents
  //commit.getEntry.then(ReadEntries);
}

NodeGit.Repository.open(Path.resolve(GIT_DIR, "./.git"))
  .then(GetMasterCommit)
  .then(GetHistory)
  .done();
  
///////////////////////

  var master = NodeGit.Repository.open(Path.resolve(GIT_DIR, "./.git")).then(function(repo) {
              return repo.getMasterCommit();
            });

  master.then(function(firstCommitOnMaster){
    // History returns an event.
    var history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.TIME);
//    var history = firstCommitOnMaster.fileHistoryWalk;

    // History emits "commit" event for each commit in the branch's history
    history.on("commit", function(commit) {
        console.log("commit " + commit.sha());
        console.log("Author:", commit.author().name() +
            " <" + commit.author().email() + ">");
        console.log("Date:", commit.date());
        console.log("Commit:", commit.message());
    });

    history.start();

  }).done();

*/

 // Open the repository directory.
NodeGit.Repository.open(Path.resolve(GIT_DIR, "./.git"))
// Open the master branch.
.then(function(repo) {
  return repo.getMasterCommit();
})
// Display information about commits on master.
.then(function(firstCommitOnMaster) {
  // Create a new history event emitter.
  var history = firstCommitOnMaster.history();

  // Create a counter to only show up to 9 entries.
  var count = 0;

  // Listen for commit events from the history.
  history.on("commit", function(commit) {
    // Disregard commits past 9.
    //if (++count >= 9) {
    //  return;
    //}

    // Show the commit sha.
  
    console.log("commit " + commit.sha());

    // Store the author object.
    var author = commit.author();

    // Display author information.
    console.log("Author:\t" + author.name() + " <" + author.email() + ">");

    // Show the commit date.
    console.log("Date:\t" + commit.date());

    // Give some space and show the message.
    console.log(commit.message());

  //  console.log(commit.getEntry("README.md"));
    
  });

  // Start emitting events.
  history.start();
});