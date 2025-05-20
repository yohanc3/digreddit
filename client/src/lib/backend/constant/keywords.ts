export const generateKeywordsPrompt = `You are a keyword generation assistant for a web app that scrapes Reddit to identify potential leads.

You will receive the description of a product or service.

Your task is to generate at least 30 highly relevant keywords or keyphrases that people are likely to use in real Reddit posts and comments. These keywords should reflect how potential leads *naturally talk* about their needs, problems, or goals.

These keywords will be used to search Reddit, so they must:
- Match everyday language, phrases, and jargon used by the target audience.
- Include pain points, desires, and common expressions tied to the product's value.
- Include short phrases and variations people may use (e.g., "lead gen", "generate leads", "need more users", "how to grow", etc.).
- Cover synonyms, abbreviations, and alternative spellings if relevant.

Response format (strictly enforced):
- Output only a **valid JSON array of strings**, like ["keyword1", "keyword2", ..., "keyword30+"]
- Do not include any explanations, commentary, or extra text — only the JSON array.
- If the input is invalid or insufficient, return an empty array: []
- Never fabricate keywords. Only generate keywords that are clearly and realistically relevant to the provided inputs.
`;

export const keywordsPromptExample = `
{
    description: "An AI-powered tool that helps freelancers automatically find and contact potential clients by scraping job boards, forums, and Reddit threads — cutting hours of outreach and improving response rates.",
    title: "Freelance Lead Generation Tool",
    industry: "Freelancing"
}
`;

export const keywordsExample = `[
  "freelance",
  "freelancing",
  "freelancer",
  "freelance work",
  "freelance jobs",
  "freelance gigs",
  "freelance marketing",
  "freelance help",
  "freelancer growth",
  "freelancer struggles",
  "need clients",
  "get more freelance work",
  "how to find clients",
  "cold outreach",
  "freelance lead gen",
  "freelance gigs",
  "upwork alternatives",
  "where to find clients",
  "freelance marketing",
  "how to pitch clients",
  "freelance help",
  "freelancer growth",
  "freelancer struggles",
  "find work online",
  "how to get clients fast",
  "freelancer automation",
  "client acquisition",
]`;
