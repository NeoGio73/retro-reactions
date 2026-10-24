# Retro Reactions

A General Chemistry I review game in four retro arcade stages:

1. **Crater Patrol** (a moon-buggy side-scroller): balancing equations
2. **River Run** (a river-canyon shooter): stoichiometry
3. **Bond Defender** (a horizontal defense shooter): Lewis structures
4. **Reaction Brawl** (a one-on-one arcade showdown): five fights with the Reaction Gang, then Mr. X, using all three skills

Play it at https://neogio73.github.io/retro-reactions/

- `index.html` is the whole game in one file. Finishing all four stages is worth 8 points of extra credit: students download a PNG completion certificate with a verification code and upload it to the assignment. The amount is set by `EXTRA_CREDIT` near the top of the shell script.
- `retro-reactions-intro.mp4` is the arcade intro. It plays on the title screen when a student presses Start, before the name page.
- `crater-patrol-intro.mp4` is the moon buggy clip. It plays right before Crater Patrol when a student starts a new mission.
- `river-run-intro.mp4` plays between Crater Patrol and River Run.
- `bond-defender-intro.mp4` plays between River Run and Bond Defender.
- `reaction-brawl-intro.mp4` plays between Bond Defender and Reaction Brawl.
- Students can skip any of the clips.

## Announcement banner

`banner.html` is an animated trailer banner for the D2L announcement (embed it in an iframe). It plays `trailer.mp4` (or `trailer.webm`) muted, with the title cards drawn on top; viewers can turn the sound on. It pauses when scrolled out of view and shows `banner_poster.jpg` with the end card if the video can't play or the viewer prefers reduced motion.

## Credits and license

Built by John Picione for General Chemistry I at Daytona State College. The four stages are original games in the spirit of 1980s arcade genres (a moon-buggy side-scroller, a river-canyon shooter, a horizontal defense shooter, and a one-on-one showdown); the characters, artwork, sound, and intro clips were made for this game, and the people whose likenesses appear in the Reaction Gang gave their permission. Fonts: Oxanium and Silkscreen (Google Fonts, SIL Open Font License). Code and content are released under the MIT License (see `LICENSE`); the Reaction Gang likenesses are not licensed for reuse outside this game.
