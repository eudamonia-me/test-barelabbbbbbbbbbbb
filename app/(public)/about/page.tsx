import Card from '@/components/ui/Card'

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light mb-8">About barelab</h1>

        <div className="prose prose-neutral max-w-none space-y-6">
          <Card>
            <h2 className="text-2xl font-light mb-4">What is barelab?</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              barelab is a transparent, data-driven cosmetics review platform that shows products from the inside out, 
              based on how they actually behave on real people's skin.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              We're not a beauty blog. We're not an influencer platform. We don't publish expert opinions or promote 
              brand marketing. Instead, we collect and analyze real user feedback to generate honest, probability-based 
              insights about how cosmetic products actually perform.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-light mb-4">How it works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Collect Real Feedback</h3>
                <p className="text-neutral-700 leading-relaxed">
                  We gather user comments from social platforms and directly from users on our website. All feedback 
                  is anonymized to protect privacy.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">2. Extract Structured Data</h3>
                <p className="text-neutral-700 leading-relaxed">
                  Comments are analyzed and converted into structured tags that describe skin type suitability, finish, 
                  coverage, oxidation, oil control, longevity, and other real-world performance attributes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">3. Generate Insights</h3>
                <p className="text-neutral-700 leading-relaxed">
                  We calculate probability-based insights using aggregated data. Instead of saying "this is good for 
                  dry skin," we show "67% of users with dry skin report positive experiences."
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">4. Stay Transparent</h3>
                <p className="text-neutral-700 leading-relaxed">
                  You can always see the raw comments and data behind every insight. Nothing is hidden. Nothing is 
                  sponsored. Just data.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-light mb-4">What we don't do</h2>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex gap-2">
                <span className="text-red-500">✕</span>
                <span>We don't accept sponsored content or paid reviews</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✕</span>
                <span>We don't make absolute claims about products</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✕</span>
                <span>We don't prioritize brands that pay us</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✕</span>
                <span>We don't use affiliate links or earn commissions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✕</span>
                <span>We don't publish "expert" opinions</span>
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-2xl font-light mb-4">Important Disclaimer</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              All product insights on barelab are based on aggregated user feedback and may vary depending on 
              individual skin type, routine, and environment. This information is not a substitute for professional 
              dermatological advice.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              What works for most users may not work for you. Always patch test new products and consult a 
              dermatologist if you have specific skin concerns.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-light mb-4">Future Vision</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              In the future, we plan to:
            </p>
            <ul className="space-y-2 text-neutral-700 list-disc list-inside">
              <li>Allow users to submit reviews directly on the website</li>
              <li>Enable skin type selection when submitting feedback</li>
              <li>Automatically update all insights as new data arrives</li>
              <li>Build advanced recommendation algorithms based on your skin profile</li>
              <li>Expand to more cosmetic categories and global markets</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
