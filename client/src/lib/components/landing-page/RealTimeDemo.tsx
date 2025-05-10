export default function RealTimeDemo() {
    return (
      <section id="demo" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Real-Time Demo</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            See how DigReddit transforms Reddit conversations into qualified leads for your business
          </p>
  
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="flex border-b">
              <button className="py-4 px-6 font-medium text-[#576F72] border-b-2 border-[#576F72]">
                Before (Reddit Post)
              </button>
              <button className="py-4 px-6 font-medium text-gray-500">After (DigReddit Match)</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium">u/startup_founder</p>
                    <p className="text-sm text-gray-500">Posted 2 hours ago in r/SaaS</p>
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Looking for a tool to monitor social media for leads - any recommendations?
                </h3>
                <p className="text-gray-700">
                  Hey everyone, I'm running a small marketing agency and we're trying to find new clients. I've heard
                  people mention finding leads on Reddit and Twitter, but manually searching is too time-consuming. Are
                  there any good tools that can automatically scan these platforms and alert me when someone's looking for
                  services like ours?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  