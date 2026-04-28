import { useEffect, useState } from 'react';
import Typewriter from './Typewriter';

type EvidenceKey = 'identity' | 'vehicle' | 'hideout' | 'motive';
type GamePhase = 'active' | 'won' | 'lost';
type MobilePanel = 'interview' | 'map' | 'clues';

interface Witness {
  name: string;
  role: string;
  spot: string;
  avatar: string;
}

interface City {
  id: string;
  name: string;
  country: string;
  tagline: string;
  color: string;
  x: number;
  y: number;
  connections: string[];
  witnesses: Witness[];
  flavor: string[];
}

interface CaseFile {
  trail: string[];
  finalCity: string;
  dossier: Record<EvidenceKey, string>;
}

interface LogEntry {
  id: number;
  city: string;
  source: string;
  clue: string;
  type: EvidenceKey | 'route' | 'decoy';
}

interface Conversation {
  speaker: string;
  meta: string;
  text: string;
  avatar?: string;
}

interface GameState {
  phase: GamePhase;
  currentCity: string;
  previousCity: string | null;
  daysLeft: number;
  heat: number;
  gumdrops: number;
  visited: string[];
  evidence: Partial<Record<EvidenceKey, string>>;
  log: LogEntry[];
  conversation: Conversation;
  showTravel: boolean;
  typewriterComplete: boolean;
  warrantReady: boolean;
}

const cityData: Record<string, City> = {
  manila: {
    id: 'manila',
    name: 'Manila',
    country: 'Philippines',
    tagline: 'Flood files, airport whispers, and one very nervous paper trail.',
    color: '#ff7a59',
    x: 10,
    y: 74,
    connections: ['london', 'paris', 'rome'],
    witnesses: [
      { name: 'Budget Beat Reporter', role: 'Press', spot: 'Quezon City newsroom', avatar: '🗞️' },
      { name: 'Airport Ramp Clerk', role: 'Aviation', spot: 'VIP apron', avatar: '🛫' },
      { name: 'Flood Project Engineer', role: 'Whistleblower', spot: 'Drainage site', avatar: '🧰' },
    ],
    flavor: [
      'A sticker-covered evidence crate sits under a leaky office aircon.',
      'Every folder points toward Europe, but the labels have been shuffled.',
      'A customs stamp smells faintly of bubblegum and jet fuel.',
    ],
  },
  london: {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    tagline: 'Red buses, rain clouds, and bankers who blink twice before answering.',
    color: '#44b3ff',
    x: 36,
    y: 26,
    connections: ['manila', 'paris', 'amsterdam', 'geneva'],
    witnesses: [
      { name: 'Night Porter', role: 'Hotel Staff', spot: 'Mayfair lobby', avatar: '🛎️' },
      { name: 'Archive Clerk', role: 'Records', spot: 'Companies registry desk', avatar: '📇' },
      { name: 'Cab Dispatcher', role: 'Transport', spot: 'Victoria station', avatar: '🚕' },
    ],
    flavor: [
      'A taxi receipt has a coffee ring exactly over the destination.',
      'The rain turns every neon sign into a watercolor clue.',
      'Someone left a passport sleeve tucked behind a hotel piano.',
    ],
  },
  paris: {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    tagline: 'Macarons, metro maps, and a briefcase changing hands near the Seine.',
    color: '#ff5fab',
    x: 41,
    y: 39,
    connections: ['manila', 'london', 'geneva', 'madrid', 'rome'],
    witnesses: [
      { name: 'Cafe Owner', role: 'Local Tipster', spot: 'Left Bank terrace', avatar: '☕' },
      { name: 'Gallery Guard', role: 'Security', spot: 'Private viewing room', avatar: '🖼️' },
      { name: 'Metro Busker', role: 'Street Witness', spot: 'Chatelet platform', avatar: '🎷' },
    ],
    flavor: [
      'A pastry box contains crumbs, a boarding stub, and a tiny gold button.',
      'The suspect ordered tea at a coffee bar. Suspicious behavior, honestly.',
      'A boutique receipt is folded into a paper airplane.',
    ],
  },
  amsterdam: {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    tagline: 'Canals, bikes, and shell-company names written in blue ink.',
    color: '#20c997',
    x: 45,
    y: 25,
    connections: ['london', 'geneva', 'prague', 'vienna'],
    witnesses: [
      { name: 'Canal Boat Captain', role: 'Guide', spot: 'Prinsengracht dock', avatar: '⛵' },
      { name: 'Bike Courier', role: 'Courier', spot: 'Dam Square', avatar: '🚲' },
      { name: 'Trust Office Intern', role: 'Finance', spot: 'Zuidas tower', avatar: '📎' },
    ],
    flavor: [
      'The canal looks calm. The paper trail absolutely does not.',
      'A bike bell rings twice whenever someone says "beneficial owner."',
      'A soggy envelope carries three stamps and no return address.',
    ],
  },
  geneva: {
    id: 'geneva',
    name: 'Geneva',
    country: 'Switzerland',
    tagline: 'Alpine chocolate, watch shops, and private ledgers with polite smiles.',
    color: '#7b61ff',
    x: 48,
    y: 49,
    connections: ['london', 'paris', 'amsterdam', 'vienna', 'rome'],
    witnesses: [
      { name: 'Watchmaker', role: 'Luxury Dealer', spot: 'Rue du Rhone', avatar: '⌚' },
      { name: 'Compliance Officer', role: 'Banking', spot: 'Lakefront office', avatar: '🏦' },
      { name: 'Ski Chauffeur', role: 'Driver', spot: 'Airport lounge', avatar: '🚗' },
    ],
    flavor: [
      'Everyone is extremely calm, which makes the alarm bells louder.',
      'A chocolate box hides a deposit slip beneath the pralines.',
      'The lake reflects mountains, clouds, and a suspicious tail number.',
    ],
  },
  madrid: {
    id: 'madrid',
    name: 'Madrid',
    country: 'Spain',
    tagline: 'Sunny plazas, late dinners, and a red scarf left at a hotel desk.',
    color: '#ffb000',
    x: 34,
    y: 63,
    connections: ['paris', 'rome', 'athens'],
    witnesses: [
      { name: 'Tapas Waiter', role: 'Hospitality', spot: 'Plaza Mayor', avatar: '🍽️' },
      { name: 'Museum Docent', role: 'Culture', spot: 'Private tour wing', avatar: '🎨' },
      { name: 'Station Cleaner', role: 'Rail Staff', spot: 'Atocha concourse', avatar: '🧹' },
    ],
    flavor: [
      'A napkin sketch shows a plane, a villa, and a question mark.',
      'The late-night dinner reservation used three different names.',
      'Someone paid cash and tipped with a foreign coin.',
    ],
  },
  rome: {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    tagline: 'Ancient stones, scooter smoke, and modern money moving fast.',
    color: '#ff6b6b',
    x: 55,
    y: 66,
    connections: ['manila', 'paris', 'geneva', 'madrid', 'athens', 'vienna'],
    witnesses: [
      { name: 'Scooter Mechanic', role: 'Street Lead', spot: 'Trastevere garage', avatar: '🛵' },
      { name: 'Boutique Tailor', role: 'Merchant', spot: 'Via Condotti', avatar: '🧵' },
      { name: 'Airport Caterer', role: 'Aviation', spot: 'Ciampino service gate', avatar: '🥐' },
    ],
    flavor: [
      'A gelato spoon is stuck to a confidential envelope.',
      'Every cobblestone seems to point toward another airport.',
      'A tailor remembers the watch, the smile, and the rush order.',
    ],
  },
  vienna: {
    id: 'vienna',
    name: 'Vienna',
    country: 'Austria',
    tagline: 'Opera tickets, cream cakes, and a meeting timed to the minute.',
    color: '#b66dff',
    x: 61,
    y: 45,
    connections: ['amsterdam', 'geneva', 'rome', 'prague', 'athens'],
    witnesses: [
      { name: 'Opera Usher', role: 'Venue Staff', spot: 'Box balcony', avatar: '🎭' },
      { name: 'Pastry Chef', role: 'Cafe Lead', spot: 'Ringstrasse cafe', avatar: '🍰' },
      { name: 'Train Conductor', role: 'Rail', spot: 'Hauptbahnhof', avatar: '🚆' },
    ],
    flavor: [
      'A program from last night has a departure time circled in jam.',
      'The music is elegant. The alibi is not.',
      'A locker key jingles like a tiny confession.',
    ],
  },
  prague: {
    id: 'prague',
    name: 'Prague',
    country: 'Czechia',
    tagline: 'Clock towers, crooked lanes, and coded notes in a souvenir shop.',
    color: '#36d399',
    x: 59,
    y: 35,
    connections: ['amsterdam', 'vienna', 'geneva'],
    witnesses: [
      { name: 'Toymaker', role: 'Shopkeeper', spot: 'Old Town stall', avatar: '🧸' },
      { name: 'Clock Keeper', role: 'Caretaker', spot: 'Astronomical clock', avatar: '🕰️' },
      { name: 'Hostel Manager', role: 'Lodging', spot: 'Mala Strana', avatar: '🗝️' },
    ],
    flavor: [
      'A wooden puppet points dramatically toward the train station.',
      'The clock strikes noon; three witnesses suddenly remember appointments.',
      'A souvenir snow globe contains a rolled-up baggage claim tag.',
    ],
  },
  athens: {
    id: 'athens',
    name: 'Athens',
    country: 'Greece',
    tagline: 'Blue domes, ferry horns, and one last island-bound escape plan.',
    color: '#23a6f0',
    x: 69,
    y: 76,
    connections: ['rome', 'madrid', 'vienna'],
    witnesses: [
      { name: 'Ferry Agent', role: 'Harbor Staff', spot: 'Piraeus ticket booth', avatar: '⛴️' },
      { name: 'Rooftop Host', role: 'Hotel Staff', spot: 'Monastiraki terrace', avatar: '🏨' },
      { name: 'Antique Seller', role: 'Merchant', spot: 'Plaka lane', avatar: '🏺' },
    ],
    flavor: [
      'The sea breeze carries a rumor about a chartered hop to nowhere.',
      'A ferry ticket has been bought, cancelled, and bought again.',
      'A rooftop receipt lists sparkling water and a burner phone charger.',
    ],
  },
};

const routes = [
  ['manila', 'london', 'amsterdam', 'prague'],
  ['manila', 'paris', 'geneva', 'vienna'],
  ['manila', 'rome', 'athens'],
  ['manila', 'london', 'geneva', 'rome', 'madrid'],
  ['manila', 'paris', 'madrid', 'athens'],
  ['manila', 'rome', 'vienna', 'prague'],
];

const evidenceLabels: Record<EvidenceKey, string> = {
  identity: 'Identity',
  vehicle: 'Transport',
  hideout: 'Hideout',
  motive: 'Pattern',
};

const createCase = (): CaseFile => {
  const trail = routes[Math.floor(Math.random() * routes.length)];
  const finalCity = trail[trail.length - 1];

  return {
    trail,
    finalCity,
    dossier: {
      identity: 'A well-known Filipino political figure using aides, initials, and hotel aliases softer than a committee subpoena.',
      vehicle: 'A private aircraft trail with luxury service invoices, VIP apron access, and baggage tags that forgot to plead the Fifth.',
      hideout: `A reserved suite and security detail near ${cityData[finalCity].name}.`,
      motive: 'Avoiding public inquiries tied to alleged flood-control budget irregularities and mysteriously dry paper trails.',
    },
  };
};

const buildOpening = (): Conversation => ({
  speaker: 'Chief Auditor',
  meta: 'International Corruption Desk',
  text:
    'Agent, welcome to the Europe desk. This is a satirical detective game based on public reporting and allegations around Zaldy Co and flood-control budget inquiries. Follow the travel receipts, collect enough clues for a clean warrant, and catch the fugitive before the file gets buried under another urgent committee hearing. Start in Manila, interview witnesses, then hop across Europe one city at a time.',
  avatar: '📋',
});

const buildNewState = (): GameState => ({
  phase: 'active',
  currentCity: 'manila',
  previousCity: null,
  daysLeft: 9,
  heat: 0,
  gumdrops: 3,
  visited: ['manila'],
  evidence: {},
  log: [],
  conversation: buildOpening(),
  showTravel: false,
  typewriterComplete: false,
  warrantReady: false,
});

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getMentionedCityIds = (text: string): string[] => (
  Object.values(cityData)
    .filter((city) => new RegExp(`\\b${escapeRegExp(city.name)}\\b`, 'i').test(text))
    .map((city) => city.id)
);

const getRouteClue = (caseFile: CaseFile, currentCity: string): string => {
  const trailIndex = caseFile.trail.indexOf(currentCity);

  if (trailIndex >= 0 && trailIndex < caseFile.trail.length - 1) {
    const nextCity = cityData[caseFile.trail[trailIndex + 1]];
    return pick([
      `A rushed airport receipt points to ${nextCity.name}. Even alleged escape plans need paperwork.`,
      `The booking clerk heard ${nextCity.name} twice: once from an aide, once from a pilot who sounded allergic to subpoenas.`,
      `A luggage tag points to ${nextCity.name}. The handwriting is careful, but the panic has its own font.`,
      `The next stamp in the passport trail is ${nextCity.name}. Follow it before the paper trail gets flood-damaged.`,
      `A fixer whispered ${nextCity.name} while pretending to discuss drainage canals. Subtle as a missing budget line.`,
    ]);
  }

  if (trailIndex === caseFile.trail.length - 1) {
    return 'The clues stop here. Witnesses are whispering about a private room, nervous security, and a fresh escape plan with better drainage than the projects in the file.';
  }

  return pick([
    'This lead is flashy but hollow. The person seen here was probably a decoy with a fancy watch and a flexible memory.',
    'A rumor passed through, but it feels stale. Check a connected city and compare your passport stamps.',
    'The trail here is colder than an unfinished flood-control canal. Someone may be trying to loop you backward.',
  ]);
};

const getEvidenceClue = (caseFile: CaseFile, key: EvidenceKey): string => {
  const clue = caseFile.dossier[key];

  return pick([
    `${evidenceLabels[key]} clue: ${clue}`,
    `Add this to the warrant board. ${clue}`,
    `That detail matters. ${clue}`,
  ]);
};

const Game = () => {
  const [caseFile, setCaseFile] = useState<CaseFile>(() => createCase());
  const [gameState, setGameState] = useState<GameState>(() => buildNewState());
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [pendingTravel, setPendingTravel] = useState<string | null>(null);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('interview');

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLoadingProgress((progress) => Math.min(100, progress + 4));
    }, 55);

    const timeout = window.setTimeout(() => setIsLoading(false), 1700);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  const currentCity = cityData[gameState.currentCity];
  const hasEnoughEvidence = Object.keys(gameState.evidence).length >= 3;
  const isFinalCity = gameState.currentCity === caseFile.finalCity;
  const trailIndex = caseFile.trail.indexOf(gameState.currentCity);
  const clueLeadCityIds = Array.from(new Set(
    gameState.log
      .flatMap((entry) => getMentionedCityIds(entry.clue))
      .filter((cityId) => cityId !== gameState.currentCity),
  ));
  const travelOptions = Array.from(new Set([...currentCity.connections, ...clueLeadCityIds]));
  const hasRouteLead = gameState.log.some((entry) => entry.type === 'route' && entry.city === currentCity.name)
    || clueLeadCityIds.length > 0;

  const resetTypewriter = (updates: Partial<GameState>): GameState => ({
    ...gameState,
    ...updates,
    typewriterComplete: false,
  });

  const interviewWitness = (witness: Witness) => {
    if (gameState.phase !== 'active') return;

    const evidenceKeys = Object.keys(evidenceLabels) as EvidenceKey[];
    const unknownEvidence = evidenceKeys.filter((key) => !gameState.evidence[key]);
    const shouldGiveRoute = Math.random() < 0.58 || unknownEvidence.length === 0;
    const type: EvidenceKey | 'route' | 'decoy' = shouldGiveRoute ? 'route' : pick(unknownEvidence);
    const clue = type === 'route' ? getRouteClue(caseFile, gameState.currentCity) : getEvidenceClue(caseFile, type);
    const nextEvidence = type !== 'route' && type !== 'decoy'
      ? { ...gameState.evidence, [type]: caseFile.dossier[type] }
      : gameState.evidence;
    const nextLog: LogEntry = {
      id: gameState.log.length + 1,
      city: currentCity.name,
      source: witness.name,
      clue,
      type,
    };

    setGameState(resetTypewriter({
      evidence: nextEvidence,
      log: [nextLog, ...gameState.log],
      warrantReady: Object.keys(nextEvidence).length >= 3,
      showTravel: gameState.showTravel,
      conversation: {
        speaker: witness.name,
        meta: `${witness.role} at ${witness.spot}`,
        text: `${pick(currentCity.flavor)}\n\n${clue}`,
        avatar: witness.avatar,
      },
    }));
  };

  const travelTo = (cityId: string) => {
    if (gameState.phase !== 'active') return;

    const daysLeft = gameState.daysLeft - 1;
    const nextCity = cityData[cityId];
    const correctNext = trailIndex >= 0 && caseFile.trail[trailIndex + 1] === cityId;
    const destinationTrailIndex = caseFile.trail.indexOf(cityId);
    const followsKnownTrail = destinationTrailIndex > trailIndex;
    const heat = Math.min(5, gameState.heat + (correctNext || followsKnownTrail ? 0 : 1));

    if (daysLeft <= 0) {
      setGameState(resetTypewriter({
        phase: 'lost',
        daysLeft: 0,
        showTravel: false,
        heat,
        conversation: {
          speaker: 'Case Cold',
          meta: 'The trail went quiet',
          text:
            'The chase clock hit zero. The suspect slipped through a private door while the paperwork was still warming up. Your clues will stay on file, and the Europe desk will be ready for another run.',
          avatar: '🧊',
        },
      }));
      setMobilePanel('interview');
      return;
    }

    setGameState(resetTypewriter({
      currentCity: cityId,
      previousCity: gameState.currentCity,
      daysLeft,
      heat,
      showTravel: false,
      visited: [...gameState.visited, cityId],
      conversation: {
        speaker: `${nextCity.name}, ${nextCity.country}`,
        meta: correctNext ? 'Trail is warm' : followsKnownTrail ? 'Case board lead' : 'Possible detour',
        text: `${nextCity.tagline} ${pick(nextCity.flavor)} ${correctNext || followsKnownTrail ? 'The audit trail is warm here.' : 'Something feels off, but a careful agent can recover.'}`,
        avatar: correctNext ? '✨' : '🧭',
      },
    }));
    setMobilePanel('interview');
  };

  const askTravelTo = (cityId: string) => {
    if (
      gameState.phase !== 'active'
      || cityId === gameState.currentCity
      || !travelOptions.includes(cityId)
    ) {
      return;
    }

    setPendingTravel(cityId);
  };

  const confirmTravel = () => {
    if (!pendingTravel) return;

    const destination = pendingTravel;
    setPendingTravel(null);
    travelTo(destination);
  };

  const useGumdropAssist = () => {
    if (gameState.gumdrops <= 0 || gameState.phase !== 'active') return;

    const nextStop = trailIndex >= 0 && trailIndex < caseFile.trail.length - 1
      ? cityData[caseFile.trail[trailIndex + 1]].name
      : currentCity.name;
    const clue = trailIndex === caseFile.trail.length - 1
      ? 'The scanner is stuck to this city. That usually means the hideout is nearby.'
      : `The scanner highlights the next travel lead: ${nextStop}.`;
    const nextLog: LogEntry = {
      id: gameState.log.length + 1,
      city: currentCity.name,
      source: 'Clue Scanner',
      clue,
      type: 'route',
    };

    setGameState(resetTypewriter({
      gumdrops: gameState.gumdrops - 1,
      log: [nextLog, ...gameState.log],
      showTravel: gameState.showTravel,
      conversation: {
        speaker: 'Clue Scanner',
        meta: `${gameState.gumdrops - 1} assists left`,
        text: clue,
        avatar: '📡',
      },
    }));
  };

  const issueWarrant = () => {
    if (gameState.phase !== 'active') return;

    if (isFinalCity && hasEnoughEvidence) {
      setGameState(resetTypewriter({
        phase: 'won',
        showTravel: false,
        conversation: {
          speaker: 'Case Closed',
          meta: `${currentCity.name} operation complete`,
          text:
            'Clean warrant, correct city, excellent detective work. The fugitive is boxed in by passport stamps, witness notes, and a paper trail bright enough to see from the departures board. The case file now moves from cartoon chase to the serious business of lawful accountability.',
          avatar: '🏆',
        },
      }));
      setMobilePanel('clues');
      return;
    }

    const daysLeft = gameState.daysLeft - 1;
    setGameState(resetTypewriter({
      daysLeft,
      heat: Math.min(5, gameState.heat + 1),
      phase: daysLeft <= 0 ? 'lost' : 'active',
      conversation: {
        speaker: daysLeft <= 0 ? 'Case Cold' : 'Warrant Rejected',
        meta: hasEnoughEvidence ? 'Wrong city' : 'More evidence needed',
        text: daysLeft <= 0
          ? 'The failed warrant burned the last day. The suspect vanished before the Europe desk could correct course.'
          : hasEnoughEvidence
            ? 'The paperwork is strong, but the city is wrong. Follow the route clues before trying again.'
            : 'The judge wants at least three solid evidence cards before signing. Interview more witnesses and fill the warrant board.',
        avatar: daysLeft <= 0 ? '🧊' : '📋',
      },
    }));
    setMobilePanel(hasEnoughEvidence ? 'map' : 'clues');
  };

  const newCase = () => {
    const nextCase = createCase();
    setCaseFile(nextCase);
    setGameState(buildNewState());
    setShowHowToPlay(true);
    setMobilePanel('interview');
  };

  const toggleTravelMode = () => {
    if (gameState.phase !== 'active') return;

    setGameState({
      ...gameState,
      showTravel: !gameState.showTravel,
    });
    setMobilePanel('map');
  };

  const evidenceCount = Object.keys(gameState.evidence).length;

  if (isLoading) {
    return (
      <main className="game-shell loading-mode">
        <div className="hero-map" aria-hidden="true" />
        <div className="candy-field" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <section className="loading-screen" aria-label="Loading game">
          <div className="loading-logo">
            <p>Europe Chase</p>
            <h1>Zaldy Co Quest</h1>
          </div>
          <div className="loading-capsule">
            <img src="/game-art/cartoon-dossier-travel.png" alt="" />
          </div>
          <div className="loading-bar" aria-label={`Loading ${loadingProgress}%`}>
            <div style={{ width: `${loadingProgress}%` }} />
          </div>
          <p className="loading-copy">Polishing glossy buttons · stamping passports · warming up the audit trail</p>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <div className="hero-map" aria-hidden="true" />
      <div className="candy-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <section className="topbar">
        <div>
          <p className="eyebrow">International Corruption Desk</p>
          <h1>Where in Europe is Zaldy Co?</h1>
        </div>
        <div className="score-strip" aria-label="Case meters">
          <div className="hud-token days"><b>⏱</b><span>{gameState.daysLeft}</span><small>Days</small></div>
          <div className="hud-token clues"><b>🔎</b><span>{evidenceCount}/4</span><small>Clues</small></div>
          <div className="hud-token assists"><b>📡</b><span>{gameState.gumdrops}</span><small>Boosts</small></div>
          <div className="hud-token heat"><b>🔥</b><span>{gameState.heat}</span><small>Heat</small></div>
        </div>
      </section>

      <section className={`game-board mobile-panel-${mobilePanel}`}>
          <div className="action-card hud-panel left-hud">
            <div className="dialogue-box">
              <div>
                <h3>{gameState.conversation.speaker}</h3>
                <p>{gameState.conversation.meta}</p>
                <Typewriter
                  text={gameState.conversation.text}
                  speed={7}
                  enableSound={false}
                  className="dialogue-text"
                  onComplete={() => setGameState((state) => ({ ...state, typewriterComplete: true }))}
                />
              </div>
            </div>

            {gameState.phase === 'active' ? (
              <>
                <p className="sidebar-section-title">{gameState.showTravel ? 'Choose a Route' : 'Interview Witnesses'}</p>

                {gameState.showTravel ? (
                  <div className="route-list">
                    {travelOptions.map((cityId) => {
                      const city = cityData[cityId];
                      const hot = trailIndex >= 0 && caseFile.trail[trailIndex + 1] === cityId;
                      const clueLead = clueLeadCityIds.includes(cityId) && !currentCity.connections.includes(cityId);

                      return (
                        <button key={cityId} onClick={() => askTravelTo(cityId)} className={`${hot ? 'hot-route ' : ''}${clueLead ? 'lead-route ' : ''}next-action-list`}>
                          <span style={{ background: city.color }} />
                          <strong>{city.name}</strong>
                          <small>{hot ? 'paper trail' : clueLead ? 'clue lead' : '1 day'}</small>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="witness-list">
                    {currentCity.witnesses.map((witness) => (
                      <button key={witness.name} onClick={() => interviewWitness(witness)} className="next-action-list">
                        <span>{witness.avatar}</span>
                        <strong>{witness.name}</strong>
                        <small>{witness.role} · {witness.spot}</small>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="ending-actions">
                <button className="candy-button primary" onClick={newCase}>
                  <span>↻</span> New Case
                </button>
              </div>
            )}
          </div>

          <div className={`map-card ${gameState.showTravel ? 'route-mode' : 'clue-mode'}`}>
            <div className="map-header">
              <div>
                <p className="eyebrow">Current City</p>
                <h2>{currentCity.name}</h2>
              </div>
              <span className="country-tag">{currentCity.country}</span>
            </div>
            <div className="mini-map">
              <div className="map-level-badge">
                <strong>Level {gameState.visited.length}</strong>
                <span>{gameState.showTravel ? 'Pick a route' : hasRouteLead ? 'Route lead found' : 'Find clues'}</span>
              </div>
              {Object.values(cityData).map((city) => {
                const visited = gameState.visited.includes(city.id);
                const active = city.id === gameState.currentCity;
                const connected = travelOptions.includes(city.id);
                const clueLead = clueLeadCityIds.includes(city.id) && !currentCity.connections.includes(city.id);

                return (
                  <button
                    key={city.id}
                    className={`city-pin ${active ? 'active' : ''} ${visited ? 'visited' : ''} ${connected ? 'connected' : ''} ${clueLead ? 'clue-lead' : ''}`}
                    style={{ left: `${city.x}%`, top: `${city.y}%`, '--pin-color': city.color } as React.CSSProperties}
                    onClick={() => askTravelTo(city.id)}
                    aria-label={city.name}
                  >
                    <span>{active ? '✈' : '🧳'}</span>
                    <small>{city.name}</small>
                  </button>
                );
              })}
            </div>
            <p className="city-flavor">{currentCity.tagline}</p>
            <div className="passport-row">
              {gameState.visited.slice(-7).map((cityId, index) => (
                <span key={`${cityId}-${index}`} className="stamp">{cityData[cityId].name}</span>
              ))}
            </div>
          </div>

          <aside className="dossier-card hud-panel right-hud">
            <img src="/game-art/cartoon-dossier-travel.png" alt="" />
            <div className="warrant-status">
              <strong>{gameState.warrantReady ? 'Warrant Ready' : 'Build Warrant'}</strong>
              <span>{hasEnoughEvidence ? '3+ evidence cards collected' : `${3 - evidenceCount} more evidence card${3 - evidenceCount === 1 ? '' : 's'} needed`}</span>
            </div>
            <div className="evidence-grid">
              {(Object.keys(evidenceLabels) as EvidenceKey[]).map((key) => (
                <article key={key} className={gameState.evidence[key] ? 'filled' : ''}>
                  <small>{evidenceLabels[key]}</small>
                  <p>{gameState.evidence[key] ?? '???'}</p>
                </article>
              ))}
            </div>
            <div className="clue-log">
              <h3>Clue Log</h3>
              {gameState.log.length === 0 ? (
                <p className="empty-log">No clues yet. Shake down the witness buttons.</p>
              ) : (
                gameState.log.slice(0, 5).map((entry) => (
                  <article key={entry.id}>
                    <strong>{entry.source}</strong>
                    <span>{entry.city} · {entry.type}</span>
                    <p>{entry.clue}</p>
                  </article>
                ))
              )}
            </div>
          </aside>

          {gameState.phase === 'active' && (
            <nav className="bottom-dock" aria-label="Primary game actions">
              <button className={`candy-button travel ${hasRouteLead && !gameState.showTravel ? 'next-action' : ''}`} onClick={toggleTravelMode}>
                <span>✈</span> {gameState.showTravel ? 'Routes' : 'Travel'}
              </button>
              <button className={`candy-button boost ${gameState.gumdrops > 0 && gameState.log.length === 0 ? 'next-action' : ''}`} onClick={useGumdropAssist} disabled={gameState.gumdrops <= 0}>
                <span>📡</span> Scan
              </button>
              <button className={`candy-button danger ${gameState.warrantReady ? 'next-action' : ''}`} onClick={issueWarrant}>
                <span>⚖</span> Warrant
              </button>
            </nav>
          )}
          <nav className="mobile-tabbar" aria-label="Mobile panel navigation">
            <button className={mobilePanel === 'interview' ? 'active' : ''} onClick={() => setMobilePanel('interview')}>
              <span>🗣</span>
              Interview
            </button>
            <button className={mobilePanel === 'map' ? 'active' : ''} onClick={() => setMobilePanel('map')}>
              <span>🗺</span>
              Map
            </button>
            <button className={mobilePanel === 'clues' ? 'active' : ''} onClick={() => setMobilePanel('clues')}>
              <span>🔎</span>
              Clues
            </button>
          </nav>
        </section>
      {showHowToPlay && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="how-to-title">
          <section className="how-to-modal">
            <img src="/game-art/cartoon-dossier-travel.png" alt="" />
            <div className="how-to-panel" aria-label="How to play">
              <p className="pill">Quick Briefing</p>
              <h2 id="how-to-title">How To Play</h2>
              <div className="tutorial-actions">
                <button type="button" className="candy-button travel next-action" aria-label="Travel button preview">
                  <span>✈</span> Travel
                </button>
                <button type="button" className="candy-button boost" aria-label="Scan button preview">
                  <span>📡</span> Scan
                </button>
                <button type="button" className="candy-button danger" aria-label="Warrant button preview">
                  <span>⚖</span> Warrant
                </button>
              </div>
              <p>Interview witnesses, click luggage on the map to travel, and watch for named cities in clues: they unlock special clue-lead routes. Use Scan if the audit trail goes cold, then issue the Warrant after collecting 3 evidence cards.</p>
              <button className="candy-button primary next-action" onClick={() => setShowHowToPlay(false)}>
                <span>▶</span> Play
              </button>
            </div>
          </section>
        </div>
      )}
      {pendingTravel && (
        <div className="modal-backdrop travel-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="travel-confirm-title">
          <section className="travel-confirm-modal">
            <div className="travel-confirm-icon">✈</div>
            <div>
              <p className="pill">Travel Order</p>
              <h2 id="travel-confirm-title">Fly to {cityData[pendingTravel].name}?</h2>
              <p>
                This spends 1 day and stamps your passport. Double-check the clue:
                a wrong hop adds heat and gives the alleged flood-fund travel circus more time to change gates.
              </p>
              <div className="travel-confirm-actions">
                <button className="candy-button travel next-action" onClick={confirmTravel}>
                  <span>✈</span> Confirm
                </button>
                <button className="candy-button danger" onClick={() => setPendingTravel(null)}>
                  <span>×</span> Cancel
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default Game;
