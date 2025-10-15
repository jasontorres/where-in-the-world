import { useState, useMemo } from 'react';
import Typewriter from './Typewriter';
import { locations, type Witness } from '../data/locations';
import { createSuspect } from '../data/suspects';
import { generateClue as generateClueFromBank } from '../data/clues';

interface Conversation {
  speaker: string;
  text: string;
  avatarUrl?: string;
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
  // Create suspect with random location once per game
  const suspect = useMemo(() => createSuspect(), []);

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

  const startGame = () => {
    // Debug: Log the trail for testing (remove in production)
    console.log('🔍 SUSPECT TRAIL (DEV MODE):', suspect.trail.map(loc => locations[loc].name));
    console.log('📍 Final Location:', locations[suspect.currentLocation].name);
    
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

  const interviewWitness = (witness: Witness) => {
    if (gameState.daysRemaining <= 0) return;

    const currentLoc = gameState.currentLocation;
    
    // Check if current location is on the suspect's trail
    const trailIndex = suspect.trail.indexOf(currentLoc);
    const isOnTrail = trailIndex !== -1;
    
    // Determine next location in trail (if any)
    let nextLocation: string | null = null;
    let nextLocationName: string | null = null;
    
    if (isOnTrail && trailIndex < suspect.trail.length - 1) {
      nextLocation = suspect.trail[trailIndex + 1];
      nextLocationName = locations[nextLocation].name;
    }
    
    // Generate clue using the new system
    const clueResponse = generateClueFromBank(
      witness,
      suspect,
      currentLoc,
      isOnTrail,
      nextLocation,
      nextLocationName
    );

    // Generate consistent avatar for witness based on name
    const witnessId = witness.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 70;
    const avatarUrl = `https://i.pravatar.cc/100?img=${witnessId}`;

    // Update evidence if this is a character clue (not direction)
    const updatedEvidence = clueResponse.evidenceValue ? {
      ...gameState.evidence,
      [clueResponse.type]: clueResponse.evidenceValue
    } : gameState.evidence;

    setGameState({
      ...gameState,
      selectedWitness: witness,
      typewriterComplete: false,
      conversation: {
        speaker: witness.name,
        text: `${clueResponse.intro}\n\n${clueResponse.clue}`,
        avatarUrl: avatarUrl
      },
      cluesCollected: [...gameState.cluesCollected, {
        source: witness.name,
        location: locations[currentLoc].name,
        clue: clueResponse.clue,
        type: clueResponse.type
      }],
      evidence: updatedEvidence
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
        <div className="max-w-4xl w-full bg-black border-8 border-green-500 terminal-border p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 text-green-400 font-orbitron terminal-glow">
              WHERE IN THE WORLD IS
            </h1>
            <h2 className="text-5xl font-black mb-4 text-green-500 font-orbitron terminal-glow animate-pulse">
              ZALDY CO?
            </h2>
            <div className="bg-green-950 border-4 border-green-600 p-3 mb-4">
              <p className="text-white font-bold text-2xl">
                A POLITICAL SATIRE INVESTIGATION
              </p>
            </div>
          </div>
          
          <div className="bg-green-950 border-4 border-green-600 p-4 mb-4 text-xl">
            <h3 className="font-bold text-2xl mb-3 text-green-400 font-orbitron">CASE FILE: OPERATION BAHA FLOOD</h3>
            <div className="text-gray-200 space-y-1">
              <p><span className="text-green-300 font-orbitron">SUSPECT:</span> Congressman Zaldy Co</p>
              <p><span className="text-green-300 font-orbitron">POSITION:</span> Former Chair, House Appropriations Committee</p>
              <p><span className="text-green-300 font-orbitron">CHARGES:</span> Plunder, Rigged Infrastructure Deals, Ghost Projects</p>
              <p><span className="text-green-300 font-orbitron">EMBEZZLED:</span> Over P100,000,000,000</p>
              <p><span className="text-green-300 font-orbitron">ASSETS:</span> $36M Gulfstream jet, $16M Helicopter</p>
              <p><span className="text-green-300 font-orbitron">LAST SEEN:</span> Left USA August 26, 2025</p>
            </div>
          </div>

          <div className="bg-green-950 border-4 border-green-600 p-4 mb-4 text-xl">
            <h3 className="font-bold text-2xl mb-3 text-green-400 font-orbitron">HOW TO PLAY</h3>
            <ul className="space-y-1 text-gray-200">
              <li>- Interview witnesses to gather clues</li>
              <li>- Travel between cities following the trail</li>
              <li>- Collect evidence about Zaldy Co</li>
              <li>- Issue arrest warrant when you find him</li>
              <li>- You have 7 DAYS before trail goes cold</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 border-4 border-green-500 text-2xl transition-all hover:scale-105 terminal-glow font-orbitron"
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
        <div className="max-w-3xl w-full bg-black border-8 border-green-500 terminal-border p-8">
          <div className="text-center">
            {gameState.gameWon ? (
              <>
                <div className="text-6xl mb-4 animate-bounce text-green-400">★</div>
                <h2 className="text-5xl font-bold text-green-400 mb-4 terminal-glow font-orbitron">CASE CLOSED!</h2>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4 text-green-600">✖</div>
                <h2 className="text-5xl font-bold text-green-600 mb-4 terminal-glow font-orbitron">CASE COLD</h2>
              </>
            )}
            
            <div className="bg-green-950 border-4 border-green-600 p-6 mb-6">
              {gameState.conversation && (
                <Typewriter 
                  text={gameState.conversation.text} 
                  speed={10}
                  className="text-xl text-gray-200 leading-relaxed text-left"
                  onComplete={() => setGameState({...gameState, typewriterComplete: true})}
                />
              )}
            </div>

            {gameState.typewriterComplete && (
              <>
                <div className="bg-green-950 border-4 border-green-600 p-4 mb-6">
                  <h3 className="font-bold mb-3 text-green-400 text-2xl font-orbitron">INVESTIGATION SUMMARY</h3>
                  <div className="text-gray-200 space-y-1 text-xl">
                    <p>Days Used: {7 - gameState.daysRemaining} of 7</p>
                    <p>Locations Visited: {gameState.visitedLocations.length}</p>
                    <p>Clues Collected: {gameState.cluesCollected.length}</p>
                  </div>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-8 border-4 border-green-500 text-2xl transition-all hover:scale-105 terminal-glow font-orbitron"
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
      <div className="max-w-7xl mx-auto bg-black border-8 border-green-500 terminal-border shadow-2xl scanline">
        <div className="bg-green-950 border-b-4 border-green-600 p-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-green-400 terminal-glow font-orbitron">WHERE IS ZALDY CO?</h1>
              <p className="text-lg text-gray-400">Independent Commission for Infrastructure</p>
            </div>
            <div className="text-right bg-green-900 border-2 border-green-600 px-4 py-1">
              <p className="text-lg text-green-400 font-orbitron">DAYS LEFT</p>
              <p className="text-5xl font-bold text-green-300 animate-pulse font-orbitron">{gameState.daysRemaining}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          <div className="bg-black border-r-4 border-green-700 p-4">
            <div className="mb-4">
              <div className="bg-green-950 border-2 border-green-600 p-2 mb-2">
                <h2 className="text-2xl font-bold text-white font-orbitron">
                  {currentLocation.name}
                </h2>
              </div>
              
              <div className="border-4 border-green-600 mb-3">
                <img 
                  src={currentLocation.image} 
                  alt={currentLocation.name}
                  className="w-full h-64 object-cover pixel-border opacity-60 mix-blend-screen"
                  style={{filter: 'sepia(100%) hue-rotate(60deg) saturate(300%)'}}
                />
              </div>

              <div className="bg-green-950 border-2 border-green-600 p-3">
                <p className="text-lg text-gray-200">
                  {currentLocation.description}
                </p>
              </div>
            </div>

            <div className="bg-green-950 border-4 border-green-600 p-3">
              <h3 className="font-bold text-xl mb-2 text-green-400 font-orbitron">EVIDENCE DOSSIER</h3>
              
              <div className="space-y-2 text-base bg-black border-2 border-green-700 p-2">
                <div>
                  <p className="font-bold text-green-300 font-orbitron">APPEARANCE:</p>
                  <p className="text-gray-200 pl-2">
                    {gameState.evidence.appearance || "[UNKNOWN]"}
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-green-300 font-orbitron">HOBBY:</p>
                  <p className="text-gray-200 pl-2">
                    {gameState.evidence.hobby || "[UNKNOWN]"}
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-green-300 font-orbitron">VEHICLE:</p>
                  <p className="text-gray-200 pl-2">
                    {gameState.evidence.vehicle || "[UNKNOWN]"}
                  </p>
                </div>
                
                <div>
                  <p className="font-bold text-green-300 font-orbitron">TRAIT:</p>
                  <p className="text-gray-200 pl-2">
                    {gameState.evidence.trait || "[UNKNOWN]"}
                  </p>
                </div>
              </div>

              <div className="mt-2 text-base text-gray-300 font-orbitron">
                CLUES COLLECTED: {gameState.cluesCollected.length}
              </div>
            </div>
          </div>

          <div className="bg-black p-4 flex flex-col">
            {gameState.conversation && (
              <div className="bg-green-950 border-4 border-green-600 p-3 mb-4 flex-shrink-0">
                <div className="flex items-start gap-3 mb-3">
                  {gameState.conversation.avatarUrl && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img 
                        src={gameState.conversation.avatarUrl} 
                        alt={gameState.conversation.speaker}
                        className="w-16 h-16 rounded-full border-2 border-green-400 grayscale"
                        style={{ filter: 'grayscale(100%) brightness(0.8) contrast(1.2)' }}
                      />
                      <div 
                        className="absolute inset-0 rounded-full bg-green-500 mix-blend-color opacity-60 pointer-events-none"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-green-400 text-lg font-orbitron">
                      &gt; {gameState.conversation.speaker}
                    </p>
                    {gameState.selectedWitness && (
                      <p className="text-green-300 text-sm">
                        {gameState.selectedWitness.type} • {gameState.selectedWitness.location}
                      </p>
                    )}
                  </div>
                </div>
                <Typewriter 
                  text={gameState.conversation.text}
                  speed={10}
                  className="text-lg text-gray-200 whitespace-pre-line leading-relaxed"
                  onComplete={() => setGameState({...gameState, typewriterComplete: true})}
                />
              </div>
            )}

            {gameState.typewriterComplete && (
              <div className="space-y-3 flex-1">
                {gameState.showTravel ? (
                  <div className="bg-green-950 border-4 border-green-600 p-3">
                    <h4 className="font-bold mb-2 text-green-400 text-lg font-orbitron">TRAVEL (COST: 1 DAY)</h4>
                    <div className="space-y-2">
                      {currentLocation.connections.map(locKey => (
                        <button
                          key={locKey}
                          onClick={() => travelTo(locKey)}
                          className="w-full text-left bg-black hover:bg-green-900 border-2 border-green-600 p-2 text-base transition-all hover:scale-105"
                        >
                          <p className="font-bold text-white">&gt; {locations[locKey].name}</p>
                          <p className="text-gray-300 text-sm">{locations[locKey].description}</p>
                        </button>
                      ))}
                      <button
                        onClick={() => setGameState({...gameState, showTravel: false})}
                        className="w-full bg-green-900 hover:bg-green-800 text-white py-1 px-2 border-2 border-green-600 text-base"
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
                        className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-4 border-green-500 text-lg transition-all hover:scale-105 terminal-glow font-orbitron"
                      >
                        &gt; TRAVEL TO ANOTHER CITY
                      </button>
                      
                      <button
                        onClick={attemptArrest}
                        className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 border-4 border-green-500 text-lg transition-all hover:scale-105 terminal-glow font-orbitron"
                      >
                        &gt; ISSUE ARREST WARRANT
                      </button>
                    </div>

                    <div className="bg-green-950 border-4 border-green-600 p-3 mt-3">
                      <h3 className="font-bold text-lg mb-2 text-green-400 font-orbitron">INTERVIEW WITNESSES</h3>
                      <div className="space-y-2">
                        {currentLocation.witnesses.map((witness, idx) => (
                          <button
                            key={idx}
                            onClick={() => interviewWitness(witness)}
                            className="w-full text-left bg-black hover:bg-green-900 border-2 border-green-600 p-2 transition-all hover:scale-105"
                          >
                            <p className="font-bold text-white text-base">&gt; {witness.name}</p>
                            <p className="text-sm text-gray-300">{witness.type} - {witness.location}</p>
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
