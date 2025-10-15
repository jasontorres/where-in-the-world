import { useState } from 'react';
import Typewriter from './Typewriter';

interface Witness {
  name: string;
  type: string;
  location: string;
}

interface Location {
  name: string;
  description: string;
  connections: string[];
  image: string;
  witnesses: Witness[];
}

interface Locations {
  [key: string]: Location;
}

interface Suspect {
  id: number;
  name: string;
  appearance: string;
  hobby: string;
  vehicle: string;
  trait: string;
  currentLocation: string;
}

interface Conversation {
  speaker: string;
  text: string;
}

interface Clue {
  source: string;
  location: string;
  clue: string;
  type: string;
}

interface Evidence {
  appearance: string | null;
  hobby: string | null;
  vehicle: string | null;
  trait: string | null;
}

interface GameState {
  currentLocation: string;
  visitedLocations: string[];
  cluesCollected: Clue[];
  daysRemaining: number;
  gameStarted: boolean;
  gameOver: boolean;
  gameWon: boolean;
  selectedWitness: Witness | null;
  showTravel: boolean;
  conversation: Conversation | null;
  evidence: Evidence;
  typewriterComplete: boolean;
}

const ZaldyCoGame = () => {
  const locations: Locations = {
    philippines: {
      name: "Philippines",
      description: "Ground zero. Where billions in flood control funds vanished while the entire nation drowns every rainy season.",
      connections: ["singapore", "hongkong", "dubai"],
      image: "https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?w=600&h=400&fit=crop",
      witnesses: [
        { name: "ICI Investigator", type: "Government Official", location: "Batasang Pambansa" },
        { name: "Flood Victim", type: "Citizen", location: "Marikina Riverbanks" },
        { name: "House Staffer", type: "Whistleblower", location: "House of Representatives" }
      ]
    },
    singapore: {
      name: "Singapore",
      description: "Clean streets, strict laws, and suspiciously clean money.",
      connections: ["philippines", "hongkong", "switzerland"],
      image: "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=600&h=400&fit=crop",
      witnesses: [
        { name: "Bank Manager", type: "Banker", location: "Raffles Place" },
        { name: "Condo Agent", type: "Real Estate", location: "Marina Bay" },
        { name: "Filipino OFW", type: "Overseas Worker", location: "Lucky Plaza" }
      ]
    },
    hongkong: {
      name: "Hong Kong",
      description: "Where shell companies are born and luxury condos touch the sky.",
      connections: ["singapore", "philippines", "macau"],
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop",
      witnesses: [
        { name: "Corporate Lawyer", type: "Legal", location: "Central District" },
        { name: "Property Developer", type: "Real Estate", location: "Victoria Peak" },
        { name: "Jewelry Store Owner", type: "Merchant", location: "Tsim Sha Tsui" }
      ]
    },
    dubai: {
      name: "Dubai, UAE",
      description: "Gold, luxury cars, and questions nobody asks.",
      connections: ["philippines", "switzerland", "singapore"],
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
      witnesses: [
        { name: "Luxury Car Dealer", type: "Merchant", location: "Sheikh Zayed Road" },
        { name: "Hotel Concierge", type: "Hospitality", location: "Burj Al Arab" },
        { name: "Filipino Domestic Worker", type: "OFW", location: "Deira" }
      ]
    },
    switzerland: {
      name: "Zurich, Switzerland",
      description: "Neutral territory. Secret accounts. No questions asked.",
      connections: ["singapore", "dubai", "hongkong"],
      image: "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=600&h=400&fit=crop",
      witnesses: [
        { name: "Private Banker", type: "Finance", location: "Bahnhofstrasse" },
        { name: "Watch Dealer", type: "Merchant", location: "Luxury Boutique" },
        { name: "Hotel Manager", type: "Hospitality", location: "Luxury Hotel" }
      ]
    },
    macau: {
      name: "Macau",
      description: "Where fortunes are made, lost, and laundered.",
      connections: ["hongkong", "singapore", "philippines"],
      image: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=600&h=400&fit=crop",
      witnesses: [
        { name: "Casino Host", type: "Gaming", location: "Venetian Macau" },
        { name: "VIP Room Manager", type: "Gaming", location: "Grand Lisboa" },
        { name: "Junket Operator", type: "Gaming", location: "Casino Floor" }
      ]
    }
  };

  const suspects: Suspect[] = [
    {
      id: 1,
      name: "Zaldy Co",
      appearance: "Portly congressman, often in barong, round face with prominent jowls",
      hobby: "Collecting luxury aircraft and helicopters",
      vehicle: "Travels by private Gulfstream 350 jet",
      trait: "Claims to live modestly despite owning $50M+ in luxury aircraft",
      currentLocation: "dubai"
    }
  ];

  const [gameState, setGameState] = useState<GameState>({
    currentLocation: "philippines",
    visitedLocations: ["philippines"],
    cluesCollected: [],
    daysRemaining: 7,
    gameStarted: false,
    gameOver: false,
    gameWon: false,
    selectedWitness: null,
    showTravel: false,
    conversation: null,
    evidence: {
      appearance: null,
      hobby: null,
      vehicle: null,
      trait: null
    },
    typewriterComplete: false
  });

  const suspect = suspects[0];

  const startGame = () => {
    setGameState({
      ...gameState,
      gameStarted: true,
      typewriterComplete: false,
      conversation: {
        speaker: "ICI Chief Inspector",
        text: "Agent, we have a national crisis. Congressman Zaldy Co, former chair of the House Appropriations Committee, has fled the country amid investigations into the 2025 Flood Control Budget Scandal. Over P100 billion in public funds were siphoned through rigged infrastructure deals, ghost projects, and kickbacks. While Filipinos drown in floods, Co bought a $36 million Gulfstream jet and a $16 million helicopter with OUR money. He left the USA on August 26 after medical treatment - his travel authority has been revoked. The President wants him found. You have 7 days to track him down before he disappears completely. The trail starts here in the Philippines. Don't let this traitor escape justice!"
      }
    });
  };

  const generateClue = (witness: Witness, clueType: string): string => {
    const currentLoc = gameState.currentLocation;
    const isRightTrail = locations[currentLoc].connections.includes(suspect.currentLocation);
    
    const clueBank: { [key: string]: string[] } = {
      appearance: [
        "I saw a portly Filipino man in a barong tagalog. Round face, looked like someone used to power and privilege.",
        "Mataba, may balbas, parang politiko. The type who smiles for cameras while people drown in floods.",
        "Big guy in formal Filipino attire. Had that look - you know, the I'm untouchable kind of face."
      ],
      hobby: [
        "Overheard him talking about his Gulfstream jet. THIRTY-SIX MILLION DOLLARS. Para sa anong medical treatment?!",
        "He was bragging about his helicopter collection. Millions of dollars each. Meanwhile, Manila floods every year.",
        "Obsessed with luxury aircraft. Has a whole fleet - jets, helicopters. All bought with flood control budget, daw."
      ],
      vehicle: [
        "Arrived in a private Gulfstream 350. The same jet featured in the news - P2 billion of taxpayer money!",
        "Nakita ko yung private jet niya sa tarmac. Gulfstream 350. While flood victims have nothing, he has THIS.",
        "Travels by private luxury jet. The audacity - people are drowning and hes flying in P2B worth of aircraft."
      ],
      trait: [
        "He keeps saying he lives modestly - pero may $50 million in jets and helicopters?! Sinungaling!",
        "Claims the allegations are politically motivated. Classic deflection. His assets speak louder than his denials.",
        "Denies everything. Says his family lives simply. Pero bakit may Gulfstream at AgustaWestland helicopter?!"
      ],
      direction: isRightTrail ? [
        `I heard him mention something about ${locations[suspect.currentLocation].name}. He's running scared.`,
        `Overheard his people talking. Next stop: ${locations[suspect.currentLocation].name}. He's trying to hide.`,
        `His fixer mentioned ${locations[suspect.currentLocation].name}. That's where the money trail leads.`
      ] : [
        `People say he went to ${locations[currentLoc].connections[0]}, but it's probably misinformation...`,
        `Rumors point to ${locations[currentLoc].connections[1]}, pero baka fake news lang yan.`,
        `Someone said ${locations[currentLoc].connections[0]}, but who knows if it's true?`
      ]
    };

    return clueBank[clueType][Math.floor(Math.random() * clueBank[clueType].length)];
  };

  const interviewWitness = (witness: Witness) => {
    if (gameState.daysRemaining <= 0) return;

    const clueTypes = ['appearance', 'hobby', 'vehicle', 'trait', 'direction'];
    const clueType = clueTypes[Math.floor(Math.random() * clueTypes.length)];
    const clueText = generateClue(witness, clueType);

    const intro = `You approach ${witness.name}, a ${witness.type} at ${witness.location}.`;

    setGameState({
      ...gameState,
      selectedWitness: witness,
      typewriterComplete: false,
      conversation: {
        speaker: witness.name,
        text: `${intro}\n\n${witness.name}: ${clueText}`
      },
      cluesCollected: [...gameState.cluesCollected, {
        source: witness.name,
        location: locations[gameState.currentLocation].name,
        clue: clueText,
        type: clueType
      }],
      evidence: clueType !== 'direction' ? {
        ...gameState.evidence,
        [clueType]: clueText
      } : gameState.evidence
    });
  };

  const travelTo = (locationKey: string) => {
    const newDays = gameState.daysRemaining - 1;
    
    if (newDays <= 0) {
      setGameState({
        ...gameState,
        daysRemaining: 0,
        gameOver: true,
        showTravel: false,
        typewriterComplete: false,
        conversation: {
          speaker: "ICI Chief Inspector",
          text: "Time's up, agent. Zaldy Co has vanished into the shadows. He's probably on a private beach somewhere, flying his $36 million Gulfstream jet while Filipinos wade through floods he was supposed to prevent. The P100 billion is gone. Ghost flood control projects. Rigged deals. Kickbacks. All documented, but he's free. The House revoked his travel authority, but it's too late. This case goes cold... for now. But the Filipino people won't forget."
        }
      });
      return;
    }

    setGameState({
      ...gameState,
      currentLocation: locationKey,
      visitedLocations: [...gameState.visitedLocations, locationKey],
      daysRemaining: newDays,
      showTravel: false,
      selectedWitness: null,
      typewriterComplete: false,
      conversation: {
        speaker: "Narrator",
        text: `You arrive in ${locations[locationKey].name}. ${locations[locationKey].description}`
      }
    });
  };

  const attemptArrest = () => {
    if (gameState.currentLocation === suspect.currentLocation) {
      setGameState({
        ...gameState,
        gameWon: true,
        gameOver: true,
        typewriterComplete: false,
        conversation: {
          speaker: "Victory!",
          text: `ARREST MADE! You've located Congressman Zaldy Co in ${locations[suspect.currentLocation].name}! The flood control scammer is now in custody and will face justice for stealing P100 billion meant to protect Filipinos from flooding. The ICI will work to recover the assets - the Gulfstream jet, the helicopters, the luxury properties. While he flew around in his $36 million jet, Filipinos drowned. Not anymore. Excellent work, agent! Justice delayed is not justice denied.`
        }
      });
    } else {
      setGameState({
        ...gameState,
        typewriterComplete: false,
        conversation: {
          speaker: "False Lead",
          text: "This isn't the right location. Zaldy Co is not here. Keep investigating and follow the clues. Time is running out!"
        }
      });
    }
  };

  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 crt-effect scanline">
        <div className="max-w-4xl w-full bg-gray-900 border-8 border-gray-700 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 text-yellow-300 font-orbitron text-shadow-glow">
              WHERE IN THE WORLD IS
            </h1>
            <h2 className="text-5xl font-black mb-4 text-red-400 font-orbitron text-shadow-glow animate-pulse">
              ZALDY CO?
            </h2>
            <div className="bg-blue-900 border-4 border-blue-600 p-3 mb-4">
              <p className="text-yellow-300 font-bold font-vt323 text-2xl">
                A POLITICAL SATIRE INVESTIGATION
              </p>
            </div>
          </div>
          
          <div className="bg-red-950 border-4 border-red-700 p-4 mb-4 font-vt323 text-xl">
            <h3 className="font-bold text-2xl mb-3 text-yellow-300">CASE FILE: OPERATION BAHA FLOOD</h3>
            <div className="text-gray-300 space-y-1">
              <p><span className="text-yellow-400">SUSPECT:</span> Congressman Zaldy Co</p>
              <p><span className="text-yellow-400">POSITION:</span> Former Chair, House Appropriations Committee</p>
              <p><span className="text-yellow-400">CHARGES:</span> Plunder, Rigged Infrastructure Deals, Ghost Projects</p>
              <p><span className="text-yellow-400">EMBEZZLED:</span> Over P100,000,000,000</p>
              <p><span className="text-yellow-400">ASSETS:</span> $36M Gulfstream jet, $16M Helicopter</p>
              <p><span className="text-yellow-400">LAST SEEN:</span> Left USA August 26, 2025</p>
            </div>
          </div>

          <div className="bg-gray-800 border-4 border-gray-600 p-4 mb-4 font-vt323 text-xl">
            <h3 className="font-bold text-2xl mb-3 text-green-400">HOW TO PLAY</h3>
            <ul className="space-y-1 text-gray-300">
              <li>- Interview witnesses to gather clues</li>
              <li>- Travel between cities following the trail</li>
              <li>- Collect evidence about Zaldy Co</li>
              <li>- Issue arrest warrant when you find him</li>
              <li>- You have 7 DAYS before trail goes cold</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-red-700 hover:bg-red-600 text-yellow-300 font-bold py-3 px-6 border-4 border-red-900 font-vt323 text-2xl transition-all hover:scale-105"
          >
            &gt; START INVESTIGATION
          </button>
        </div>
      </div>
    );
  }

  const currentLocation = locations[gameState.currentLocation];

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 crt-effect scanline">
        <div className="max-w-3xl w-full bg-gray-900 border-8 border-gray-700 p-8">
          <div className="text-center font-vt323">
            {gameState.gameWon ? (
              <>
                <div className="text-6xl mb-4 animate-bounce text-green-400">★</div>
                <h2 className="text-5xl font-bold text-green-400 mb-4 text-shadow-glow">CASE CLOSED!</h2>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4 text-red-400">✖</div>
                <h2 className="text-5xl font-bold text-red-400 mb-4 text-shadow-glow">CASE COLD</h2>
              </>
            )}
            
            <div className="bg-gray-800 border-4 border-gray-600 p-6 mb-6">
              {gameState.conversation && (
                <Typewriter 
                  text={gameState.conversation.text} 
                  speed={20}
                  className="text-xl text-gray-300 leading-relaxed text-left"
                  onComplete={() => setGameState({...gameState, typewriterComplete: true})}
                />
              )}
            </div>

            {gameState.typewriterComplete && (
              <>
                <div className="bg-blue-950 border-4 border-blue-700 p-4 mb-6">
                  <h3 className="font-bold mb-3 text-cyan-400 text-2xl">INVESTIGATION SUMMARY</h3>
                  <div className="text-gray-300 space-y-1 text-xl">
                    <p>Days Used: {7 - gameState.daysRemaining} of 7</p>
                    <p>Locations Visited: {gameState.visitedLocations.length}</p>
                    <p>Clues Collected: {gameState.cluesCollected.length}</p>
                  </div>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-700 hover:bg-red-600 text-yellow-300 font-bold py-3 px-8 border-4 border-red-900 text-2xl transition-all hover:scale-105"
                >
                  &gt; NEW CASE
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-2 crt-effect">
      <div className="max-w-7xl mx-auto bg-gray-900 border-8 border-gray-700 shadow-2xl scanline">
        <div className="bg-gray-800 border-b-4 border-gray-600 p-3 font-vt323">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yellow-300 text-shadow-glow">WHERE IS ZALDY CO?</h1>
              <p className="text-lg text-gray-400">Independent Commission for Infrastructure</p>
            </div>
            <div className="text-right bg-red-900 border-2 border-red-700 px-4 py-1">
              <p className="text-lg text-yellow-400">DAYS LEFT</p>
              <p className="text-5xl font-bold text-yellow-300 animate-pulse">{gameState.daysRemaining}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          <div className="bg-black border-r-4 border-gray-700 p-4">
            <div className="mb-4">
              <div className="bg-gray-800 border-2 border-gray-600 p-2 mb-2">
                <h2 className="text-2xl font-bold text-yellow-300 font-vt323">
                  {currentLocation.name}
                </h2>
              </div>
              
              <div className="border-4 border-gray-600 mb-3">
                <img 
                  src={currentLocation.image} 
                  alt={currentLocation.name}
                  className="w-full h-64 object-cover pixel-border"
                />
              </div>

              <div className="bg-gray-800 border-2 border-gray-600 p-3">
                <p className="text-lg text-gray-300 font-vt323">
                  {currentLocation.description}
                </p>
              </div>
            </div>

            <div className="bg-yellow-900 border-4 border-yellow-700 p-3 font-vt323">
              <h3 className="font-bold text-xl mb-2 text-yellow-200">EVIDENCE DOSSIER</h3>
              
              <div className="space-y-2 text-base bg-black border-2 border-yellow-800 p-2">
                <div>
                  <p className="font-bold text-yellow-300">APPEARANCE:</p>
                  <p className="text-gray-400 pl-2">
                    {gameState.evidence.appearance || "[UNKNOWN]"}
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-yellow-300">HOBBY:</p>
                  <p className="text-gray-400 pl-2">
                    {gameState.evidence.hobby || "[UNKNOWN]"}
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-yellow-300">VEHICLE:</p>
                  <p className="text-gray-400 pl-2">
                    {gameState.evidence.vehicle || "[UNKNOWN]"}
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-yellow-300">TRAIT:</p>
                  <p className="text-gray-400 pl-2">
                    {gameState.evidence.trait || "[UNKNOWN]"}
                  </p>
                </div>
              </div>

              <div className="mt-2 text-base text-yellow-200">
                CLUES COLLECTED: {gameState.cluesCollected.length}
              </div>
            </div>
          </div>

          <div className="bg-black p-4 flex flex-col font-vt323">
            {gameState.conversation && (
              <div className="bg-gray-800 border-4 border-gray-600 p-3 mb-4 flex-shrink-0">
                <p className="font-bold text-green-400 mb-2 text-lg">
                  &gt; {gameState.conversation.speaker}
                </p>
                <Typewriter 
                  text={gameState.conversation.text}
                  speed={20}
                  className="text-lg text-gray-300 whitespace-pre-line leading-relaxed"
                  onComplete={() => setGameState({...gameState, typewriterComplete: true})}
                />
              </div>
            )}

            {gameState.typewriterComplete && (
              <div className="space-y-3 flex-1">
                {gameState.showTravel ? (
                  <div className="bg-blue-950 border-4 border-blue-700 p-3">
                    <h4 className="font-bold mb-2 text-cyan-300 text-lg">TRAVEL (COST: 1 DAY)</h4>
                    <div className="space-y-2">
                      {currentLocation.connections.map(locKey => (
                        <button
                          key={locKey}
                          onClick={() => travelTo(locKey)}
                          className="w-full text-left bg-black hover:bg-gray-900 border-2 border-cyan-600 p-2 text-base transition-all hover:scale-105"
                        >
                          <p className="font-bold text-cyan-300">&gt; {locations[locKey].name}</p>
                          <p className="text-gray-400 text-sm">{locations[locKey].description}</p>
                        </button>
                      ))}
                      <button
                        onClick={() => setGameState({...gameState, showTravel: false})}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-2 border-2 border-gray-500 text-base"
                      >
                        &lt; CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <button
                        onClick={() => setGameState({...gameState, showTravel: true})}
                        className="w-full bg-blue-700 hover:bg-blue-600 text-yellow-300 font-bold py-2 px-4 border-4 border-blue-900 text-lg transition-all hover:scale-105"
                      >
                        &gt; TRAVEL TO ANOTHER CITY
                      </button>
                      
                      <button
                        onClick={attemptArrest}
                        className="w-full bg-green-700 hover:bg-green-600 text-yellow-300 font-bold py-2 px-4 border-4 border-green-900 text-lg transition-all hover:scale-105"
                      >
                        &gt; ISSUE ARREST WARRANT
                      </button>
                    </div>

                    <div className="bg-purple-950 border-4 border-purple-700 p-3 mt-3">
                      <h3 className="font-bold text-lg mb-2 text-purple-300">INTERVIEW WITNESSES</h3>
                      <div className="space-y-2">
                        {currentLocation.witnesses.map((witness, idx) => (
                          <button
                            key={idx}
                            onClick={() => interviewWitness(witness)}
                            className="w-full text-left bg-black hover:bg-gray-900 border-2 border-purple-500 p-2 transition-all hover:scale-105"
                          >
                            <p className="font-bold text-purple-200 text-base">&gt; {witness.name}</p>
                            <p className="text-sm text-gray-400">{witness.type} - {witness.location}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZaldyCoGame;
