# Retro Reactions

A General Chemistry I review game in four retro arcade stages:

1. **Crater Patrol** (Moon Patrol style): balancing equations
2. **River Run** (River Raid style): stoichiometry
3. **Bond Defender** (Defender style): Lewis structures
4. **Reaction Brawl** (Street Fighter-style showdown): five one-on-one fights with the Reaction Gang, then Mr. X, using all three skills

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
