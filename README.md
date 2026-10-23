# On-task Otter

On-task Otter is a shared classroom tool that helps students build stamina for staying on task. It gives a whole class a friendly, visual reason to stay on task during independent work, while giving teachers a simple timer and noise meter to support classroom routines.

The class looks after an otter that cheers them on while they work. It is an original classroom tool, not affiliated with any other focus app, and it is designed for use on a classroom display, such as a projector or TV.

## The Classroom Need

During activities such as an independent math warm-up, students may struggle to stay quiet and on task for the full work period. A regular timer can show how much time is left, but it does not always give students a reason to keep going.

On-task Otter turns an on-task session into a shared goal. When the class completes a session, their character earns stars that can be used to unlock clothes and accessories. The noise meter also helps the class notice whether the room matches the kind of work they are doing.

## Who It Helps

- **Students:** Build on-task stamina and tolerance for working independently for five, ten, or more minutes.
- **Teachers:** Use a motivating whole-class routine and a visible noise meter for classroom management.
- **Substitute teachers:** Start a familiar on-task routine without relying on one teacher's personal device.

## MVP: The First Version

The first version keeps the experience simple and useful for one classroom. It saves classroom progress on the current device, and a teacher can download it to a file to carry it to another computer. No one signs in.

- A shared on-task-session timer where the teacher can enter a session length in minutes, save a named setup as a favorite, and return to favorites for future sessions.
- A classroom character that earns stars when an on-task session is completed.
- A point shop where the character can get clothes and accessories.
- A noise meter with adjustable sensitivity for the selected type of work:
  - Independent or silent work
  - Partner work
- When the room becomes too loud, the timer pauses automatically. It resumes when the room is back on track, and the teacher can still pause or reset the session manually.
- A history of previous on-task sessions.
- A display designed to be shared with the whole class.

## A Typical Session

1. The teacher selects the type of work and enters an on-task-session length, or chooses a saved favorite.
2. The class watches the timer and noise meter while they work. If the room becomes too loud, the timer pauses until the sound level returns to the goal.
3. When the session is completed, the class earns stars for its character.
4. The class can use earned stars to personalize the character over time.

## Saving a Classroom

On-task Otter has no accounts. Everything a class earns is kept in the browser on
the computer it was earned on, and saves itself as it changes.

To move a classroom to another computer, or keep a backup, the teacher presses
**Save Classroom Setup** and downloads a save file. It holds every class (each
one's stars, session history, otter name, outfit and rooms) and the timer settings and
session presets they share. Restoring that file on any computer brings every
class back.

A teacher with several classes picks the class on screen from the menu beside
the logo. Each class earns its own stars and keeps its own otter, with its own
name, outfit and rooms.

## Later Ideas

These are valuable possibilities, but are not needed for the first version:

- Support for multiple class sections.
- Easy display options for a TV or Roku through HDMI or AirPlay.
- A choice to use silence or calming background audio.

## Project Principles

- Keep the classroom experience quick to start and easy to understand.
- Motivate the whole class without relying on physical rewards.
- Make the noise meter useful for different learning situations, not only silent work.
- Keep the first version focused on one classroom before adding more complex options.

## Local Setup and Development

You will need [Bun](https://bun.sh/) installed on your computer.

1. In this project folder, install the project tools:

   ```bash
   bun install
   ```

2. Start the app for local development:

   ```bash
   bun run dev
   ```

3. Open the local address shown in your terminal to view the app.

To create a production build, run:

```bash
bun run build
```

## About, Privacy, and the Footer

Every screen carries a footer crediting the
[EdTech-a-thon](https://edtechathon.com) and linking to two shared pages:
`/about`, which introduces the people behind the project, and `/privacy`, which
explains what the app stores and what it never collects. Both are reached
through `src/hooks/useRoute.js`, a small address watcher that keeps the site a
single page. Teachers who write in are answered at support@teacher.dev.

## Publishing the Website

The website is published on Vercel, and `vercel.json` describes how addresses on
it are answered:

- Vercel builds the site with `bun run build` and serves the finished `dist`
  folder.
- The whole site is one page that swaps between the classroom, `/about`, and
  `/privacy` as you move around it, so every address that is not a real file
  loads that page. A teacher can refresh, bookmark, or share any of those links
  and still land on a working app instead of a "not found" screen.
- Each build names its files after their contents, so browsers keep them for a
  year, while the page itself is checked on every visit. A classroom always opens
  the newest version without a hard refresh.
