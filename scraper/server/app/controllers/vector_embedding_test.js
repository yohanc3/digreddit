import { similarity } from 'ml-distance'
import { pipeline } from '@xenova/transformers'

const ProductDescription =
    'NovaTech DevMaster Pro 16: Powerhouse laptop with Intel i9-14900HX (24-core), 64GB DDR5 RAM, 2TB NVMe SSD, and RTX 4070 GPU. Features a 16" display (2560x1600, 240Hz), 99Wh battery (10hr runtime), and extensive connectivity including Thunderbolt 4, USB-C/A, HDMI 2.1, and SD card reader. The mechanical RGB keyboard is coding-optimized, with Linux or Windows 11 Pro options. Remarkably portable at just 4.2lbs despite its professional specifications.he NovaTech DevMaster Pro 16 comes equipped with an Intel Core i9-14900HX (24-core, 32-thread, up to 5.8GHz), 64GB of DDR5 RAM at 5200MHz, and a blazing-fast 2TB NVMe Gen4 SSD. It features an NVIDIA RTX 4070 Laptop GPU with 8GB GDDR6 memory, a 16-inch 2560x1600 IPS display boasting a 240Hz refresh rate and 100% sRGB color accuracy, and a massive 99Wh battery providing up to 10 hours of mixed use. For connectivity, it offers 2 Thunderbolt 4 ports, 2 USB-C 3.2 ports, 2 USB-A ports, an HDMI 2.1 output, an SD card reader, and a 3.5mm headphone jack. The mechanical low-profile RGB backlit keyboard is optimized for extended coding sessions, and users can choose between Linux (Ubuntu 24.04 LTS) or Windows 11 Pro. Despite its power, the laptop remains portable at just 4.2 pounds (1.9 kilograms).'

const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')


async function getEmbedding(text) {
    const output = await embedder(text, { pooling: 'mean', normalize: true })
    return output.data // returns a Float32Array
}

const productEmbedded = await getEmbedding(ProductDescription);

export async function compareEmbeddings(text) {
    const textEmbedding = await getEmbedding(text)

    // Similarity is from 0-1. Example: 0.6657523532242. So we multiply by 10 to get it in the range 0-10, and we fix it to 1 decimal only.
    const similarityResult =
        Number(Number((similarity.cosine(productEmbedded, textEmbedding) * 10).toFixed(1))) * 10

    // After thorough testing, I found that comparisons between embeddings don't really get beyond 6. If they do,
    // it's an extremely good lead. I ran some tests with deepseek. I had 4 dummy tests and 1 dummy product description. The first dummy post was 100% similar
    // to a dummy product description, second was ~75% similar, 3rd 50%, and 4th 0-10%. Deepseek accurately rated them in the following order : 10, 8, 5, 0.
    // Keep in mind I ran the same query multiple times. Xenova/all-MiniLM-L6-v2 however, rated them in the following order: 5.7, 3.3, 2.5, 0. So pretty similar
    // when making 6 the greatest achievable score.
    //  - Yohance
    const similarityResultOutOf6 = similarityResult / 6

    return similarityResultOutOf6
}