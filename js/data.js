/**
 * Dominion Warzone scoring data.
 *
 * Structure:
 *   EVENT_DATA.days[] -> { id, label, phase, available, sections[] }
 *   sections[]        -> { title, items[] }
 *   items[]           -> {
 *     title, points, description,
 *     image,          // optional path under assets/images/, or null for a placeholder
 *     imageCaption,   // optional short caption shown under the image
 *     fragmentGallery: {  // optional, renders a tight mosaic of fragment cards
 *       rarity,           // "legendary" | "epic" -> picks the CSS background color
 *       rows: [3, 3, 3],  // how many tiles per row, in order (rows sum to items.length)
 *       items: [{ image, alt }, ...],  // each a transparent-background card cutout
 *     },
 *     notes: {        // optional, rendered as "Where to find" / "Where to use" lists
 *       findWhere: [...],
 *       useWhere: [...],
 *     },
 *   }
 *
 * To add a new day: copy an existing day object, set `available: true`,
 * fill in `sections`, and set `image` on each item to a path under
 * assets/images/ once you have a screenshot/icon for it.
 *
 * To add a whole new top-level feature later (outside Dominion Warzone),
 * add a new entry to NAV_SECTIONS and give it its own data + render function.
 */

const EVENT_DATA = {
  eventName: "Dominion Warzone",
  // Daily scoring reset, in UTC. Used to convert to each visitor's local time.
  resetHourUTC: 0,
  resetMinuteUTC: 0,
  days: [
    {
      id: 1,
      label: "Day 1",
      phase: "Preparation",
      available: false,
      sections: [],
    },
    {
      id: 2,
      label: "Day 2",
      phase: "Preparation",
      available: true,
      sections: [
        {
          title: "Talent Recruitment",
          items: [
            {
              title: "Consume 1 Champion Fragment (Legendary)",
              points: 2000,
              description:
                "Spend a Champion Fragment to unlock a new Champion, activate a slot on the Wall of Honor, or promote a Legendary-rarity Champion. This is the highest-value single action in the table — prioritize any Legendary fragment consumption you were already planning.",
              fragmentGallery: {
                rarity: "legendary",
                rows: [3, 3, 3],
                items: [
                  { image: "assets/images/fragments/legendary/empty-slot.png", alt: "Empty Legendary fragment slot" },
                  { image: "assets/images/fragments/legendary/champion-10.png", alt: "Legendary Champion fragment" },
                  { image: "assets/images/fragments/legendary/champion-17.png", alt: "Legendary Champion fragment" },
                  { image: "assets/images/fragments/legendary/champion-06.png", alt: "Legendary Champion fragment" },
                  { image: "assets/images/fragments/legendary/champion-10b.png", alt: "Legendary Champion fragment" },
                  { image: "assets/images/fragments/legendary/champion-03.png", alt: "Legendary Champion fragment" },
                  { image: "assets/images/fragments/legendary/champion-02.png", alt: "Legendary Champion fragment" },
                  { image: "assets/images/fragments/legendary/champion-33.png", alt: "Legendary Champion fragment" },
                  { image: "assets/images/fragments/legendary/champion-eva.png", alt: "Eva — Legendary Champion fragment" },
                ],
              },
              notes: {
                findWhere: [
                  "Commission and event rewards (including these Talent Recruitment milestones)",
                  "Recruitment/summon pulls that give shards instead of a full Champion",
                  "Shop bundles and the Commerce Guild / guild shop, when a specific Champion's fragments are on sale",
                  "Verify against your own reward mail — exact fragment sources aren't officially documented and vary by patch",
                ],
                useWhere: [
                  "Champions screen → the specific Champion's page, to unlock or promote them once you hit the fragment threshold",
                  "Wall of Honor screen, to activate or upgrade a displayed slot",
                ],
              },
            },
            {
              title: "Consume 1 Champion Fragment (Epic)",
              points: 100,
              description:
                "Same actions as above (unlock / Wall of Honor / promote), but for Epic-rarity Champions. Worth far less than the Legendary version, so don't burn Legendary fragments early just to farm this row — spend Epic fragments here instead.",
              fragmentGallery: {
                rarity: "epic",
                rows: [1, 3, 3],
                items: [
                  { image: "assets/images/fragments/epic/empty-slot.png", alt: "Empty Epic fragment slot" },
                  { image: "assets/images/fragments/epic/champion-15.png", alt: "Epic Champion fragment" },
                  { image: "assets/images/fragments/epic/champion-08.png", alt: "Epic Champion fragment" },
                  { image: "assets/images/fragments/epic/champion-37.png", alt: "Epic Champion fragment" },
                  { image: "assets/images/fragments/epic/champion-27.png", alt: "Epic Champion fragment" },
                  { image: "assets/images/fragments/epic/champion-41.png", alt: "Epic Champion fragment" },
                  { image: "assets/images/fragments/epic/champion-34.png", alt: "Epic Champion fragment" },
                ],
              },
              notes: {
                findWhere: [
                  "Same sources as Legendary fragments, just for Epic-rarity Champions — commissions, event rewards, recruitment pulls, and shop/guild-shop bundles",
                ],
                useWhere: [
                  "Champions screen → the specific Champion's page, to unlock or promote them",
                  "Wall of Honor screen, to activate or upgrade a displayed slot",
                ],
              },
            },
            {
              title: "Increase Power by 1",
              points: 1,
              description:
                "Any account Power gained today counts — leveling Champions, unlocking new ones, or promoting them all raise Power. Because this scales with the size of your account, it passively stacks alongside every other action below.",
              image: "assets/images/items/level-up-button.png",
              imageCaption:
                "The Level Up button on a Champion's page — each level costs the resource shown (here, a Champion's leveling material) and raises Power.",
              notes: {
                findWhere: [
                  "Not something you \"find\" directly — Power goes up as a side effect of leveling, unlocking, or promoting Champions",
                ],
                useWhere: [
                  "Champions screen → pick a Champion → Level Up button shown above (costs that Champion's leveling material, e.g. the item pictured)",
                  "Also rises from unlocking a new Champion or promoting one with fragments, same as the two rows above",
                ],
              },
            },
            {
              title: "Spend 1× Legendary Training Manual",
              points: 200,
              description:
                "Training Manuals are used to level up a Champion's skills. If you're sitting on a stockpile, today is a good day to spend them — each one used counts toward the event score in addition to its normal in-game benefit.",
              image: "assets/images/items/legendary-training-manual.png",
              imageCaption: "Legendary Training Manual.",
              notes: {
                findWhere: [
                  "Commission and event rewards, shop bundles, and guild shop — same general sources as fragments",
                  "Verify your own reward mail for the exact source; not officially documented",
                ],
                useWhere: [
                  "Champions screen → a Champion's Skills tab, to upgrade one of their skills",
                ],
              },
            },
            {
              title: "Spend 1× Venturous Memory",
              points: 1200,
              description:
                "Venturous Memory is the premium summoning currency for the Champion recruitment banner. Using it for pulls today is one of the most point-efficient actions available — save up Memory before reset if you can, then spend it during the event window.",
              image: "assets/images/items/venturous-memory.png",
              imageCaption: "Venturous Memory.",
              notes: {
                findWhere: [
                  "Events and event milestones, Ruins Excavation, Home Port Dividends, and shop purchases",
                ],
                useWhere: [
                  "Venturous Recruitment banner, to summon Champions",
                ],
              },
            },
            {
              title: "Earn 1 Credit through packs",
              points: 4,
              description:
                "Credits are earned automatically when you buy certain shop packs — you don't spend anything extra to get this score, it's a side effect of a purchase you were already making. Time any planned pack purchase during the event window for the extra points.",
              image: "assets/images/items/credits.png",
              imageCaption: "Credits, earned from qualifying shop pack purchases.",
              notes: {
                findWhere: [
                  "Awarded automatically when purchasing qualifying packs in the shop — check a pack's reward list for the Credits icon shown here before buying",
                ],
                useWhere: [
                  "Spent in the dedicated Credit shop for exclusive items — separate from the general shop",
                ],
              },
            },
            {
              title: "Complete 1 commission (Common)",
              points: 2000,
              description:
                "Commissions are the guild/personal task board assignments. Common-quality commissions are the easiest to roll and complete, making this one of the most reliable, repeatable point sources in the table.",
              image: "assets/images/commissions/common-example.png",
              imageCaption: "A Common-quality commission tile on the task board.",
              notes: {
                findWhere: [
                  "Commissions board (accepts new commissions periodically; quality is randomized on roll)",
                ],
                useWhere: [
                  "Complete the commission's requirement, then claim it from the same board for the reward and event points",
                ],
              },
            },
            {
              title: "Complete 1 commission (Uncommon)",
              points: 2500,
              description:
                "Same commission system, Uncommon quality. Slightly harder to obtain than Common but worth more — complete whichever quality you have queued rather than waiting for a specific tier.",
              image: "assets/images/commissions/uncommon.png",
              imageCaption: "Uncommon commission quality banner.",
              notes: {
                findWhere: ["Commissions board, same as Common — quality is randomized on roll"],
                useWhere: ["Complete the requirement and claim it from the board"],
              },
            },
            {
              title: "Complete 1 commission (Rare)",
              points: 2750,
              description:
                "Rare-quality commission completion. Keep your commission slots full throughout the day so you're never sitting idle between rolls.",
              image: "assets/images/commissions/rare.png",
              imageCaption: "Rare commission quality banner.",
              notes: {
                findWhere: ["Commissions board, same as Common — quality is randomized on roll"],
                useWhere: ["Complete the requirement and claim it from the board"],
              },
            },
            {
              title: "Complete 1 commission (Epic)",
              points: 3000,
              description:
                "Epic-quality commission completion. These take longer or need better resources to fulfill, but the point value reflects that — worth prioritizing if you can choose between commissions to run.",
              image: "assets/images/commissions/epic.png",
              imageCaption: "Epic commission quality banner.",
              notes: {
                findWhere: ["Commissions board, same as Common — quality is randomized on roll"],
                useWhere: ["Complete the requirement and claim it from the board"],
              },
            },
            {
              title: "Complete 1 commission (Legendary)",
              points: 3250,
              description:
                "The highest-value commission tier. If a Legendary commission is available, it's almost always worth completing over a lower tier, since the point gap is small relative to the resource cost.",
              image: "assets/images/commissions/legendary.png",
              imageCaption: "Legendary commission quality banner.",
              notes: {
                findWhere: ["Commissions board, same as Common — quality is randomized on roll"],
                useWhere: ["Complete the requirement and claim it from the board"],
              },
            },
            {
              title: "Complete 1 Commerce Guild Assist",
              points: 10,
              description:
                "Helping fellow guild members (assists) through the Commerce Guild feature. Low value per action, but assists are typically fast and free, so clear any available assists throughout the day.",
              image: "assets/images/guild/assist-icon.png",
              imageCaption:
                "The Guild Assist marker — shown on technologies in the guild tech tree that can be assisted.",
              notes: {
                findWhere: [
                  "Guild screen → Technology tab — technologies marked with this handshake icon can be assisted",
                ],
                useWhere: [
                  "Tap a marked technology, then use the Assist option on that screen",
                ],
              },
            },
            {
              title: "Perform 1 Commerce Guild Donation",
              points: 25,
              description:
                "Donating resources to the guild's Commerce Guild fund. Like assists, this is a low-cost, repeatable action — worth doing whenever donations are available rather than saving them up.",
              image: "assets/images/guild/donation-buttons.png",
              imageCaption:
                "Donation buttons on a technology's detail screen — donating Credits or Materials both count.",
              notes: {
                findWhere: [
                  "Guild screen → Technology tab → tap a technology (look for the handshake icon) to open its detail screen",
                ],
                useWhere: [
                  "The Donation buttons shown here appear on that detail screen — each has a limited number of attempts with a cooldown before it resets",
                ],
              },
            },
          ],
        },
      ],
    },
    { id: 3, label: "Day 3", phase: "Preparation", available: false, sections: [] },
    { id: 4, label: "Day 4", phase: "Preparation", available: false, sections: [] },
    { id: 5, label: "Day 5", phase: "Preparation", available: false, sections: [] },
    { id: 6, label: "Day 6", phase: "Battle Day", available: false, sections: [] },
  ],
};
