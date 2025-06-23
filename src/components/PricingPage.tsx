
import { Check, Zap, Crown, Sparkles } from "lucide-react";

const PricingPage = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with AI 3D generation",
      credits: "200 credits/month",
      features: [
        "Text to 3D",
        "Image to 3D", 
        "Basic 3D models",
        "Standard processing speed",
        "Community support",
        "Watermarked exports"
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-slate-600 hover:bg-slate-700",
      icon: Sparkles,
      popular: false
    },
    {
      name: "Pro",
      price: "$20",
      period: "per month",
      description: "For creators and professionals who need more power",
      credits: "1,000 credits/month",
      features: [
        "Everything in Free",
        "Advanced 3D models",
        "High-resolution outputs",
        "Priority processing",
        "Email support",
        "No watermarks",
        "Commercial license",
        "API access"
      ],
      buttonText: "Start Pro Trial",
      buttonStyle: "bg-purple-600 hover:bg-purple-700",
      icon: Zap,
      popular: true
    },
    {
      name: "Max",
      price: "$60",
      period: "per month", 
      description: "Maximum power for teams and heavy users",
      credits: "3,000 credits/month",
      features: [
        "Everything in Pro",
        "Premium 3D models",
        "Fastest processing",
        "Priority support",
        "Advanced API features",
        "Custom integrations",
        "Team collaboration",
        "Volume discounts"
      ],
      buttonText: "Contact Sales",
      buttonStyle: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
      icon: Crown,
      popular: false
    }
  ];

  const additionalCredits = [
    { amount: "500", price: "$5" },
    { amount: "1,000", price: "$9" },
    { amount: "2,500", price: "$20" },
    { amount: "5,000", price: "$35" }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Transform your creative vision into stunning 3D models with our AI-powered platform
        </p>
      </div>

      {/* Main Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const IconComponent = plan.icon;
          return (
            <div 
              key={index}
              className={`relative bg-slate-800/50 border rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20 scale-105' 
                  : 'border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mb-4">
                  <IconComponent className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 ml-2">/{plan.period}</span>
                </div>
                <p className="text-slate-300 text-sm">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-purple-400 font-semibold">{plan.credits}</div>
                  <div className="text-slate-300 text-sm">Monthly allocation</div>
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-300">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`w-full ${plan.buttonStyle} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105`}>
                {plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Additional Credits Section */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Need More Credits?</h2>
          <p className="text-slate-300">Purchase additional credits anytime to power your projects</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {additionalCredits.map((credit, index) => (
            <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center hover:bg-slate-700/70 transition-colors cursor-pointer">
              <div className="text-xl font-bold text-white">{credit.amount}</div>
              <div className="text-slate-300 text-sm mb-2">credits</div>
              <div className="text-purple-400 font-semibold">{credit.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">What are credits?</h3>
            <p className="text-slate-300 text-sm">Credits are used to generate 3D models. Each generation consumes credits based on complexity and quality settings.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
            <p className="text-slate-300 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Do unused credits roll over?</h3>
            <p className="text-slate-300 text-sm">Monthly credits reset each billing cycle. Additional purchased credits never expire.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
            <p className="text-slate-300 text-sm">Yes! The Free plan gives you 200 credits monthly to explore our platform with no time limit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
