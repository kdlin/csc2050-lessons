/* Course manifest for csc2050-lessons: what the toolbar's "Lessons" panel lists.
   Files are siblings inside lessons/. */
window.GM_COURSE = {
  title: "CSC 2050: The Life of a Process",
  modules: [
    { n: 1, title: "Processes", lessons: [
      { title: "Ch 1: The Program Clones Itself (fork)" },
      { title: "Ch 2: Shared Notes (mmap)" }
    ]},
    { n: 2, title: "Lab 7: Counting Files", lessons: [
      { title: "Ch 3: Two Clones, One Marker (Mutex)", file: "03-mutex.html" },
      { title: "Ch 5: The Filing Cabinet (Directories)", file: "05-directories.html" }
    ]},
    { n: 3, title: "Coming next", lessons: [
      { title: "Ch 4: Barriers" },
      { title: "Ch 6: Signals" },
      { title: "Ch 7: Pipes and dup2" }
    ]}
  ]
};
