# FrontLaxWeb

A Claude Code skill, in Spanish, that turns a landing page into something the visitor directs with
scroll, cursor or finger: parallax, scroll-driven motion, micro-interactions and spring gestures, in
React (Motion + Lenis) or plain HTML, CSS and JavaScript (GSAP + Lenis). It chooses effects from what
the product needs, and keeps them smooth on computers without a graphics card.

## Install

Inside Claude Code, two lines:

```
/plugin marketplace add Mun1to/Vibeset
/plugin install frontlaxweb@vibeset
```

If the install summary says `Run /reload-plugins to apply`, Claude Code reloads by itself. If it warns and leaves the plugin pending, run `/reload-plugins --force`.

With any other agent, through the [skills.sh](https://skills.sh) registry:

```bash
npx skills add Mun1to/FrontLaxWeb
```

<details>
<summary>Prefer to install it by hand?</summary>

Clone the repository and point your skills folder at it.

```bash
git clone https://github.com/Mun1to/FrontLaxWeb.git
ln -s "$(pwd)/FrontLaxWeb" ~/.claude/skills/frontlaxweb
```

On Windows, with PowerShell:

```powershell
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\skills\frontlaxweb" -Target "C:\path\to\FrontLaxWeb"
```
</details>

## Use it

Ask for a parallax hero, a scroll-driven section, sticky cards or a draggable card, or run
`/frontlaxweb`. Before it writes any design or motion, it asks a short questionnaire about the product,
the audience, the tone and your taste, and hands back a brief for you to approve. If you say "just do
it", it still asks the first three questions: building without context is how generic design happens.

## What it covers

1. **Smooth scroll**, the foundation, with Lenis.
2. **Layer parallax**: slow backgrounds and a faster foreground give depth.
3. **Scroll-linked animation**: properties tied to the scroll position.
4. **Scroll reveal**: elements animate as they enter the viewport.
5. **Sticky and pin**: something stays put while the page changes around it.
6. **Pointer micro-interactions**: 3D tilt, custom cursor, magnetic hover.
7. **Spring gestures**: drag, release and tap with physics you can interrupt halfway.

The effect is chosen by the product. A matrix of eight archetypes, from fintech to creative agency,
says how much motion each one can take and which effects to avoid.

## Motion for everyone, at the right amplitude

Most sites either ignore the reduced-motion preference or switch everything off. This skill uses one
dial, the CSS variable `--motion-gain`, which sets how far things travel:

| Situation | Gain | What the visitor sees |
|---|---|---|
| Default | `1` | The full experience |
| System asks for reduced motion | `0.25` | The same design with a quarter of the travel, as a starting point |
| `?motion=off` in the URL, or the visible control on the page | `0` | Nothing moves on its own; what you drag still responds |
| `?motion=full` in the URL | `1` | Forces the full experience, to review the work |

The gain never touches opacity, so at `0` an effect turns into a fade instead of breaking. Large
movements such as a long parallax need to go lower than `0.25` or become a fade. Automatic loops longer
than five seconds still need their own pause control, as WCAG 2.2.2 requires.

## Smooth without a graphics card

On a computer with hardware acceleration turned off, blurs, blend modes, 3D and JavaScript-driven
scrolling all land on the processor. Every site built with this skill detects that once per visit and
switches to a light mode: native scrolling instead of Lenis, no blurs or blends, and a version without
3D. With a graphics card, nothing changes. Measured with a 6x CPU slowdown and no graphics card, one
site went from 1.7 to 27.5 frames per second. `plantillas/medir-scroll-visible.mjs` is the script that
measures what actually reaches the screen.

## What is inside

```
SKILL.md       The method the agent follows
plantillas/    Templates in React and vanilla: reveals, nested parallax, draggable card, light mode
Components/    Interface pieces, each one with the reason it works
Designs/       Complete visual languages, with hard rules and when not to use them
references/    Recipes, the archetype matrix and reference sites
```

The instructions and code comments are in Spanish.

## Credits

The spring gesture principles are distilled from the `apple-design` skill in
[emilkowalski/skills](https://github.com/emilkowalski/skills), which collects motion principles from
Apple's WWDC talks.

The templates use [Motion](https://motion.dev), [Lenis](https://lenis.darkroom.engineering) and, for
scrubbing and pinning, [GSAP](https://gsap.com). None of them is bundled here: you install them in your
own project, under their own licences. GSAP is free, including for commercial use, but its licence does
not allow using it in no-code visual builders that compete with Webflow.

<details>
<summary>Licence notice of emilkowalski/skills</summary>

```text
MIT License

Copyright (c) 2026 Emil Kowalski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
</details>

## Don't trust it, check it

Open source only helps if somebody actually reads the code, and almost nobody does. So instead
of asking you to trust this project, here is the prompt to check it: point your own AI agent at
this repository and get a security report, in your language, in a few minutes, even if you do
not know how to program.

**[Open AI-AUDIT.md](AI-AUDIT.md)** and paste it into Claude Code, Codex, Cursor, Copilot or
whatever you use. It is the same prompt in every public repository here, so you can compare.

## License

MIT, see [LICENSE](LICENSE).
