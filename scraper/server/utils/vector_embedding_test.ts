import { similarity } from 'ml-distance'
import { pipeline } from '@xenova/transformers'

// const aiPrompt = `
// Rate user comments/posts (0-10) based on their relevance to a product description. 10=perfect match, 0=no match. You'll receive: 1) A product description 2) A JSON of comments/posts with IDs as keys. Output a JSON with comment IDs as keys and numerical ratings as values. Example: {"t3_625":10.0,"t3_626":8.5}
// `

// const apiKey = 'sk-c0bcca6db8f74d108541b6e29640ba2c'

const ProductDescription =
    'NovaTech DevMaster Pro 16: Powerhouse laptop with Intel i9-14900HX (24-core), 64GB DDR5 RAM, 2TB NVMe SSD, and RTX 4070 GPU. Features a 16" display (2560x1600, 240Hz), 99Wh battery (10hr runtime), and extensive connectivity including Thunderbolt 4, USB-C/A, HDMI 2.1, and SD card reader. The mechanical RGB keyboard is coding-optimized, with Linux or Windows 11 Pro options. Remarkably portable at just 4.2lbs despite its professional specifications.he NovaTech DevMaster Pro 16 comes equipped with an Intel Core i9-14900HX (24-core, 32-thread, up to 5.8GHz), 64GB of DDR5 RAM at 5200MHz, and a blazing-fast 2TB NVMe Gen4 SSD. It features an NVIDIA RTX 4070 Laptop GPU with 8GB GDDR6 memory, a 16-inch 2560x1600 IPS display boasting a 240Hz refresh rate and 100% sRGB color accuracy, and a massive 99Wh battery providing up to 10 hours of mixed use. For connectivity, it offers 2 Thunderbolt 4 ports, 2 USB-C 3.2 ports, 2 USB-A ports, an HDMI 2.1 output, an SD card reader, and a 3.5mm headphone jack. The mechanical low-profile RGB backlit keyboard is optimized for extended coding sessions, and users can choose between Linux (Ubuntu 24.04 LTS) or Windows 11 Pro. Despite its power, the laptop remains portable at just 4.2 pounds (1.9 kilograms).'

// const t3_624 =
//     'As a senior backend developer working on microservices and large distributed systems, this laptop is literally everything I need. 64GB RAM and an i9 means I can run local Kubernetes clusters, multiple Docker containers, and still have VS Code, Slack, and Chrome open without a hitch. The Linux option out of the box is chef’s kiss. Definitely buying this. I need a laptop with all advanced ports in modern computers, a powerful GPU, fast SSD storage unit, CPU with plenty of cores, and a big screen (14 to 16 inches)'

// const t3_625 =
//     'As a senior backend developer working on microservices and large distributed systems, this laptop is literally everything I need. 64GB RAM and an i9 means I can run local Kubernetes clusters, multiple Docker containers, and still have VS Code, Slack, and Chrome open without a hitch. The Linux option out of the box is chef’s kiss. Definitely buying this.'

// const t3_626 =
//     'I’m mostly doing web development (React + Node.js) and some light ML side projects. 64GB RAM is probably overkill for me, but the high-refresh screen and battery life are really appealing. Might be too powerful for just front-end work, but it’ll future-proof me for a while!'

// const t3_627 =
//     "I'm an IT manager who mostly deals with spreadsheets, remote server monitoring, and occasional scripting. I love the power here, but honestly, it’s more laptop than I need. I'd pay for something lighter and cheaper with longer battery life instead of raw specs."

// const t3_628 =
//     "I'm a college freshman studying journalism, and I just need something to take notes, write essays, and browse the web. No way I'd spend this much or carry around a heavy laptop when a basic Chromebook does everything I need."

// const matches = [t3_624, t3_625, t3_626, t3_627, t3_628]

// import OpenAI from 'openai'

// const openai = new OpenAI({
//     baseURL: 'https://api.deepseek.com',
//     apiKey: apiKey,
// })

// async function main() {
//     const completion = await openai.chat.completions.create({
//         messages: [
//             { role: 'system', content: aiPrompt },
//             {
//                 role: 'user',
//                 content: `Product description: ${productDescription}. Texts to rate: ${JSON.stringify(matches, 2, null)}`,
//             },
//         ],
//         model: 'deepseek-chat',
//         response_format: {
//             type: 'json_object',
//         },
//     })

//     console.log(completion.choices[0].message.content)
// }

// main()

const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

async function getEmbedding(text: string) {
    const output = await embedder(text, { pooling: 'mean', normalize: true })
    return output.data // returns a Float32Array
}

export async function compareEmbeddings(text: string){
    const productEmbedding = await getEmbedding(ProductDescription)
    const textEmbedding = await getEmbedding(text)

    // Similarity is from 0-1. Example: 0.6657523532242. So we multiply by 10 to get it in the range 0-10, and we fix it to 1 decimal only.
    const similarityResult: number = Number(Number((similarity.cosine(productEmbedding, textEmbedding) * 10).toFixed(1))) * 10

    // After thorough testing, I found that comparisons between embeddings don't really get beyond 6. If they do,
    // it's an extremely good lead. I ran some tests with deepseek. I had 4 dummy tests and 1 dummy product description. The first dummy post was 100% similar
    // to a dummy product description, second was ~75% similar, 3rd 50%, and 4th 0-10%. Deepseek accurately rated them in the following order : 10, 8, 5, 0.
    // Keep in mind I ran the same query multiple times. Xenova/all-MiniLM-L6-v2 however, rated them in the following order: 5.7, 3.3, 2.5, 0. So pretty similar
    // when making 6 the greatest achievable score.
    //  - Yohance
    const similarityResultOutOf6: number = similarityResult / 6

    return similarityResultOutOf6;
}