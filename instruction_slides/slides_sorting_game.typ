#import "lecture-slides.typ": *
#show: lecture-slides

#title-slide(
  [Group Sorting Game],
  [POLI 172 --- Games and Human Behavior],
)

// ── The Game ──────────────────────────────────────────────────────

#slide([Today's Game])[
  Each of you is randomly assigned a *type*: #text(fill: rgb("#2563eb"), weight: "bold")[A] or #text(fill: rgb("#ea580c"), weight: "bold")[B] (50/50 split).

  #v(8pt)

  And randomly placed in *Group 1* or *Group 2*.

  #v(8pt)

  Your *type* stays the same the whole game. Your *group* can change every round if you choose to switch.

  #v(12pt)

  #align(center, text(size: 16pt, fill: caption-clr)[
    _Think of A vs B as two preferences, two candidates, or two cultures._
  ])
]

#slide([How a round works])[
  + The class sees the current composition of both groups.
  + Each group's *outcome* is its majority type. (Ties are broken by a coin flip that round.)
  + You earn *payoff = fit − congestion*.
  + You decide *stay* or *switch* groups for the next round.

  #v(8pt)

  Then we repeat.
]

#slide([Payoffs])[
  #align(center,
    table(
      columns: (1fr, auto),
      stroke: 0.5pt + rule-gray,
      inset: 8pt,
      align: (left, center),
      [*Outcome in your group*], [*Fit payoff*],
      [Your type wins the majority], text(fill: rgb("#16a34a"), weight: "bold")[+4 points],
      [Your group is tied], text(fill: rgb("#ca8a04"), weight: "bold")[+2 points],
      [The opposite type wins], text(fill: rgb("#dc2626"), weight: "bold")[0 points],
    )
  )

  #v(12pt)

  *Congestion* costs ≈ 2 points per round in a typical evenly-split group. Bigger groups cost more, smaller groups cost less.

  #v(8pt)

  Net round payoff = *fit − congestion*. Negative scores are normal.
]

#slide([Two Sessions Today])[
  *Session A* --- about 14 minutes
  - 20 rounds
  - Switching is *free*

  #v(8pt)

  *Session B* --- about 14 minutes
  - 20 rounds
  - Each switch *costs 1 point*

  #v(12pt)

  #text(size: 15pt)[Between sessions you'll fill out a short reflection survey, then re-enter the same name and email to start Session B.]
]

#slide([Game can end early])[
  Each session has up to 20 rounds.

  #v(8pt)

  The game ends *as soon as the class is perfectly sorted* --- all type A's in one group and all type B's in the other.

  #v(8pt)

  This is one of the *Nash equilibria* of the game. Whether and when you reach it is part of what we're testing.

  #v(12pt)

  #align(center, text(size: 16pt, fill: caption-clr)[
    _If we sort fast in Session A, you'll see if the switching cost in Session B slows it down._
  ])
]

// ── Walkthrough ───────────────────────────────────────────────────

#section-slide([How the experiment works], subtitle: [A walkthrough of what you will see])

#img-slide(
  [Consent],
  [
    First, you will see a consent screen.

    #v(6pt)

    Read it and click *I Agree* to continue.
  ],
  image("screenshots/00_consent.png", width: 90%),
)

#img-slide(
  [Step 1: Register],
  [
    Enter your *first name*, *last name*, and *UC Merced email prefix* (the part before `@ucmerced.edu`).

    #v(6pt)

    Click *Join Experiment*.
  ],
  image("screenshots/01_registration.png", width: 90%),
)

#img-slide(
  [Step 2: Read the instructions],
  [
    The instructions screen restates the game and shows the actual reward, congestion, and switching-cost numbers for this session.

    #v(6pt)

    Read carefully, then click *I understand. Start the game.*
  ],
  image("screenshots/02_introduction.png", height: 10cm),
)

#img-slide(
  [Step 3: See the round result],
  [
    Each round shows:

    - Your type and current group
    - Both groups' A/B counts
    - Each group's outcome
    - Your payoff for this round (fit, congestion, net)

    #v(6pt)

    Click *Continue* to move to the switch decision.
  ],
  image("screenshots/03_round_result.png", height: 10cm),
)

#img-slide(
  [Step 4: Switch decision],
  [
    Decide to *stay* in your group or *switch* to the other.

    #v(6pt)

    Your decision applies starting *next round*.

    #v(6pt)

    In Session B, the *Switch* button shows "costs 1 pt" --- you pay each time you change.
  ],
  image("screenshots/04_switch_decision.png", height: 10cm),
)

#img-slide(
  [Step 5: Wait for everyone],
  [
    After you submit, you wait briefly for everyone else to decide.

    #v(6pt)

    Once all decisions are in, the next round starts.
  ],
  image("screenshots/05_waiting.png", width: 90%),
)

#img-slide(
  [Exit survey: round summary],
  [
    After the last round you see a table of every round you played: your type, your group, the composition, fit, congestion, switches, and net payoff.

    #v(6pt)

    Use this to reflect on what you tried.
  ],
  image("screenshots/06_exit_table.png", height: 10cm),
)

#slide([Exit survey: reflection])[
  Below the round table, *three short questions*:

  #v(6pt)

  - What was your strategy for staying or switching?
  - What information mattered most when you decided?
  - Anything that surprised you about how the class behaved?

  #v(12pt)

  Answer thoughtfully --- there are no right or wrong answers. Click *Submit* and you're done with that session.
]

// ── Login ─────────────────────────────────────────────────────────

#stitle([Let's get started])

#v(1fr)

#align(center)[
  #text(size: 16pt)[Open your browser and go to:]

  #v(12pt)

  #text(size: 36pt, weight: "bold", fill: title-red)[poli172.games]

  #v(16pt)

  #text(size: 16pt)[Enter your first/last name and UC Merced email prefix, then click *Join Experiment*.]

  #v(8pt)

  #text(size: 14pt, fill: caption-clr)[
    Works on phones, tablets, and laptops. Use any browser.
  ]
]

#v(1fr)
