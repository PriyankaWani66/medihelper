export function extractFollowUps(summaryText) {
  const followUps = [];
  const patterns = [
    /\bfollow[-\s]?up\s(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\bcome back\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\breturn\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\bfollow[-\s]?up\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\brevisit\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\bcheck[-\s]?up\s?(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\b(?:we|you).{0,20}?(?:check|follow[-\s]?up|see|visit).{0,20}?(?:in|after)\s\d+\s(?:days?|weeks?|months?)/gi,
    /\b(come\sback|return|revisit|check[\s-]?up|follow[\s-]?up|see\s(us|me|a\sdoctor))\s(in|after)?\s?\d+\s?(days?|weeks?|months?)/gi,
    /\b(in|after)?\s?\d+\s?(days?|weeks?|months?)\s(to|for)\s(check[\s-]?up|follow[\s-]?up|appointment|monitoring|progress|visit)/gi
  ];


  patterns.forEach((pattern) => {
    const matches = summaryText.match(pattern);
    if (matches) followUps.push(...matches);
  });

  return followUps;
}
