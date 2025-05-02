import { HttpContext } from "@adonisjs/core/http";
"--ignore-ts-errors"
import { compareEmbeddings } from "../utils/vector_embedding_test.js";
import { AhoCorasick } from "@monyone/aho-corasick"
import fs from "fs"

const ahoCorasick = new AhoCorasick([
  // Use Case Keywords
  "marketers", "growth hackers", "founders", "solo founders", "solo founder", "indie hackers", "product managers",
  "business developers", "SaaS founders", "solopreneurs", "startup founders", "early-stage startups",
  "bootstrappers", "sales reps", "lead generation specialists", "sales development reps", "SDRs",
  "customer discovery", "market researchers", "bizdev", "brand strategists", "go-to-market teams",
  "cold emailers", "cold outreach", "b2b marketing", "b2c growth", "demand gen", "growth marketing",
  "content marketers", "paid ads specialists", "user researchers", "community managers", "organic growth",
  "ideal customer",

  // Intent Keywords
  "how to get users", "how to find customers", "how to find leads", "best lead gen tools",
  "b2b lead generation", "where to find early adopters", "reddit for lead generation", "scraping reddit",
  "how to get traction", "growth channels", "marketing hacks", "how to validate an idea",
  "where do I find my audience", "finding my niche", "user acquisition strategy", "how to get first 100 users",
  "customer feedback loop", "audience research", "customer discovery questions", "reddit marketing",
  "extracting data from reddit", "reddit scraping tools", "reddit data mining", "data scraping tools",
  "real-time alerts reddit", "monitoring reddit keywords", "sentiment analysis reddit", "listening to customers",
  "user research tools", "social listening tools", "competitor research reddit", "identifying trends on reddit",
  "reddit intelligence", "reddit user tracking", "product-market fit reddit",

  // Tech & Tool Keywords
  "reddit api", "scraping tools", "python reddit scraper", "puppeteer reddit", 
  "langchain reddit", "GPT for scoring", "semantic search reddit", "embeddings reddit", "vector search",
  "keyword tracking reddit", "natural language processing", "GPT lead scoring", "LLM lead generation",
  "openai reddit", "AI-powered lead gen", "real-time lead alerts", "automation reddit", "auto-scraper reddit",
  "lead scoring algorithm", "vector similarity reddit", "semantic similarity", "monitoring reddit at scale",
  "building reddit scrapers", "reddit for SaaS growth", "lead gen", "reddit lead gen", "SaaS",
  "reddit lead",
  "lead generation",
  "lead gen",
  "reddit scraper",
  "lead scraper",
  "reddit lead scraper",
  "reddit leads",
  "scraping tool",
  "reddit data",
  "social listening",
  "reddit monitoring",
  "lead discovery",
  "organic leads",
  "reddit automation",
  "sales leads",
  "lead mining",
  "social prospecting",
  "reddit api",
  "reddit data mining",
  "conversation monitoring",
  "ai lead generation",
  "customer acquisition",
  "saas leads",
  "lead finder",
  "real-time leads",
  "reddit prospecting",
  "social scraping",
  "lead gathering",
  "reddit intelligence",
  "sentiment analysis",
  "keyword monitoring",
  "reddit tracking",
  "sales prospecting",
  "passive lead gen",
  "automated leads",
  "intent monitoring",
  "customer discovery",
  "reddit research",
  "targeted leads",
  "lead sourcing",
  "social media intelligence",
  "market research tool",
  "b2b leads",
  "reddit conversations",
  "subreddit monitoring",
  "growth hacking",
  "customer insights",
  "pain point detection",
  "lead pipeline",
  "reddit analytics",
  "audience insights",
  "digital prospecting",
  "conversation mining",
  "reddit marketing",
  "buying signals",
  "semantic analysis",
  "thread monitoring",
  "discussion tracking",
  "automated prospecting",
  "interest targeting",
  "target keywords",
  "warm leads",
  "hot leads",
  "more leads"
]);


export default class UserController {

  async intake({request, response}: HttpContext){

    const body = request.body()

    const posts = body.posts;

    const now = Date.now()

    const processedScores = (await Promise.all(
      posts.map(async (post: any) => {

        const postBody = post.body.toLowerCase()
        const postTitle = post.title.toLowerCase()

        const content = postBody + "\n" + postTitle;

        // Result loosk like ["reddit lead gen", "lead gen", "asd", "123"]
        const matchedKeyWords = ahoCorasick.matchInText(content).map((match) => match.keyword)

        if(matchedKeyWords.length === 0) return;

        const embeddingsComparison = await compareEmbeddings(content)

        const result = {
          id: post.id,
          score: embeddingsComparison,
          url: post.url,
          keywords: matchedKeyWords,
          body: postBody
        }

        fs.writeFileSync("results.txt", JSON.stringify(result, null, 2))
        
        return result
      })
    )).filter(Boolean)

    console.log("success, time it took: ", (Date.now() - now) / 1000, " seconds", processedScores);


    return response.status(200).send({body: "success", processedScores})
  }
}