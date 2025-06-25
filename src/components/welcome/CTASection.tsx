
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-slate-300 mb-8">
          Join thousands of creators using PowerPrint to bring their ideas to life
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/"
            className="inline-flex bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl items-center space-x-2"
          >
            <span>Start Creating Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <div className="text-slate-400 text-sm">
            Free API access • 50 credits per month • No credit card required
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
