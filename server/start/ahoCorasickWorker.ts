import DynamicAhoCorasick from "#services/AhoCorasick"

async function startWorker() {
    await DynamicAhoCorasick.create()
  }
  
  export default startWorker