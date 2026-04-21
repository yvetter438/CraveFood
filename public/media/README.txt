Crave — prospect / creator videos (standard layout)
====================================================

For each creator, use one folder named exactly like their creators-config id (slug):

  media/<slug>/
    01.mp4
    02.mp4
    …
    09.mp4

Tips:
- Use zero-padded numbers so files sort in order in your file browser.
- In posts-config.js, set videoFile to the path from the site root, e.g.:
    videoFile: "media/jalalsamfit/01.mp4"
- Keep filenames lowercase; some hosts are case-sensitive.
- Large MP4s: consider compressing for web before adding (faster loads for demos).

You can use other filenames (e.g. honey_bowl.mp4); numbering just keeps the grind consistent.
