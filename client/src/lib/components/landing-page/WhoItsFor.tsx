import { Card, CardContent } from "@/lib/components/ui/card"

export default function WhoItsFor() {
  const audiences = [
    {
      title: "B2B SaaS startups",
      description: "Find prospects asking about tools like yours",
    },
    {
      title: "Solo founders",
      description: "Discover potential customers without a sales team",
    },
    {
      title: "Agencies",
      description: "Identify businesses needing your services",
    },
    {
      title: "Recruiters",
      description: "Spot talent discussing career moves",
    },
    {
      title: "Consultants",
      description: "Connect with people seeking your expertise",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Who It's For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {audiences.map((item, index) => (
            <Card key={index} className="h-full">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
