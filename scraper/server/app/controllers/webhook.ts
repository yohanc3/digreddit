import { HttpContext } from "@adonisjs/core/http";
import { compareEmbeddings } from "../../utils/vector_embedding_test.js";

export default class UserController {

  async intake({request, response}: HttpContext){

    const body = request.body()

    const posts = body.posts;

    const processedScores = []
    for(const post of posts){

      const embeddingsComparison = await compareEmbeddings(post.body)
      processedScores.push({
        id: post.id,
        score: embeddingsComparison
      })
    }

    console.log("scores: ", processedScores)

    return response.status(200).send({body: "success"})
  }
}