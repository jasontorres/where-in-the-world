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
  previousLocation: string | null;
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
    previousLocation: null,
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
      previousLocation: gameState.currentLocation,
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'var(--win-desktop)'}}>
        <div className="max-w-4xl w-full win-window">
          {/* Title Bar */}
          <div className="win-title-bar flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">Where in the World is Zaldy Co?</span>
            </div>
            <div className="flex gap-1">
              <button className="w-6 h-6 win-button text-xs font-bold">_</button>
              <button className="w-6 h-6 win-button text-xs font-bold">□</button>
              <button className="w-6 h-6 win-button text-xs font-bold">✕</button>
            </div>
          </div>
          
          {/* Window Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2 text-blue-900">
                WHERE IN THE WORLD IS
              </h1>
              <h2 className="text-5xl font-black mb-4" style={{color: 'var(--win-blue)'}}>
                ZALDY CO?
              </h2>
              <div className="win-panel-inset p-4 mb-4">
                <p className="text-lg text-black font-bold">
                  A POLITICAL SATIRE INVESTIGATION
                </p>
              </div>
            </div>

            <div className="win-panel-inset p-4 mb-4">
              <h3 className="font-bold text-xl mb-3" style={{color: 'var(--win-blue)'}}>CASE FILE: OPERATION BAHA FLOOD</h3>
              <div className="text-black space-y-1">
                <p><span className="font-bold">SUSPECT:</span> Congressman Zaldy Co</p>
                <p><span className="font-bold">POSITION:</span> Former Chair, House Appropriations Committee</p>
                <p><span className="font-bold">CHARGES:</span> Plunder, Rigged Infrastructure Deals, Ghost Projects</p>
                <p><span className="font-bold">EMBEZZLED:</span> Over P100,000,000,000</p>
                <p><span className="font-bold">ASSETS:</span> $36M Gulfstream jet, $16M Helicopter</p>
                <p><span className="font-bold">LAST SEEN:</span> Left USA August 26, 2025</p>
              </div>
            </div>

            <div className="win-panel-inset p-4 mb-4">
              <h3 className="font-bold text-xl mb-3" style={{color: 'var(--win-blue)'}}>HOW TO PLAY</h3>
              <ul className="space-y-1 text-black">
                <li>• Interview witnesses to gather clues</li>
                <li>• Travel between cities following the trail</li>
                <li>• Collect evidence about Zaldy Co</li>
                <li>• Find him within 7 days</li>
                <li>• Issue arrest warrant at his location</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={startGame}
                className="win-button text-xl px-8 py-3 hover:brightness-105 active:brightness-95"
              >
                Start Investigation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLocation = locations[gameState.currentLocation];

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'var(--win-desktop)'}}>
        <div className="max-w-3xl w-full win-window">
          <div className="win-title-bar px-2 py-1">
            <span className="text-white font-bold">{gameState.gameWon ? 'Case Closed!' : 'Case File - Closed'}</span>
          </div>
          <div className="p-8" style={{background: 'var(--win-gray)'}}>
            <div className="text-center">
              {gameState.gameWon ? (
                <>
                  <div className="text-6xl mb-4 animate-bounce">🏆</div>
                  <h2 className="text-4xl font-bold mb-4" style={{color: 'var(--win-blue)'}}>CASE CLOSED!</h2>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">⚠️</div>
                  <h2 className="text-4xl font-bold mb-4 text-red-600">CASE COLD</h2>
                </>
              )}
              
              <div className="win-panel-inset p-6 mb-6">
                {gameState.conversation && (
                  <Typewriter 
                    text={gameState.conversation.text} 
                    speed={10}
                    className="text-sm text-black leading-relaxed text-left"
                    onComplete={() => setGameState({...gameState, typewriterComplete: true})}
                  />
                )}
              </div>

              {gameState.typewriterComplete && (
                <>
                  <div className="win-panel-inset p-4 mb-6">
                    <h3 className="font-bold mb-3 text-lg" style={{color: 'var(--win-blue)'}}>INVESTIGATION SUMMARY</h3>
                    <div className="text-black space-y-1 text-base">
                      <p><span className="font-bold">Days Used:</span> {7 - gameState.daysRemaining} of 7</p>
                      <p><span className="font-bold">Locations Visited:</span> {gameState.visitedLocations.length}</p>
                      <p><span className="font-bold">Clues Collected:</span> {gameState.cluesCollected.length}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.location.reload()}
                    className="win-button text-xl px-8 py-3 font-bold hover:brightness-105"
                  >
                    Start New Case
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: 'var(--win-desktop)'}}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="win-window mb-4">
          <div className="win-title-bar flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">INTERPOL Agent Terminal v1.0 - Where is Zaldy Co?</span>
            </div>
            <div className="flex gap-1">
              <button className="w-6 h-6 win-button text-xs font-bold">_</button>
              <button className="w-6 h-6 win-button text-xs font-bold">□</button>
              <button className="w-6 h-6 win-button text-xs font-bold">✕</button>
            </div>
          </div>
          <div className="p-3" style={{background: 'var(--win-gray)'}}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold" style={{color: 'var(--win-blue)'}}>WHERE IS ZALDY CO?</h1>
                <p className="text-sm text-gray-700">Investigation Active</p>
              </div>
              <div className="win-panel-inset px-4 py-2 text-center">
                <p className="text-sm font-bold" style={{color: 'var(--win-blue)'}}>DAYS LEFT</p>
                <p className="text-3xl font-bold text-red-600">{gameState.daysRemaining}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[600px]">
          {/* Left Panel - Location & Evidence */}
          <div className="win-window flex flex-col">
            <div className="win-title-bar px-2 py-1">
              <span className="text-white font-bold">Current Location - {currentLocation.name}</span>
            </div>
            <div className="p-4 flex-1 flex flex-col" style={{background: 'var(--win-gray)'}}>
              
              <div className="win-border-inset mb-3">
                <img 
                  src={currentLocation.image} 
                  alt={currentLocation.name}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="win-panel-inset p-3 mb-3">
                <p className="text-sm text-black">
                  {currentLocation.description}
                </p>
              </div>

              {/* Evidence Dossier */}
              <div className="win-panel-inset p-3 flex-1">
                <h3 className="font-bold text-base mb-2" style={{color: 'var(--win-blue)'}}>EVIDENCE DOSSIER</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-bold text-black">APPEARANCE:</p>
                    <p className="text-gray-700 pl-2 text-xs">
                      {gameState.evidence.appearance || "[UNKNOWN]"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-bold text-black">HOBBY:</p>
                    <p className="text-gray-700 pl-2 text-xs">
                      {gameState.evidence.hobby || "[UNKNOWN]"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-bold text-black">VEHICLE:</p>
                    <p className="text-gray-700 pl-2 text-xs">
                      {gameState.evidence.vehicle || "[UNKNOWN]"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-bold text-black">TRAIT:</p>
                    <p className="text-gray-700 pl-2 text-xs">
                      {gameState.evidence.trait || "[UNKNOWN]"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-400">
                  <p className="text-xs font-bold text-center" style={{color: 'var(--win-blue)'}}>CLUES: {gameState.cluesCollected.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Conversation, Actions & Witnesses */}
          <div className="win-window flex flex-col">
            <div className="win-title-bar px-2 py-1">
              <span className="text-white font-bold">Investigation Console</span>
            </div>
            <div className="p-4 flex-1 flex flex-col" style={{background: 'var(--win-gray)'}}>
              
              {/* Conversation */}
              {gameState.conversation && (
                <div className="win-panel-inset p-3 mb-3 flex-shrink-0">
                  <div className="flex items-start gap-3 mb-2">
                    {gameState.conversation.avatarUrl && (
                      <div className="w-12 h-12 flex-shrink-0">
                        <img 
                          src={gameState.conversation.avatarUrl} 
                          alt={gameState.conversation.speaker}
                          className="w-12 h-12 rounded border win-border-inset"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-black text-sm">
                        {gameState.conversation.speaker}
                      </p>
                      {gameState.selectedWitness && (
                        <p className="text-gray-700 text-xs">
                          {gameState.selectedWitness.type} • {gameState.selectedWitness.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <Typewriter 
                    text={gameState.conversation.text}
                    speed={10}
                    className="text-xs text-black whitespace-pre-line leading-relaxed"
                    onComplete={() => setGameState({...gameState, typewriterComplete: true})}
                  />
                </div>
              )}

              {/* Actions */}
              {gameState.typewriterComplete && (
                <div className="space-y-2 mb-3">
                  {gameState.showTravel ? (
                    <div className="win-panel-inset p-3">
                      <h4 className="font-bold mb-2 text-sm" style={{color: 'var(--win-blue)'}}>TRAVEL (COST: 1 DAY)</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {currentLocation.connections
                          .filter(locKey => locKey !== gameState.previousLocation)
                          .map(locKey => {
                            const isOnTrail = suspect.trail.includes(locKey);
                            const trailIndex = suspect.trail.indexOf(gameState.currentLocation);
                            const isNextInTrail = isOnTrail && trailIndex !== -1 && suspect.trail[trailIndex + 1] === locKey;
                            
                            return (
                              <button
                                key={locKey}
                                onClick={() => travelTo(locKey)}
                                className={`w-full text-left win-button p-2 text-xs hover:brightness-105 ${
                                  isNextInTrail ? 'border-4 border-blue-600' : ''
                                }`}
                              >
                                <p className="font-bold text-black">
                                  {locations[locKey].name}
                                  {isNextInTrail && <span className="ml-2 text-blue-600 text-xs">● HOT</span>}
                                  {isOnTrail && !isNextInTrail && <span className="ml-2 text-gray-600 text-xs">○</span>}
                                </p>
                              </button>
                            );
                          })}
                      </div>
                      <button
                        onClick={() => setGameState({...gameState, showTravel: false})}
                        className="w-full win-button py-1 px-2 text-sm hover:brightness-105 mt-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => setGameState({...gameState, showTravel: true})}
                        className="w-full win-button py-2 px-4 text-sm font-bold hover:brightness-105"
                      >
                        Travel to Another City
                      </button>
                      
                      <button
                        onClick={attemptArrest}
                        className="w-full win-button py-2 px-4 text-sm font-bold hover:brightness-105"
                      >
                        Issue Arrest Warrant
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Available Witnesses */}
              <div className="win-panel-inset p-3 flex-1">
                <h3 className="font-bold text-base mb-2" style={{color: 'var(--win-blue)'}}>AVAILABLE WITNESSES</h3>
                <div className="space-y-2">
                  {currentLocation.witnesses.map((witness, idx) => (
                    <button
                      key={idx}
                      onClick={() => interviewWitness(witness)}
                      disabled={gameState.daysRemaining <= 0}
                      className="w-full text-left win-button p-2 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <p className="font-bold text-black text-sm">{witness.name}</p>
                      <p className="text-gray-700 text-xs">{witness.type} • {witness.location}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZaldyCoGame;
