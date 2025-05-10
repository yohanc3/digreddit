import { Card, CardContent } from "../ui/card"
import { Button } from "@/lib/components/ui/button"
import { Check } from "lucide-react"

export default function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Simple, Transparent Pricing</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Choose the plan that works best for your business needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 border-gray-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Free Trial</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$0</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>50 leads total</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Basic keyword matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Email delivery</span>
                </li>
              </ul>
              <Button className="w-full">Start Free Trial</Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#576F72] relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#576F72] text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>200 leads/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Advanced keyword matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Email + dashboard access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Basic analytics</span>
                </li>
              </ul>
              <Button className="w-full bg-[#576F72] hover:bg-[#475a5c]">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Unlimited leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>AI-powered semantic matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Webhook integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Advanced analytics & reporting</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
