function help() {
  console.log(`silicon-ranch-spec CLI

Usage: srsp <command> [options]

Commands:
  init       Install SRSP skills and docs into the current project.
  start      Create a new spec workspace (use --template <name> to pre-seed).
  status     Show active spec and list all specs.
  switch     Switch the active spec.
  doctor     Validate the active spec metadata and artifacts.
  help       Show this help message.

For the full workflow, use these commands inside Claude Code:
  /srsp-start
  /srsp-explore
  /srsp-propose
  /srsp-apply
  /srsp-archive
`);
}

module.exports = { help };
