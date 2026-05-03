export type BeatType = "portal" | "scene" | "quote" | "list" | "verse" | "river" | "verdict" | "scales" | "echo" | "mantra" | "finalQuestion" | "report" | "yamaduta";

export interface Beat {
  type: BeatType;
  headline?: string;
  sub?: string;
  quote?: string;
  attribution?: string;
  items?: { name: string; desc?: string }[];
  label?: string;
  performable?: boolean;
}

export interface Realm {
  id: string;
  nav: string;
  title: string;
  tagline: string;
  theme: "crimson" | "gold" | "silver" | "liberation";
  beats: Beat[];
}

export const realms: Realm[] = [
  {
    id: "descent",
    nav: "I – IV",
    title: "The Descent",
    tagline: "You have died. Now the journey truly begins.",
    theme: "crimson",
    beats: [
      {
        type: "portal",
        headline: "You are dead.",
        sub: "The body you inhabited for decades is already cooling. Your soul — the size of a thumb — is being dragged out of it.",
      },
      {
        type: "yamaduta",
        headline: "The Messengers Come.",
        sub: "They have come for you.",
      },
      {
        type: "quote",
        quote: "Two terrifying messengers of Yama have come — of fierce aspect, bearing nooses and rods, naked, with grinding teeth, as black as crows.",
        attribution: "Garuda Purāṇa · Chapter I",
      },
      {
        type: "scene",
        headline: "The Road South",
        sub: "The path to Yama is 86,000 leagues long. No food. No water. No shade. You walk it in thirteen days. The sun burns without setting. The soul is blown about like a dry leaf.",
      },
      {
        type: "scene",
        headline: "Thirteen Days.",
        sub: "The road does not end. You pass cremation grounds still smouldering. You pass the ghosts of those who died without rites — wandering, unable to move. Hunger rises in you, but there is nothing to eat in this realm. On the thirteenth day, the city appears at the horizon.",
      },
      {
        type: "river",
        headline: "Vaitaranī",
        sub: "The last river before Yama's city. It flows with blood and pus. Those who gave a cow in life — the cow awaits them here. Those who did not — they are cast in.",
      },
    ],
  },
  {
    id: "hells",
    nav: "III – VI",
    title: "The Hall of Yama",
    tagline: "Your deeds were recorded. All of them.",
    theme: "crimson",
    beats: [
      {
        type: "portal",
        headline: "Chitragupta opens the Book.",
        sub: "The sun and moon, fire, wind, sky, earth, and water — all have witnessed your actions. Your heart knows what you have done.",
      },
      {
        type: "scene",
        headline: "Yama",
        sub: "Huge of body. Rod in hand. Seated on a buffalo. Thirty-two arms. He roars like a cloud at the end of time. He is not cruel — he is precise.",
      },
      {
        type: "list",
        label: "The 21 Great Hells",
        sub: "There are 84 lakh hells. These are the 21 most dreadful. Hover each to know its nature.",
        items: [
          { name: "Tāmisra",       desc: "Darkness. For those who seize another man's wife, wealth or child." },
          { name: "Lohasaṅku",     desc: "Iron spikes. For the ungrateful." },
          { name: "Mahāraurava",   desc: "Great torment. For those who live only for themselves." },
          { name: "Śālmali",       desc: "The silk-cotton tree with iron thorns. For the unchaste." },
          { name: "Raurava",       desc: "Hell of ruru beasts. For those who harm other beings." },
          { name: "Kudmala",       desc: "Pustules. For the defiler of sacred waters." },
          { name: "Kālasūtraka",   desc: "Thread of Time. For those who strike their parents." },
          { name: "Putimṛttikā",   desc: "Putrid earth. For the destroyer of ponds and gardens." },
          { name: "Saṅghāta",      desc: "Collision. For the breaker of vows." },
          { name: "Lohitoda",      desc: "Blood lake. For the seller of living beings." },
          { name: "Saviṣa",        desc: "Full of poison. For the poisoner." },
          { name: "Sampratāpana",  desc: "Intense heat. For those who burnt forests." },
          { name: "Mahāniraya",    desc: "Great hell. For the hypocrite." },
          { name: "Kāka",          desc: "Crow hell. For thieves." },
          { name: "Ulu",           desc: "Owl hell. For deceivers." },
          { name: "Sañjīvana",     desc: "Revival for more torture. For the slayer of Brahmins." },
          { name: "Mahāpathi",     desc: "The great road. For the miser." },
          { name: "Avīci",         desc: "No waves. For false witnesses." },
          { name: "Andhatāmisra",  desc: "Blind darkness. For the betrayer of trust." },
          { name: "Kumbhīpāka",    desc: "Boiling pots. For those who cook animals alive." },
          { name: "Tāpana",        desc: "Burning. For those who seize the property of the gods." },
        ],
      },
      {
        type: "verdict",
        sub: "The sun, moon, fire, and your own heart witnessed every act. Chitragupta's book is already written.",
      },
      {
        type: "scene",
        headline: "The Sentence is Written.",
        sub: "Hell is not metaphorical in the Garuda Purāṇa. It has geography, temperature, and duration. The punishment is exact: one transgression, one realm of purification. Not eternal. Precise. Chitragupta has closed the book. Yama has spoken. You will be purified. Then reborn.",
      },
      {
        type: "quote",
        quote: "Those who turn away from good deeds go from hell to hell, from misery to misery, from fear to fear.",
        attribution: "Garuda Purāṇa · Chapter IV",
      },
    ],
  },
  {
    id: "rites",
    nav: "VII – XIII",
    title: "The Rites of the Dead",
    tagline: "What the living must do for those who have gone.",
    theme: "gold",
    beats: [
      {
        type: "portal",
        headline: "The Ghost is Hungry.",
        sub: "Without proper rites, the departed soul cannot form a body. It wanders as a shadow — starving, thirsty, unable to move on.",
      },
      {
        type: "scene",
        headline: "The Rice-Ball Body",
        sub: "On the first day, a rice-ball the size of a thumb is offered. The soul grows. Day by day. For ten days the mourner feeds the dead — until the subtle body is complete enough to walk the road.",
      },
      {
        type: "list",
        label: "The Journey — Day by Day",
        sub: "Touch each day to perform the offering. Watch the body form.",
        performable: true,
        items: [
          { name: "Day 1",  desc: "The head is formed." },
          { name: "Day 2",  desc: "Eyes, ears, nose." },
          { name: "Day 3",  desc: "Throat and chest." },
          { name: "Day 4",  desc: "Back is formed." },
          { name: "Day 5",  desc: "Stomach." },
          { name: "Day 6",  desc: "Thighs." },
          { name: "Day 7",  desc: "Legs." },
          { name: "Day 8",  desc: "Feet." },
          { name: "Day 9",  desc: "Hunger and thirst arise in the new body." },
          { name: "Day 10", desc: "The complete body stands ready for the road." },
        ],
      },
      {
        type: "quote",
        quote: "As a man travels a road with his feet blistered, seeking shade that does not come — so the departed soul walks alone, sustained only by the offerings of the living.",
        attribution: "Garuda Purāṇa · Chapter VIII",
      },
      {
        type: "scene",
        headline: "The Eight Great Gifts",
        sub: "Sesame seeds. Water. A lamp. Land. Gold. Grain. Clothing. A cow. These given freely in life become food, light, and passage in death.",
      },
    ],
  },
  {
    id: "justice",
    nav: "XIV",
    title: "City of Justice",
    tagline: "Heaven is not a place of comfort. It is a place of accounting.",
    theme: "silver",
    beats: [
      {
        type: "portal",
        headline: "Dharmarāja's City",
        sub: "500 leagues in every direction. Four gateways. 28 attendants weigh the deeds of every soul that arrives. Even kings are not spared.",
      },
      {
        type: "scales",
        headline: "Weigh Your Soul",
        sub: "Not what you intended. What you actually did. Mark your transgressions and your merits — and let the scales decide.",
      },
      {
        type: "echo",
        headline: "The Echo of Lives",
        sub: "Before the wheel turns again — the soul is shown what awaits. Choose the life you lived.",
      },
      {
        type: "quote",
        quote: "The virtuous go to regions of delight. Those who have done both good and evil are reborn as human beings. Those who have done only evil enter the lowest births.",
        attribution: "Garuda Purāṇa · Chapter XIV",
      },
    ],
  },
  {
    id: "liberation",
    nav: "XV – XVI",
    title: "Liberation",
    tagline: "There is a door that has no gate.",
    theme: "liberation",
    beats: [
      {
        type: "portal",
        headline: "Self-Knowledge.",
        sub: "Not ritual. Not fasting. Not pilgrimage. One thing alone destroys the cycle of birth and death: knowing what you truly are.",
      },
      {
        type: "verse",
        headline: "The Six Chakras",
        sub: "The force rises. From the base of the spine, through six stations — Mūlādhāra, Svādhiṣṭhāna, Maṇipūra, Anāhata, Viśuddha, Ājñā — to the crown, where it dissolves into the infinite.",
      },
      {
        type: "mantra",
        headline: "The Protective Mantra",
        sub: "Om Namo Bhagavate Vāsudevāya — the twelve-syllable mantra spoken to Garuḍa by Viṣṇu. Breathe with each word. Let it settle.",
      },
      {
        type: "quote",
        quote: "The fool, not knowing that the truth is seated in himself, is bewildered by the Shastras. As the sun dispels darkness, Self-knowledge dispels ignorance.",
        attribution: "Garuda Purāṇa · Chapter XVI",
      },
      {
        type: "scene",
        headline: "The body is a guest house.",
        sub: "You were never your body. You were never your deeds. You were the witness — formless, untouched — watching the whole play from the beginning.",
      },
      {
        type: "finalQuestion",
        headline: "What did you learn from this life?",
        sub: "अंतिम प्रश्न · The Final Question",
      },
      {
        type: "quote",
        quote: "OM TAT SAT",
        attribution: "The Final Word",
      },
      {
        type: "report",
        headline: "Your Complete Record",
        sub: "As Written by Chitragupta · No Data Stored",
      },
    ],
  },
];
