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
  "I saw a portly Filipino gentleman in traditional barong tagalog. Round face, distinguished appearance. Looked like a politician or government official.",
  "Heavy-set man, well-dressed. Filipino, I think. Had that confident air about him - someone used to being in charge.",
  "Middle-aged Filipino man, stocky build. Wore formal attire, expensive watch. The kind of person who commands attention when entering a room.",
  "Older gentleman with prominent features. Filipino accent. Carried himself with authority, very well-groomed.",
  "I noticed a Filipino man, perhaps in his 50s. Round face, graying hair. Wore traditional formal clothing. Very composed demeanor.",

  "Heavy build, Filipino. Dressed impeccably - clearly someone of status. Had that political smile, if you know what I mean.",
  "Saw a distinguished-looking Filipino gentleman. Not particularly tall, but substantial presence. Looked like old money."
];

// Hobby clues about the suspect
export const hobbyClues = [
  "Overheard him discussing private aviation. Mentioned owning a Gulfstream jet - talked about it like collecting cars. Very passionate about aircraft.",
  "He was quite animated talking about his helicopter collection. Multiple aircraft, apparently. Seemed to be his main interest.",
  "I heard him on the phone arranging maintenance for his private jet. Gulfstream 350, I think he said. Must cost a fortune.",
  "He mentioned flying in his own helicopter recently. Talked about aviation like it was a hobby. Must be quite wealthy.",
  "Overheard a conversation about luxury aircraft. He owns both jets and helicopters, apparently. Aviation enthusiast.",
  "He was showing photos of his private aircraft to someone. Sounded very proud of his collection. Jets, helicopters - the works.",
  "Mentioned something about aircraft hangar fees. Multiple aircraft, from what I gathered. Quite the expensive hobby."
];

// Vehicle clues about the suspect
export const vehicleClues = [
  "He arrived by private jet. Gulfstream 350 - one of the nicer models. Saw it on the tarmac myself.",
  "Travels exclusively by private aircraft. His jet is a Gulfstream - must be worth tens of millions.",
  "I saw his arrival. Private Gulfstream jet, professional crew. Not commercial - definitely his own plane.",
  "He doesn't fly commercial. Has his own Gulfstream 350. Watched it land - beautiful aircraft, very expensive.",
  "Departed in a luxury private jet. Gulfstream model. The kind you see CEOs and dignitaries using.",
  "His transportation is a private Gulfstream jet. Saw the registration - it's registered to him personally.",
  "He flew in on a private aircraft - Gulfstream 350. Those run about $30-40 million. Quite the investment."
];

// Trait clues about the suspect
export const traitClues = [
  "He kept emphasizing how modestly he lives. Strange, considering the private jets and luxury lifestyle I observed.",
  "Very defensive when asked about his wealth. Insisted his assets were legitimate, but seemed uncomfortable with questions.",
  "He mentioned that allegations against him are 'politically motivated.' Sounded like he'd rehearsed that line.",
  "Presented himself as a public servant being unfairly targeted. The contradiction with his lifestyle was... noticeable.",
  "Very smooth talker. Deflected questions about his assets with political rhetoric. Well-practiced at it.",
  "He described himself as a victim of persecution. Meanwhile, his entourage and lifestyle suggested otherwise.",
  "Calm and confident demeanor. Either genuinely innocent or very good at maintaining composure under scrutiny."
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
      `I overheard him mention ${locationName} to his associate. They seemed to be discussing travel arrangements.`,
      `His assistant was making calls about ${locationName}. Sounded like that's where they're heading next.`,
      `He left a hotel brochure on the table - ${locationName}. Might have been accidental, or maybe he doesn't think anyone's watching.`,
      `I heard him ask about flights to ${locationName}. Left here about a day ago, I believe.`,
      `Saw luggage tags marked for ${locationName}. He departed in a hurry yesterday.`,
      `His driver mentioned they were heading to ${locationName}. Seemed to be the next stop on his itinerary.`,
      `Overheard a phone conversation - something about meeting contacts in ${locationName}. Left earlier today.`,
      `He was researching ${locationName} on his phone. Looked like he was planning his next move there.`,
      `His security detail was discussing logistics for ${locationName}. That's definitely where he went.`,
      `I delivered something to his hotel room - saw ${locationName} travel documents on his desk.`
    ];
    return accurateClues[Math.floor(Math.random() * accurateClues.length)];
  } else {
    // Off the trail - vague or misleading information
    const vagueClues = [
      "I heard someone mention his name recently, but I'm not certain where he went. Could be anywhere in the region.",
      "People say he was here, but that was several days ago. The trail's probably gone cold by now.",
      "There are rumors about him going somewhere with strict banking privacy. Or was it casinos? Hard to separate fact from fiction.",
      "Someone claimed to see him, but these high-profile people often have security doubles. Can't be sure it was really him.",
      "I've heard talk, but nothing concrete. With his resources, he could be anywhere by now.",
      "No reliable information, I'm afraid. People with money can disappear easily - private transportation, false trails.",
      "There's been gossip, but nothing I'd stake my reputation on. Too many conflicting reports.",
      "I might have seen someone matching that description, but it was brief. Could have been him, could have been anyone.",
      "The word on the street is unreliable. Everyone has a theory, but no one has facts.",
      "I heard he might be in the area, but that was days ago. If he was ever here, he's long gone now."
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
