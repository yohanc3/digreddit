/**
 * Utility functions for parsing and converting lead evaluation criteria
 * between XML and JSON formats for database storage and UI display.
 */

interface CriteriaRange {
    label: string;
    points: string;
    description: string;
}

interface CriteriaField {
    id: string;
    maxScore: number;
    description: string;
    ranges: CriteriaRange[];
}

/**
 * Calculates scoring ranges based on the maximum score for a criterion.
 * Creates appropriate point ranges and labels for different scoring tiers.
 *
 * @param maxScore - The maximum points possible for this criterion
 * @returns Array of CriteriaRange objects with appropriate point distributions
 */
export function calculateRanges(maxScore: number): CriteriaRange[] {
    if (maxScore <= 0) return [];

    const ranges: CriteriaRange[] = [];

    if (maxScore <= 2) {
        // For max 1-2, just individual points
        for (let i = maxScore; i >= 0; i--) {
            ranges.push({
                label: `${i} ${i === 1 ? 'point' : 'points'}`,
                points: i.toString(),
                description: '',
            });
        }
    } else if (maxScore === 3) {
        // For max 3: 3, 2, 1, 0
        ranges.push(
            { label: '3 points', points: '3', description: '' },
            { label: '2 points', points: '2', description: '' },
            { label: '1 point', points: '1', description: '' },
            { label: '0 points', points: '0', description: '' }
        );
    } else {
        // For max 4+: use ranges
        // Highest tier: max points
        ranges.push({
            label: `${maxScore} points`,
            points: maxScore.toString(),
            description: '',
        });

        // Middle tier(s): create ranges
        let remaining = maxScore - 1;
        while (remaining > 1) {
            const rangeStart = Math.max(2, remaining - 1);
            const rangeEnd = remaining;

            if (rangeStart === rangeEnd) {
                ranges.push({
                    label: `${rangeStart} ${rangeStart === 1 ? 'point' : 'points'}`,
                    points: rangeStart.toString(),
                    description: '',
                });
            } else {
                ranges.push({
                    label: `${rangeStart}-${rangeEnd} points`,
                    points: `${rangeStart}-${rangeEnd}`,
                    description: '',
                });
            }

            remaining = rangeStart - 1;
        }

        // Second-to-lowest tier: 1 point (if not already included)
        if (remaining === 1) {
            ranges.push({
                label: '1 point',
                points: '1',
                description: '',
            });
        }

        // Lowest tier: 0 points
        ranges.push({
            label: '0 points',
            points: '0',
            description: '',
        });
    }

    return ranges;
}

/**
 * Escapes special XML characters to prevent parsing errors.
 * Converts characters like &, <, >, ", ' to their XML entity equivalents.
 *
 * @param str - The string to escape
 * @returns XML-safe string with escaped characters
 */
function escapeXML(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Parses XML criteria string from database into CriteriaField objects for UI display.
 * Handles both XML format (new) and JSON format (legacy) for backward compatibility.
 *
 * @param criteriaString - XML or JSON string containing criteria data
 * @returns Array of CriteriaField objects for UI rendering
 */
export function parseCriteriaFromProduct(
    criteriaString: string | null | undefined
): CriteriaField[] {
    if (!criteriaString || criteriaString.trim() === '') return [];

    try {
        // Check if it's XML format (starts with <)
        if (criteriaString.trim().startsWith('<')) {
            return parseXMLCriteria(criteriaString);
        } else {
            // Legacy JSON format - parse as before for backward compatibility
            return parseJSONCriteria(criteriaString);
        }
    } catch (error) {
        console.error('Error parsing criteria:', error);
        return [];
    }
}

/**
 * Parses XML criteria format into CriteriaField objects.
 * Extracts criterion elements and their scoring ranges from XML structure.
 *
 * @param xmlString - XML string containing lead evaluation criteria
 * @returns Array of CriteriaField objects
 */
function parseXMLCriteria(xmlString: string): CriteriaField[] {
    // Create a DOM parser to handle XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
        throw new Error('Invalid XML format');
    }

    const criteriaFields: CriteriaField[] = [];
    const criterionElements = xmlDoc.querySelectorAll('criterion');

    criterionElements.forEach((criterion, index) => {
        const id = criterion.getAttribute('id') || `criterion-${index + 1}`;
        const name = criterion.getAttribute('name') || `Criteria ${index + 1}`;
        const maxPoints = parseInt(
            criterion.getAttribute('max_points') || '0',
            10
        );

        // Extract scoring ranges
        const ranges: CriteriaRange[] = [];
        const scoringRanges = criterion.querySelectorAll('scoring_range');

        scoringRanges.forEach((range) => {
            const points = range.getAttribute('points') || '0';
            const description = range.getAttribute('description') || '';

            ranges.push({
                label: `${points} ${points === '1' ? 'point' : 'points'}`,
                points: points,
                description: description,
            });
        });

        criteriaFields.push({
            id: `xml-${id}-${Date.now()}`,
            maxScore: maxPoints,
            description: name,
            ranges: ranges.length > 0 ? ranges : calculateRanges(maxPoints),
        });
    });

    return criteriaFields;
}

/**
 * Parses legacy JSON criteria format for backward compatibility.
 * Converts old JSON structure to CriteriaField objects.
 *
 * @param jsonString - JSON string containing criteria data
 * @returns Array of CriteriaField objects
 */
function parseJSONCriteria(jsonString: string): CriteriaField[] {
    const parsed = JSON.parse(jsonString);
    if (!parsed.criteria || !Array.isArray(parsed.criteria)) return [];

    return parsed.criteria.map((criteria: any, index: number) => ({
        id: `json-${index}-${Date.now()}`,
        maxScore: criteria.max || 0,
        description: criteria.name || '',
        ranges:
            criteria.ranges?.map((range: any) => ({
                label: range.pts,
                points: range.pts,
                description: range.desc || '',
            })) || calculateRanges(criteria.max || 0),
    }));
}

/**
 * Converts CriteriaField objects to XML format for database storage.
 * Creates properly formatted XML with escaped content for safe storage.
 *
 * @param criteriaFields - Array of CriteriaField objects from UI
 * @returns XML string ready for database storage
 */
export function generateCriteriaXML(criteriaFields: CriteriaField[]): string {
    if (criteriaFields.length === 0) return '';

    // Calculate total points across all criteria
    const totalPoints = criteriaFields.reduce(
        (total, criteria) => total + criteria.maxScore,
        0
    );

    let xml = `<lead_evaluation_criteria total_points="${totalPoints}">\n`;

    criteriaFields.forEach((criteria, index) => {
        const criteriaName = criteria.description || `Criteria ${index + 1}`;
        xml += `  <criterion id="${index + 1}" name="${escapeXML(criteriaName)}" max_points="${criteria.maxScore}">\n`;

        criteria.ranges.forEach((range) => {
            const description =
                range.description || `${range.label} description needed`;
            xml += `    <scoring_range points="${range.points}" description="${escapeXML(description)}"/>\n`;
        });

        xml += `  </criterion>\n`;
    });

    xml += `</lead_evaluation_criteria>`;
    return xml;
}

/**
 * Converts CriteriaField objects to legacy JSON format.
 * Maintains backward compatibility with existing systems that expect JSON.
 *
 * @param criteriaFields - Array of CriteriaField objects from UI
 * @returns JSON string in legacy format
 */
export function generateCriteriaJSON(criteriaFields: CriteriaField[]): string {
    if (criteriaFields.length === 0) return '';

    const totalPoints = criteriaFields.reduce(
        (total, criteria) => total + criteria.maxScore,
        0
    );

    // Create compact range-based format for API efficiency
    const compactCriteria = criteriaFields.map((criteria, index) => ({
        name: criteria.description || `Criteria ${index + 1}`,
        max: criteria.maxScore,
        ranges: criteria.ranges.map((range) => ({
            pts: range.points,
            desc: range.description || `${range.label} description needed`,
        })),
    }));

    return JSON.stringify({
        criteria: compactCriteria,
        total: totalPoints,
    });
}
