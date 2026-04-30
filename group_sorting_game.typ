#set page(
  margin: 1in,
  footer: context align(center, counter(page).display("1")),
)
#set text(size: 11pt)

= POLI 172 Honors Project: A Tractable Group-Sorting Game

This note describes a simplified game that is close in spirit to your original proposal, but much easier to define, solve, and implement. The key idea is that players care about being in a social group whose local majority matches their own type, but they may also dislike being in a crowded group.

== 1. What this game is trying to capture

The game is meant to capture a simple version of voluntary segregation and subgroup formation. Players prefer to be in groups where the local social environment matches their own type, but they also face some cost from being in a larger group. The strategic question is therefore: _which group should I join?_ 

== 2. Players and types

There are four players:

- Player 1 is type $A$.
- Player 2 is type $A$.
- Player 3 is type $B$.
- Player 4 is type $B$.

You can interpret type as a player's preferred candidate, preferred norm, preferred policy, or preferred group culture.

== 3. Available actions

There are two social groups: Group 1 and Group 2.

Each player chooses one of the two groups. So each player's strategy set is

$S_i = {1, 2}$.

A strategy profile is therefore a four-entry vector telling us which group each player joined. For example:

- $(1,1,2,2)$ means Players 1 and 2 join Group 1, while Players 3 and 4 join Group 2.
- $(1,2,1,2)$ means Players 1 and 3 join Group 1, while Players 2 and 4 join Group 2.

Since each of the four players has two possible actions, there are $2^4 = 16$ strategy profiles in total.

== 4. How group outcomes are determined

After players choose groups, each group has a composition. A group's "local outcome" is determined by the majority type in that group.

- If a group has more $A$-types than $B$-types, that group's outcome is $A$.
- If a group has more $B$-types than $A$-types, that group's outcome is $B$.
- If a group is tied (one $A$ and one $B$), treat the expected ideological payoff as $r/2$ for each player in that group.

This lets you avoid writing a separate voting stage. Intuitively, if a group is evenly split, each side has a 50 percent chance of getting its preferred local outcome.

== 5. Payoffs

Let:

- $r > 0$ be the reward from being in a group whose local outcome matches your own type.
- $c > 0$ be the congestion cost from each _other_ person in your group.

Then player $i$'s payoff is:

$u_i = "ideological fit payoff" - "congestion cost."$

More explicitly:

- If your own type is the majority in your group, your ideological fit payoff is $r$.
- If the opposite type is the majority in your group, your ideological fit payoff is $0$.
- If your group is tied, your ideological fit payoff is $r/2$.

And your congestion cost is:

$c (n_g - 1)$

where $n_g$ is the size of the group you joined.

So the full payoff rule is:

$u_i = "fit"_i - c (n_g - 1)$

where $"fit"_i in {0, r/2, r}$ depending on the composition of the group.

== 6. What you should do to solve the game

The easiest way to solve this game is by brute force.

Step 1: Write out all 16 strategy profiles.

Step 2: For each profile, determine:

- who is in Group 1,
- who is in Group 2,
- the type composition of each group,
- each player's payoff.

Step 3: For each profile, check whether any one player can improve by switching groups while the other three players stay put.

- If at least one player can improve by switching, that profile is *not* a Nash equilibrium.
- If no player can improve by switching, that profile *is* a Nash equilibrium.

You do *not* need to be clever at first. It is perfectly fine to work through all 16 profiles one by one.

== 7. A useful template for each profile

For each strategy profile, I recommend writing the following:

- Strategy profile:
- Group 1 composition:
- Group 2 composition:
- Payoff vector $(u_1, u_2, u_3, u_4)$:
- Profitable unilateral deviation(s):
- Nash equilibrium? Yes or No.

== 8. Worked example

Take the profile $(1,1,2,2)$.

This means:

- Group 1 contains Players 1 and 2, both of whom are type $A$.
- Group 2 contains Players 3 and 4, both of whom are type $B$.

So each player is in a group where their own type is the local majority. Each group has size 2. Therefore each player gets:

$u_i = r - c$

So the payoff vector is:

$(r-c, r-c, r-c, r-c)$

Now check deviations. Suppose Player 1 deviates from Group 1 to Group 2. Then Group 2 would contain Players 1, 3, and 4, so its composition would be one $A$ and two $B$'s. That means the local majority would be $B$, which Player 1 does *not* like. Player 1's payoff after deviating would be:

$0 - 2c = -2c$

Since $r-c > -2c$ for any positive $r$ and $c$, Player 1 would not want to deviate. The same logic applies to the other players. So $(1,1,2,2)$ is a Nash equilibrium.

By symmetry, $(2,2,1,1)$ is also a Nash equilibrium.

== 9. The full list of 16 strategy profiles

Below is the list you should work through.

1. $(1,1,1,1)$
2. $(1,1,1,2)$
3. $(1,1,2,1)$
4. $(1,1,2,2)$
5. $(1,2,1,1)$
6. $(1,2,1,2)$
7. $(1,2,2,1)$
8. $(1,2,2,2)$
9. $(2,1,1,1)$
10. $(2,1,1,2)$
11. $(2,1,2,1)$
12. $(2,1,2,2)$
13. $(2,2,1,1)$
14. $(2,2,1,2)$
15. $(2,2,2,1)$
16. $(2,2,2,2)$

Again, for each one, compute the payoff vector and then check whether any player has a profitable unilateral deviation.

== 10. A hint about the mixed-group profiles

Profiles like $(1,2,1,2)$ or $(1,2,2,1)$ produce one $A$ and one $B$ in each group. In those cases, each player in a tied group gets ideological fit payoff $r/2$, not $r$.

So if a player is in a tied group of size 2, their payoff is:

$r/2 - c$

You should compare that to what happens if the player moves to the other group and creates a strict local majority for their own type.

This is where the comparison between $r$ and $c$ becomes important.

== 11. What you should be able to conclude

After checking all 16 profiles, you should be able to say:

- which strategy profiles are pure-strategy Nash equilibria,
- how the answer depends on the relative size of $r$ and $c$,
- what the model predicts about voluntary sorting and segregation.

One natural conjecture is that when ideological fit matters a lot relative to congestion, players will sort into like-minded groups. Your job is to verify this carefully by checking best responses.

== 12. Empirical experiment

For the formal analysis, stop with the one-shot game above.

However, we will _try_ to make the Game Lab more dynamic. So, we can look at the dynamics.

We may also want to consider one of two extensions
  - A diversity bonus, where each player gets a bonus point if the group includes at least one A and B player.
  - A switching cost.

If you want to try one of these out, try to think through how you think they might affect behavior. Include this in your write-up. 


== 13. Suggested structure for your write-up

A clean paper could proceed in the following order:

1. Define players, types, strategies, and payoffs.
2. Write out all 16 strategy profiles.
3. Compute the payoff vector for each profile.
4. Check unilateral deviations from each profile.
5. Identify all pure-strategy Nash equilibria.
6. Explain in plain language what those equilibria mean.
7. State 2--3 behavioral hypotheses for the experiment.

The key is to be systematic. Do not skip steps. For this game, the brute-force method is completely acceptable and will also make your reasoning easy for the reader to follow.
