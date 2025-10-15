import { Witness } from './locations';
import { Suspect } from './suspects';

export interface ClueResponse {
  intro: string;
  clue: string;
  type: 'appearance' | 'hobby' | 'vehicle' | 'trait' | 'direction' | 'nothing';
  evidenceValue?: string;
}

// Appearance clues about the suspect
export const appearanceClues = [
  "I saw a portly Filipino man in a barong tagalog. Round face, looked like someone used to power and privilege.",
  "Mataba, may balbas, parang politiko. The type who smiles for cameras while people drown in floods.",
  "Big guy in formal Filipino attire. Had that look - you know, the 'I'm untouchable' kind of face.",
  "Saw a heavy-set man, expensive watch, designer barong. Definitely someone with money... stolen money."
];

// Hobby clues about the suspect
export const hobbyClues = [
  "Overheard him talking about his Gulfstream jet. THIRTY-SIX MILLION DOLLARS. Para sa anong medical treatment?!",
  "He was bragging about his helicopter collection. Millions of dollars each. Meanwhile, Manila floods every year.",
  "Obsessed with luxury aircraft. Has a whole fleet - jets, helicopters. All bought with flood control budget, daw.",
  "Kept talking about his AgustaWestland helicopter. The audacity - people drowning while he collects toys!"
];

// Vehicle clues about the suspect
export const vehicleClues = [
  "Arrived in a private Gulfstream 350. The same jet featured in the news - P2 billion of taxpayer money!",
  "Nakita ko yung private jet niya sa tarmac. Gulfstream 350. While flood victims have nothing, he has THIS.",
  "Travels by private luxury jet. The audacity - people are drowning and he's flying in P2B worth of aircraft.",
  "His jet landed here - a Gulfstream 350. That's not medical treatment money, that's plunder!"
];

// Trait clues about the suspect
export const traitClues = [
  "He keeps saying he lives modestly - pero may $50 million in jets and helicopters?! Sinungaling!",
  "Claims the allegations are politically motivated. Classic deflection. His assets speak louder than his denials.",
  "Denies everything. Says his family lives simply. Pero bakit may Gulfstream at AgustaWestland helicopter?!",
  "Had the nerve to call himself a victim. A VICTIM! With millions in stolen public funds!"
];

// Generate direction clue based on trail position
export const generateDirectionClue = (
  nextLocation: string,
  locationName: string,
  isOnTrail: boolean
): string => {
  if (isOnTrail) {
    // On the right trail - clear hints to next location
    const accurateClues = [
      `I heard him mention ${locationName}. He seemed nervous, like he was running from something.`,
      `Overheard his people talking. Next stop: ${locationName}. He's definitely trying to hide there.`,
      `His fixer mentioned ${locationName}. That's where the money trail leads.`,
      `He was asking about flights to ${locationName}. Left in a hurry about a day ago.`,
      `Saw his luggage tags - ${locationName}. He's moving fast, probably thinks he can disappear there.`,
      `His driver said they're heading to ${locationName}. The guy tips well with stolen money.`
    ];
    return accurateClues[Math.floor(Math.random() * accurateClues.length)];
  } else {
    // Off the trail - vague or misleading information
    const vagueClues = [
      "I heard someone mention his name, but I'm not sure where he went. Maybe somewhere in Asia?",
      "People say he was here, but that was days ago. Trail's gone cold.",
      "Rumors say he went somewhere with banks... or was it casinos? Hard to tell what's true.",
      "Someone said they saw him, but honestly, it could be misinformation. These politicians have doubles.",
      "I think he might have gone somewhere, but I didn't see him myself. Just gossip.",
      "No idea where he went. Could be anywhere by now. Rich people have many hiding places."
    ];
    return vagueClues[Math.floor(Math.random() * vagueClues.length)];
  }
};

// Generate a clue from a witness
export const generateClue = (
  witness: Witness,
  suspect: Suspect,
  currentLocation: string,
  isOnTrail: boolean,
  nextLocation: string | null,
  nextLocationName: string | null
): ClueResponse => {
  const intro = `You approach ${witness.name}, a ${witness.type} at ${witness.location}.`;
  
  // If on the trail, give better clues more often
  const clueTypes = isOnTrail 
    ? ['appearance', 'hobby', 'vehicle', 'trait', 'direction', 'direction'] // More direction clues when on trail
    : ['appearance', 'hobby', 'vehicle', 'trait', 'direction', 'nothing'];   // Possible dead end
  
  const clueType = clueTypes[Math.floor(Math.random() * clueTypes.length)] as 'appearance' | 'hobby' | 'vehicle' | 'trait' | 'direction' | 'nothing';
  
  let clueText = '';
  let evidenceValue: string | undefined;
  
  switch (clueType) {
    case 'appearance':
      clueText = appearanceClues[Math.floor(Math.random() * appearanceClues.length)];
      evidenceValue = clueText;
      break;
    case 'hobby':
      clueText = hobbyClues[Math.floor(Math.random() * hobbyClues.length)];
      evidenceValue = clueText;
      break;
    case 'vehicle':
      clueText = vehicleClues[Math.floor(Math.random() * vehicleClues.length)];
      evidenceValue = clueText;
      break;
    case 'trait':
      clueText = traitClues[Math.floor(Math.random() * traitClues.length)];
      evidenceValue = clueText;
      break;
    case 'direction':
      if (nextLocation && nextLocationName) {
        clueText = generateDirectionClue(nextLocation, nextLocationName, isOnTrail);
      } else {
        // At final location
        clueText = isOnTrail
          ? "He's here. I saw him recently. Be careful - he has security and money to make problems disappear."
          : "I haven't seen anyone matching that description. You might be chasing ghosts.";
      }
      break;
    case 'nothing':
      clueText = "Sorry, I haven't seen anyone like that. Maybe try asking someone else?";
      break;
    default:
      clueText = "I'm not sure I can help you with that.";
  }
  
  return {
    intro,
    clue: `${witness.name}: "${clueText}"`,
    type: clueType,
    evidenceValue
  };
};
