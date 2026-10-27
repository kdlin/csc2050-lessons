/* Reference glossary for the toolbar's "Reference" button (searchable). */
window.GM_GLOSSARY = {
  title: "Reference",
  groups: [
    { title: "Processes and memory", entries: [
      { term: "fork()", def: "Copies the whole process. Returns 0 in the child and the child's PID in the parent." },
      { term: "wait(NULL)", def: "Blocks until a DIRECT child terminates, then reaps it." },
      { term: "mmap", aka: "MAP_SHARED | MAP_ANONYMOUS", def: "Allocates memory; with MAP_SHARED created before fork, parent and child see the same bytes." },
      { term: "munmap(p, len)", def: "Frees an mmap region; same pointer and same byte length." }
    ]},
    { title: "Mutex", entries: [
      { term: "race condition", def: "The result depends on the timing of the processes, not on the code." },
      { term: "critical section", def: "The code that touches shared data." },
      { term: "mutex", aka: "mutual exclusion", def: "A guard that lets at most one process into the critical section at a time." },
      { term: "deadlock", def: "Every process waits for another, so none can ever continue." },
      { term: "lockout", aka: "starvation", def: "A process is kept out even though the critical section is free or it is being skipped unfairly." },
      { term: "busy waiting", aka: "spinning", def: "A loop that re-checks a condition until it changes, e.g. while (flag) ;" },
      { term: "Peterson", def: "flag[me]=1; turn=other; while (flag[other] && turn==other); The last one to say 'after you' waits." },
      { term: "flag[i]", aka: "c1 / c2 in lecture", def: "Peterson's raised hand: process i wants to enter." },
      { term: "turn", aka: "'flag' in lecture", def: "Peterson's tiebreaker: whose turn it is when both want in." },
      { term: "store buffer", def: "Per-core write queue; a write can be invisible to other cores for a moment, which breaks plain Peterson." },
      { term: "atomic", def: "An operation that cannot be split by the scheduler; plain C count++ is not atomic." }
    ]},
    { title: "Directories", entries: [
      { term: "opendir(path)", def: "Opens a folder; returns DIR* or NULL on failure." },
      { term: "readdir(d)", def: "Returns the next struct dirent* each call, NULL when there are no more entries." },
      { term: "closedir(d)", def: "Releases the DIR handle (a file descriptor)." },
      { term: "d_name", def: "The entry's NAME only, not a full path." },
      { term: ". / ..", def: "Every folder lists itself (.) and its parent (..). Skip both when recursing." },
      { term: "stat(path, &st)", def: "Fills struct stat; returns 0 on success, -1 on error (struct is then garbage)." },
      { term: "lstat", def: "Like stat but describes a symlink itself instead of following it." },
      { term: "S_ISDIR(st.st_mode)", def: "True if the stat'd item is a directory. S_ISREG = regular file." },
      { term: "snprintf", def: "printf into a string, never writing past the size you give it." },
      { term: "strcmp(a, b)", def: "Compares string contents; returns 0 when equal. Never compare strings with ==." }
    ]}
  ]
};
