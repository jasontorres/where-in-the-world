import { getRandomLocationKey } from './locations';

export interface Suspect {
  id: number;
  name: string;
  appearance: string;
  hobby: string;
  vehicle: string;
  trait: string;
  currentLocation: string;
}

export const createSuspect = (): Suspect => {
  return {
    id: 1,
    name: "Zaldy Co",
    appearance: "Portly congressman, often in barong, round face with prominent jowls",
    hobby: "Collecting luxury aircraft and helicopters",
    vehicle: "Travels by private Gulfstream 350 jet",
    trait: "Claims to live modestly despite owning $50M+ in luxury aircraft",
    currentLocation: getRandomLocationKey() // Random location each game
  };
};
