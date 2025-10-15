export interface Witness {
  name: string;
  type: string;
  location: string;
}

export interface Location {
  name: string;
  description: string;
  connections: string[];
  image: string;
  witnesses: Witness[];
}

export interface Locations {
  [key: string]: Location;
}

export const locations: Locations = {
  philippines: {
    name: "Philippines",
    description: "Ground zero. Where billions in flood control funds vanished while the entire nation drowns every rainy season.",
    connections: ["singapore", "hongkong", "dubai"],
    image: "https://images.unsplash.com/photo-1607282729548-e1d13feae36f?fit=crop&q=80&w=600&h=400",

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
    image: "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=600&h=400&fit=crop", // Marina Bay Sands
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
    image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?fit=crop&q=80&w=600&h=400",
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
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop", // Burj Khalifa
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
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop", // Matterhorn/Zermatt Alps
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
    image: "https://images.unsplash.com/photo-1708580175277-6c171e822f94?fit=crop&q=80&w=600&h=400",
    witnesses: [
      { name: "Casino Host", type: "Gaming", location: "Venetian Macau" },
      { name: "VIP Room Manager", type: "Gaming", location: "Grand Lisboa" },
      { name: "Junket Operator", type: "Gaming", location: "Casino Floor" }
    ]
  }
};

// Get random location key (excluding Philippines as it's the starting point)
export const getRandomLocationKey = (): string => {
  const locationKeys = Object.keys(locations).filter(key => key !== 'philippines');
  return locationKeys[Math.floor(Math.random() * locationKeys.length)];
};
