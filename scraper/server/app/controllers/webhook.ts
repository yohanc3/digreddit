import { HttpContext } from "@adonisjs/core/http";
"--ignore-ts-errors"
import { compareEmbeddings } from "../utils/vector_embedding_test.js";

export default class UserController {

  async intake({request, response}: HttpContext){

    const body = request.body()

    const posts = body.posts;

    const processedScores = await Promise.all(
      posts.map(async (post: any) => {
        const embeddingsComparison = await compareEmbeddings(post.body)
        return {
          id: post.id,
          score: embeddingsComparison
        }
      })
    )

    console.log("success")

    return response.status(200).send({body: "success", processedScores})
  }
}