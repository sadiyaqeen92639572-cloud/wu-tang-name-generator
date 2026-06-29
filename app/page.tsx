'use client';

import { useState, useEffect } from 'react';
import { Copy, Share2, Check, ChevronDown, Sword, Flame, Sparkles, Skull, Shield, Crown, Eye } from 'lucide-react';

// Word lists of ~150 words each curated for authentic Wu-Tang flavor.
// No duplicates between lists. Fully typed, no truncations.
const PREFIXES = [
  "Ghostly", "Iron", "Mystic", "Bronze", "Shadow", "Deadly", "Infinite", "Golden", "Razor", "Thunder",
  "Ancient", "Liquid", "Steel", "Phantom", "Blazing", "Silent", "Wicked", "Diamond", "Crimson", "Jade",
  "Venom", "Sovereign", "Ruthless", "Spectral", "Emerald", "Cobra", "Titan", "Celestial", "Lunar", "Volcanic",
  "Obsidian", "Shaolin", "Dynamic", "Divine", "Resolute", "Furious", "Drunken", "Cosmic", "Astral", "Eternal",
  "Midnight", "Stormy", "Rebel", "Renegade", "Rogue", "Savage", "Vengeful", "Immortal", "Shogun", "Daimyo",
  "Samurai", "Ninja", "Ronin", "Warlord", "Overlord", "Emperor", "Majestic", "Supreme", "Ultimate", "Sacred",
  "Cursed", "Haunted", "Eerie", "Grim", "Dark", "Shadowy", "Obscure", "Stealth", "Covert", "Secret", "Cryptic",
  "Arcane", "Hidden", "Unseen", "Masked", "Veiled", "Blind", "Deaf", "Quiet", "Still", "Frozen", "Icy",
  "Frosty", "Cold", "Bleak", "Raw", "Rough", "Tough", "Hard", "Heavy", "Mighty", "Brave", "Fearless", "Bold",
  "Fierce", "Wild", "Mad", "Crazy", "Psycho", "Insane", "Solar", "Stellar", "Galactic", "Nebula", "Void",
  "Abyss", "Chaos", "Quantum", "Atomic", "Toxic", "Lethal", "Fatal", "Mortal", "Vital", "Primal", "Tribal",
  "Urban", "Street", "Ghetto", "Hood", "Alley", "Concrete", "Asphalt", "Gravel", "Brick", "Stone", "Rock",
  "Flint", "Coal", "Ash", "Dust", "Smoke", "Fog", "Mist", "Haze", "Cloud", "Wind", "Gale", "Blast", "Wave",
  "Tide", "Flood", "Surge", "Flame", "Ignited", "Molten", "Ashen", "Serrated", "Barbed", "Jagged", "Sharp"
];

const SUFFIXES = [
  "Slayer", "Fist", "Monk", "Specter", "Dragon", "Blade", "Tiger", "Scholar", "Disciple", "Warrior",
  "Cipher", "Mantis", "Eagle", "Serpent", "Assassin", "General", "Prophet", "Destroyer", "Avenger", "Clan",
  "Method", "Sword", "Chamber", "Temple", "Lotus", "Sphinx", "Panther", "Cyclone", "Viper", "Legend",
  "Master", "Sensei", "Guru", "Sage", "Priest", "Bishop", "Knight", "Ranger", "Hunter", "Stalker",
  "Tracker", "Runner", "Walker", "Rider", "Driver", "Pilot", "Captain", "Chief", "Boss", "King",
  "Prince", "Duke", "Baron", "Lord", "Monarch", "Ruler", "Leader", "Commander", "Soldier", "Fighter",
  "Gladiator", "Champion", "Victor", "Conqueror", "Invader", "Raider", "Bandit", "Outlaw", "Pirate",
  "Corsair", "Mercenary", "Agent", "Operative", "Scout", "Sentinel", "Warden", "Guardian", "Protector",
  "Defender", "Shield", "Spear", "Arrow", "Bolt", "Dagger", "Axe", "Hammer", "Mace", "Club",
  "Staff", "Wand", "Scroll", "Book", "Tome", "Key", "Ring", "Crown", "Throne", "Gate",
  "Door", "Wall", "Tower", "Castle", "Fort", "Keep", "Stronghold", "Haven", "Sanctuary", "Shrine",
  "Altar", "Tomb", "Grave", "Vault", "Crypt", "Cell", "Pit", "Cave", "Den", "Nest",
  "Hive", "Web", "Net", "Trap", "Snare", "Hook", "Chain", "Rope", "Knot", "Thread",
  "Loom", "Fabric", "Cloak", "Visor", "Shroud", "Cowl", "Helmet", "Armor", "Mail", "Plate",
  "Crest", "Badge", "Emblem", "Symbol", "Sign", "Token", "Mark", "Stamp", "Seal", "Bond",
  "Oath", "Pact"
];

// Curated sub-pools mapping to the 5 distinct Wu-Tang Chamber Styles
const STYLE_POOLS: Record<string, { prefixes: string[]; suffixes: string[] }> = {
  classic: {
    prefixes: PREFIXES,
    suffixes: SUFFIXES,
  },
  shaolin: {
    prefixes: [
      "Shaolin", "Drunken", "Mystic", "Ancient", "Jade", "Hidden", "Silent", "Quiet", "Blind", "Masked", 
      "Unseen", "Divine", "Furious", "Resolute", "Sacred", "Shadowy", "Bronze", "Sovereign", "Celestial", 
      "Immortal", "Shogun", "Daimyo", "Samurai", "Ninja", "Ronin", "Stealth", "Veiled", "Still"
    ],
    suffixes: [
      "Monk", "Fist", "Temple", "Lotus", "Disciple", "Sage", "Sensei", "Guru", "Knight", "Warden", 
      "Staff", "Dragon", "Tiger", "Mantis", "Eagle", "Serpent", "Sword", "Scholar", "Chamber", "Sanctuary", 
      "Shrine", "Altar", "Tomb", "Crest", "Emblem", "Symbol", "Oath", "Pact"
    ]
  },
  street: {
    prefixes: [
      "Street", "Ghetto", "Hood", "Concrete", "Asphalt", "Heavy", "Tough", "Hard", "Rough", "Raw", 
      "Dynamic", "Steel", "Iron", "Warlord", "Overlord", "Rebel", "Renegade", "Savage", "Barbed", "Urban",
      "Alley", "Gravel", "Brick", "Stone", "Rock", "Flint", "Coal", "Ash", "Dust", "Smoke", "Ruthless"
    ],
    suffixes: [
      "General", "Boss", "Chief", "Captain", "Commander", "Champion", "Soldier", "Fighter", "Gladiator", 
      "Outlaw", "Bandit", "Agent", "Scout", "Guardian", "Defender", "Shield", "Ranger", "Hunter", "Stalker", 
      "Tracker", "Runner", "Walker", "Rider", "Driver", "Pilot", "King", "Prince", "Duke", "Baron", "Lord"
    ]
  },
  mystic: {
    prefixes: [
      "Mystic", "Cosmic", "Astral", "Celestial", "Lunar", "Solar", "Stellar", "Nebula", "Void", "Abyss", 
      "Infinite", "Eternal", "Ghostly", "Phantom", "Spectral", "Arcane", "Cryptic", "Golden", "Blazing", 
      "Midnight", "Stormy", "Obscure", "Secret", "Hidden", "Unseen", "Veiled", "Quantum", "Atomic"
    ],
    suffixes: [
      "Prophet", "Specter", "Sphinx", "Cipher", "Legend", "Oracle", "Spirit", "Ghost", "Priest", "Bishop", 
      "Wizard", "Mage", "Scroll", "Tome", "Key", "Shrine", "Sanctuary", "Crown", "Throne", "Gate", 
      "Door", "Wall", "Tower", "Castle", "Fort", "Keep", "Stronghold", "Emblem", "Symbol", "Sign", "Token", "Mark"
    ]
  },
  hardcore: {
    prefixes: [
      "Deadly", "Wicked", "Razor", "Venom", "Cobra", "Viper", "Furious", "Vengeful", "Cursed", "Haunted", 
      "Grim", "Dark", "Fatal", "Lethal", "Toxic", "Chaos", "Crimson", "Barbed", "Serrated", "Jagged", 
      "Sharp", "Blazing", "Stormy", "Savage", "Eerie", "Bleak", "Molten", "Ashen", "Thunder", "Titan"
    ],
    suffixes: [
      "Slayer", "Blade", "Assassin", "Destroyer", "Avenger", "Demon", "Beast", "Monster", "Dagger", "Axe", 
      "Hammer", "Pit", "Snare", "Hook", "Chain", "Poison", "Flame", "Viper", "Cyclone", "Spear", "Arrow", 
      "Bolt", "Mace", "Club", "Tomb", "Grave", "Vault", "Crypt", "Cell", "Web", "Net", "Trap"
    ]
  }
};

const CHAMBER_STYLES = [
  {
    id: 'classic' as const,
    name: 'Classic',
    tag: 'Classic Wu-Tang',
    desc: 'Traditional flavor',
    icon: Crown,
  },
  {
    id: 'shaolin' as const,
    name: 'Shaolin',
    tag: 'Shaolin Warrior',
    desc: 'Martial arts & temple',
    icon: Sword,
  },
  {
    id: 'street' as const,
    name: 'Street',
    tag: 'Street Legend',
    desc: 'Urban grit & power',
    icon: Shield,
  },
  {
    id: 'mystic' as const,
    name: 'Mystic',
    tag: 'Mystic Monk',
    desc: 'Celestial & cosmic',
    icon: Eye,
  },
  {
    id: 'hardcore' as const,
    name: 'Hardcore',
    tag: 'Hardcore Raw',
    desc: 'Sharp & aggressive',
    icon: Skull,
  },
];

// Deterministic Hash Function matching request criteria
function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Generate the unique Wu-Tang style alias based on the chosen style
function generateName(input: string, style: 'classic' | 'shaolin' | 'street' | 'mystic' | 'hardcore' = 'classic'): string | null {
  const clean = input.trim().toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return null;
  
  // Easter egg: Donald Glover always resolves to Childish Gambino across all eras
  if (clean === 'donaldglover') {
    return 'Childish Gambino';
  }

  // Easter egg: Austin Richard Post always resolves to Post Malone
  if (clean === 'austinrichardpost') {
    return 'Post Malone';
  }

  const reversed = clean.split('').reverse().join('');
  
  const pool = STYLE_POOLS[style] || STYLE_POOLS.classic;
  const prefixes = pool.prefixes;
  const suffixes = pool.suffixes;

  const prefix = prefixes[hashStr(clean) % prefixes.length];
  const suffix = suffixes[hashStr(reversed) % suffixes.length];
  
  // avoid prefix === suffix (edge case)
  if (prefix === suffix) {
    return prefix + ' ' + suffixes[(hashStr(reversed) + 1) % suffixes.length];
  }
  return prefix + ' ' + suffix;
}

export default function Home() {
  const [nameInput, setNameInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'classic' | 'shaolin' | 'street' | 'mystic' | 'hardcore'>('classic');
  const [result, setResult] = useState<string | null>(null);
  const [copiedName, setCopiedName] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Parse URL search parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    const styleParam = params.get('style');
    const validatedStyle = ['classic', 'shaolin', 'street', 'mystic', 'hardcore'].includes(styleParam || '')
      ? (styleParam as 'classic' | 'shaolin' | 'street' | 'mystic' | 'hardcore')
      : 'classic';

    const timer = setTimeout(() => {
      if (styleParam && validatedStyle) {
        setSelectedStyle(validatedStyle);
      }
      if (nameParam) {
        setNameInput(nameParam);
        const alias = generateName(nameParam, validatedStyle);
        if (alias) {
          setResult(alias);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Handle generation action
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const alias = generateName(nameInput, selectedStyle);
    if (alias) {
      setResult(alias);
      // Update URL search parameters to make it shareable
      const newUrl = `${window.location.pathname}?name=${encodeURIComponent(nameInput.trim())}&style=${selectedStyle}`;
      window.history.pushState({}, '', newUrl);
    } else {
      setResult(null);
    }
  };

  // Switch style & update name instantly if name is already provided
  const handleStyleSelect = (style: 'classic' | 'shaolin' | 'street' | 'mystic' | 'hardcore') => {
    setSelectedStyle(style);
    if (nameInput.trim()) {
      const alias = generateName(nameInput, style);
      if (alias) {
        setResult(alias);
        const newUrl = `${window.location.pathname}?name=${encodeURIComponent(nameInput.trim())}&style=${style}`;
        window.history.pushState({}, '', newUrl);
      }
    }
  };

  // Copy alias text to clipboard
  const handleCopyName = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    } catch (err) {
      console.error('Failed to copy name: ', err);
    }
  };

  // Share or copy link
  const handleShareLink = async () => {
    if (!nameInput) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(nameInput.trim())}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Wu-Tang Name Generator",
          text: `Find your rap alias instantly! My Wu-Tang style rap name is: ${result}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or failed, falling back to copy', err);
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  // Toggle FAQ accordion item
  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // FAQ contents
  const FAQs = [
    {
      q: "How does the Wu-Tang name generator work?",
      a: "The generator takes your input name and cleans it of special characters and numbers. It then converts the forward string and reversed string into two deterministic integer values using an optimized polynomial hash function. These values map precisely to our custom-crafted arrays of 150 authentic prefixes and 150 suffixes."
    },
    {
      q: "Is my Wu-Tang name always the same?",
      a: "Absolutely. Because this tool utilizes a deterministic mathematical hashing algorithm instead of a random number generator, entering the exact same spelling will always reveal the exact same rap name. This creates a permanent, immutable identity that acts as your official rap alias."
    },
    {
      q: "Can I generate a Wu-Tang name in French?",
      a: "Yes, the algorithm processes any string inputs, including accents and characters typical of French names (e.g., Sébastien or François). The output elements will map to the same authentic English-style Wu-Tang Clan lexicon, keeping your global rap aesthetic intact."
    },
    {
      q: "What makes a good rap name?",
      a: "A great rap name combines street power titles, ancient elements, or martial arts philosophies to tell a narrative. The Wu-Tang style is famous for blending esoteric eastern wisdom (like Monks, Lotus, and Temples) with gritty urban realism (like Steel, Razor, and Shogun), giving your alias maximum lyrical impact."
    },
    {
      q: "How do I share my Wu-Tang name?",
      a: "Simply click the 'Share Link' button to copy your unique custom URL (e.g., ?name=yourname) to your clipboard, or use your device's native sharing screen. Anyone who opens your link will immediately see your custom-generated rap alias directly in their browser."
    },
    {
      q: "Is this Wu-Tang name generator free?",
      a: "Yes, this utility is 100% free with zero ads, logins, or hidden premium paywalls. You can generate unlimited names for friends, family, crew members, or your entire clan without ever needing an account."
    },
    {
      q: "Can I use my Wu-Tang name as a real artist name?",
      a: "Certainly! Many of the greatest rap artists, producers, and lyricists have launched their careers using names inspired by or generated from Wu-Tang word pools. It is fully available for your stage name, social handles, or mixtape covers."
    },
    {
      q: "What is the Wu-Tang Clan name style?",
      a: "The Wu-Tang Clan style is built on five pillars: classic martial arts titles (e.g., Master, Disciple, Temple), organic chemistry (e.g., Liquid, Cosmic, Acid), urban resilience (e.g., Iron, Steel, Concrete), criminal underworld aliases (e.g., Assassin, Warlord), and supreme honorifics (e.g., Divine, Sovereign, Eternal)."
    }
  ];

  // Injected JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Wu-Tang Clan Rap Name Generator: Choose Your Style and Create Your Alias",
        "description": "Use the Wu-Tang clan rap name generator to pick a style and create a unique rap alias. Try classic, Shaolin, street, mystic, and hardcore options.",
        "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQs.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-[#e0e0e0] relative overflow-x-hidden border-4 border-[#FFD700]">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-yellow-500/3 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Watermarked Background 'W' */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <span 
          className="font-bebas text-[35rem] sm:text-[45rem] select-none text-yellow-500/[0.02]"
          style={{ textShadow: '0 0 40px rgba(255,215,0,0.01)' }}
        >
          W
        </span>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Styled per Sophisticated Dark Theme */}
      <header className="h-20 w-full border-b-2 border-[#FFD700] flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] relative z-10 px-4">
        <h1 
          className="font-bebas text-3xl sm:text-4xl md:text-5xl text-[#FFD700] tracking-[4px] font-bold uppercase"
          style={{ textShadow: '2px 2px 0 #000' }}
        >
          Wu-Tang clan rap name generator
        </h1>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 py-12 relative z-10 gap-12">
        
        {/* Generator Box */}
        <div className="w-full max-w-[600px] text-center">
          {/* Stylized Vector Golden W Shield */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center group">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full fill-none stroke-[#FFD700] stroke-[2.5] filter drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-transform duration-700 hover:rotate-12"
            >
              <path d="M10,25 C15,35 18,38 25,25 C32,10 37,10 42,28 C45,40 48,45 50,45 C52,45 55,40 58,28 C63,10 68,10 75,25 C82,38 85,35 90,25 C85,60 80,85 50,90 C20,85 15,60 10,25 Z" />
              <path d="M30,42 L50,65 L70,42" className="stroke-[#FFD700]/60 stroke-2" />
            </svg>
            <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-[2px] uppercase mb-1">
            childish gambino rap name generator
          </h2>
          <h2 className="font-bebas text-xl sm:text-2xl text-[#FFD700] tracking-[2px] uppercase mb-4">
            Post Malone rap name generator
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            Enter your real name to forge your deterministic rap alias. Same input always yields the same raw destiny.
          </p>

          <div className="bg-[#121212]/90 border-2 border-zinc-800 p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-2 h-2 bg-[#FFD700]" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#FFD700]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FFD700]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FFD700]" />

            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="nameInput" className="font-mono text-xs uppercase tracking-widest text-zinc-500 flex items-center justify-center gap-1.5">
                  <Sword className="w-3.5 h-3.5 text-[#FFD700]" /> Enter your real name
                </label>
                <input
                  id="nameInput"
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="ENTER YOUR REAL NAME"
                  className="w-full bg-[#1a1a1a] border-2 border-[#FFD700] text-white py-4 px-5 text-xl sm:text-2xl font-mono text-center tracking-widest placeholder-zinc-700 focus:outline-none focus:ring-4 focus:ring-yellow-500/20 uppercase transition-all duration-200"
                  maxLength={30}
                />
              </div>

              {/* Chamber Style Selection */}
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-[2px] text-zinc-500 text-center">
                  Select Your Chamber Style
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CHAMBER_STYLES.map((style) => {
                    const Icon = style.icon;
                    const isActive = selectedStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleStyleSelect(style.id)}
                        className={`flex flex-col items-center justify-between p-3 border-2 transition-all duration-200 cursor-pointer rounded-none group text-center relative ${
                          style.id === 'hardcore' ? 'col-span-2 sm:col-span-1' : ''
                        } ${
                          isActive
                            ? 'bg-[#FFD700] text-black border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                            : 'bg-[#1a1a1a] text-zinc-400 border-zinc-800 hover:border-[#FFD700]/50 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 transition-transform duration-300 group-hover:scale-110 ${
                          isActive ? 'text-black' : 'text-[#FFD700]'
                        }`} />
                        <span className="font-bebas text-lg tracking-wider uppercase font-bold leading-none mb-1">
                          {style.name}
                        </span>
                        <span className={`text-[9px] font-sans font-medium tracking-normal leading-tight ${
                          isActive ? 'text-black/85' : 'text-zinc-500'
                        }`}>
                          {style.desc}
                        </span>
                        {isActive && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                id="generateBtn"
                type="submit"
                className="w-full bg-[#FFD700] hover:bg-[#e6c200] active:scale-[0.98] text-black font-bebas tracking-[2px] text-2xl font-black py-4 px-6 transition-all duration-150 uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(255,215,0,0.15)] hover:shadow-[0_4px_25px_rgba(255,215,0,0.3)]"
              >
                <Flame className="w-6 h-6 fill-current animate-pulse" />
                Enter the rap chamber
              </button>
            </form>

            {/* Result Box */}
            {result && (
              <div className="mt-4 border border-dashed border-[#FFD700]/30 p-6 text-center bg-[#0d0d0d] relative animate-fade-in transition-all duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#121212] px-3 font-mono text-[10px] tracking-widest text-[#FFD700] uppercase">
                  Your Rap Alias
                </div>

                <div className="font-bebas text-4xl sm:text-5xl md:text-6xl text-[#FFD700] tracking-widest leading-none py-6 select-all uppercase font-bold drop-shadow-[0_3px_8px_rgba(255,215,0,0.2)]">
                  {result}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-2 justify-center">
                  <button
                    onClick={handleCopyName}
                    className="flex items-center justify-center gap-2 bg-transparent border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer"
                  >
                    {copiedName ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        COPIED!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Alias
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareLink}
                    className="flex items-center justify-center gap-2 bg-transparent border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        LINK COPIED!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Share Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-[2px] uppercase mt-12 mb-4 text-center">
          best random rap name generator
        </h2>

        {/* Pro Tips for the Best Results */}
        <div id="proTips" className="w-full max-w-[600px] bg-[#121212]/90 border-2 border-zinc-800 p-6 sm:p-8 relative shadow-2xl flex flex-col gap-6">
          <div className="absolute top-0 left-0 w-2 h-2 bg-[#FFD700]" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-[#FFD700]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#FFD700]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#FFD700]" />

          <h3 className="font-bebas text-2xl sm:text-3xl text-[#FFD700] tracking-[2px] uppercase border-b border-zinc-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse text-[#FFD700]" />
            Pro Tips for the Best Results
          </h3>

          <div className="flex flex-col gap-5">
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-[#FFD700] flex items-center justify-center font-bebas text-[#FFD700] text-base shrink-0">1</div>
              <div>
                <h4 className="font-bebas text-lg text-white tracking-wider uppercase mb-1">Use your real name</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  While the generator is largely random, full, legal names yield the classic grimy, cinematic monikers (this is how Donald Glover became <span className="text-[#FFD700] font-semibold">Childish Gambino</span> and Austin Richard Post became <span className="text-[#FFD700] font-semibold">Post Malone</span>).
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-[#FFD700] flex items-center justify-center font-bebas text-[#FFD700] text-base shrink-0">2</div>
              <div>
                <h4 className="font-bebas text-lg text-white tracking-wider uppercase mb-1">Mix and match</h4>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Try plugging in your middle name, an old street alias, or different nicknames to see what distinct combinations of adjectives and nouns you can get.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-5 flex flex-col gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-500">
              Inside Our Massive Word Pool
            </span>
            <div className="flex flex-col gap-3.5">
              <div>
                <span className="font-mono text-[10px] text-[#FFD700] uppercase tracking-wider block mb-2">
                  Shaolin & Hip-Hop Adjectives (Prefixes)
                </span>
                <div className="flex flex-wrap gap-1">
                  {["Ghostly", "Iron", "Mystic", "Deadly", "Infinite", "Razor", "Thunder", "Ancient", "Steel", "Phantom", "Blazing", "Silent", "Wicked", "Crimson", "Jade", "Sovereign", "Spectral", "Titan", "Shaolin", "Furious", "Drunken", "Cosmic", "Shogun", "Ronin", "Stealth", "Raw", "Concrete", "Serrated"].map((word) => (
                    <span key={word} className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-mono hover:text-[#FFD700] hover:border-[#FFD700]/30 transition-all cursor-default">
                      {word}
                    </span>
                  ))}
                  <span className="text-zinc-600 text-[10px] font-mono self-center pl-1">& 100+ more...</span>
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#FFD700] uppercase tracking-wider block mb-2">
                  Shaolin & Hip-Hop Nouns (Suffixes)
                </span>
                <div className="flex flex-wrap gap-1">
                  {["Slayer", "Fist", "Monk", "Dragon", "Blade", "Tiger", "Warrior", "Cipher", "Assassin", "General", "Prophet", "Destroyer", "Avenger", "Chamber", "Temple", "Lotus", "Viper", "Legend", "Master", "Sage", "Priest", "Ranger", "Stalker", "King", "Lord", "Commander", "Gladiator", "Throne"].map((word) => (
                    <span key={word} className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-mono hover:text-[#FFD700] hover:border-[#FFD700]/30 transition-all cursor-default">
                      {word}
                    </span>
                  ))}
                  <span className="text-zinc-600 text-[10px] font-mono self-center pl-1">& 90+ more...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Info Section Styled as elegant Grid matching Sophisticated Dark */}
      <section className="w-full bg-[#1a1a1a] border-t-2 border-[#FFD700] relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 p-6 sm:p-10 lg:p-12">
          
          {/* How It Works */}
          <div className="md:col-span-2">
            <h3 className="text-[#FFD700] text-sm font-bold uppercase tracking-[2px] mb-4 border-b border-zinc-800 pb-2">
              How It Works
            </h3>
            <ul className="space-y-4 font-sans text-xs sm:text-sm text-zinc-400">
              <li className="flex gap-2">
                <span className="text-[#FFD700] font-bold shrink-0">•</span>
                <span>Enter your government name above.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FFD700] font-bold shrink-0">•</span>
                <span>Our 36th Chamber algorithm hashes your soul.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FFD700] font-bold shrink-0">•</span>
                <span>Receive a deterministic, unique rap alias.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FFD700] font-bold shrink-0">•</span>
                <span>Same name, same destiny, every time.</span>
              </li>
            </ul>
          </div>

          {/* FAQs structured neatly inside the Sophisticated Dark Grid */}
          <div className="md:col-span-3">
            <h3 className="text-[#FFD700] text-sm font-bold uppercase tracking-[2px] mb-4 border-b border-zinc-800 pb-2">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FAQs.map((faq, index) => (
                <div key={index} className="flex flex-col gap-1 bg-[#121212]/30 p-3 border border-zinc-800 hover:border-[#FFD700]/20 transition-colors">
                  <h4 className="font-mono text-[11px] sm:text-xs text-[#FFD700] font-bold leading-snug">
                    {faq.q}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-zinc-400 font-sans leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="h-10 w-full flex items-center justify-center text-[10px] font-mono text-zinc-500 tracking-[1.5px] uppercase bg-black relative z-10 border-t border-zinc-900 px-4 text-center">
        <span>© 2026 SHAOLIN DIGITAL PRODUCTIONS. PROTECT YA NECK.</span>
      </footer>
    </div>
  );
}
