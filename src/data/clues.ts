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
    // On the right trail - VERY CLEAR directions to next location
    const accurateClues = [
      `He's headed to ${locationName}. I heard his assistant booking flights there yesterday.`,
      `${locationName} - that's where he's going. His driver told me they left this morning.`,
      `He mentioned ${locationName} multiple times. That's definitely his next destination.`,
      `I saw his travel itinerary. Next stop: ${locationName}. He should be there by now.`,
      `His security team was discussing ${locationName}. They departed about a day ago.`,
      `${locationName}. I'm certain that's where he went. Saw the luggage tags myself.`,
      `He flew to ${locationName}. The jet was fueled and ready yesterday afternoon.`,
      `I overheard him say "${locationName}" on the phone. Sounded urgent, like he needed to get there fast.`,
      `His hotel reservation was for ${locationName}. Left here heading straight there.`,
      `${locationName} - no question about it. That's his next stop on the way to hiding.`
    ];
    return accurateClues[Math.floor(Math.random() * accurateClues.length)];
  } else {
    // Off the trail - still somewhat helpful but less certain
    const vagueClues = [
      "I heard rumors he might be in the area, but I can't confirm. Could be days old information.",
      "Someone matching that description passed through, but that was a while ago. Not sure where he went from here.",
      "There's talk he was here, but the trail seems cold. Rich people leave false leads.",
      "I might have heard his name mentioned, but nothing concrete. He could be anywhere by now.",
      "People say they saw someone like that, but high-profile fugitives often use doubles.",
      "The information here is unreliable. Too many conflicting stories about where he went.",
      "I've heard various rumors - banking havens, casino cities - but nothing I'd bet on.",
      "If he was here, it was days ago. The trail has gone cold.",
      "Sorry, no solid leads. People with that much money know how to disappear.",
      "I can't give you a reliable direction. The information is too scattered."
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
  
  // Balanced clues: 50% direction, 50% character info when on trail
  const clueTypes = isOnTrail 
    ? ['direction', 'direction', 'direction', 'direction', 'appearance', 'hobby', 'vehicle', 'trait'] // 4/8 = 50% direction, 50% character
    : ['appearance', 'hobby', 'vehicle', 'trait', 'direction', 'nothing'];   // 1/6 direction when off trail
  
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
      clueText = "I haven't seen anyone matching that exact description. He might have been here, but if so, he's already moved on. Try checking the connections from here - he could be at any of the nearby cities.";
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
