import { getRandomLocationKey, locations } from './locations';

export interface Suspect {
  id: number;
  name: string;
  appearance: string;
  hobby: string;
  vehicle: string;
  trait: string;
  currentLocation: string;
  trail: string[]; // Path the suspect took to reach current location
}

// Generate a trail of locations the suspect traveled through
const generateTrail = (finalLocation: string): string[] => {
  const trail: string[] = ['philippines']; // Always start from Philippines
  const visited = new Set(['philippines']);
  let current = 'philippines';
  
  // Generate 2-3 stops before reaching final location
  const numStops = Math.floor(Math.random() * 2) + 2; // 2 or 3 stops
  
  for (let i = 0; i < numStops; i++) {
    const possibleNext = locations[current].connections.filter(loc => !visited.has(loc));
    if (possibleNext.length === 0) break;
    
    const next = possibleNext[Math.floor(Math.random() * possibleNext.length)];
    trail.push(next);
    visited.add(next);
    current = next;
  }
  
  // Ensure we end at the final location (if not already there)
  if (trail[trail.length - 1] !== finalLocation) {
    trail.push(finalLocation);
  }
  
  return trail;
};

export const createSuspect = (): Suspect => {
  const finalLocation = getRandomLocationKey();
  const trail = generateTrail(finalLocation);
  
  return {
    id: 1,
    name: "Zaldy Co",
    appearance: "Portly congressman, often in barong, round face with prominent jowls",
    hobby: "Collecting luxury aircraft and helicopters",
    vehicle: "Travels by private Gulfstream 350 jet",
    trait: "Claims to live modestly despite owning $50M+ in luxury aircraft",
    currentLocation: finalLocation,
    trail: trail
  };
};
