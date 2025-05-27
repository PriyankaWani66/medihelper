export function extractFollowUps(summaryText) {
  const followUps = [];
  const patterns = [
    // Common follow-up phrasing
    /\bfollow[-\s]?up\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\bcome back\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\breturn\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\brevisit\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\bcheck[-\s]?up\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,

    // Loosely phrased "see/check" statements
    /\b(?:we|you).{0,20}?(?:check|follow[-\s]?up|see|visit).{0,20}?(?:in|after)\s\d+\s(?:days?|weeks?|months?)/gi,
    /\b(come\sback|return|revisit|check[\s-]?up|follow[\s-]?up|see\s(us|me|a\sdoctor))\s(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\b(in|after)?\s?\d+\s?(days?|weeks?|months?)\s(to|for)\s(check[\s-]?up|follow[\s-]?up|appointment|monitoring|progress|visit)/gi,


 
    // Hindi follow-up patterns
    /\d+\s?(दिन|दिवस|हफ्ते|सप्ताह|महीने)\s?(के बाद)?\s?(जाँच|फॉलो[-\s]?अप|मुलाकात)/gi,
    /(कृपया|आपको|आप)\s\d+\s?(दिन|हफ्ते|महीने)\s?(बाद)?\s?(जांच|मुलाकात|आना|फॉलो[-\s]?अप)/gi,
    /(\d+\s?(दिन|हफ्ते|महीने)).{0,15}(फिर\s?से\s?आएं|जांच)/gi,
    /\b(रोगी|आपको|कृपया).{0,20}(\d+)\s?(दिन|दिवस|हफ्ते|सप्ताह|महीने)\s?(बाद)?\s?(फिर\s?से\s?)?(देखने|मुलाकात|जांच|आने|आना)[^।\n]{0,20}/gi,
    /\b(रोगी|आपको|कृपया).{0,25}?(\d+)\s?(दिन|हफ्ते|सप्ताह|महीने)\s?(के\sलिए)?\s?(फॉलो[-\s]?अप|जांच|मुलाकात).{0,30}?(वापस\s?आने|मुलाकात|जांच|देखने)\s?की\s?(सलाह|अनुरोध)/gi

  ];

  patterns.forEach((pattern) => {
    const matches = summaryText.match(pattern);
    if (matches) followUps.push(...matches);
  });

  return followUps;
}
