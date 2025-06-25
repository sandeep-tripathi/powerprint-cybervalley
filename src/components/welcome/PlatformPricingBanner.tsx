
const PlatformPricingBanner = () => {
  return (
    <section className="py-8 px-6 bg-slate-800/30">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-purple-300 mb-3">Platform Access</h3>
          <p className="text-slate-300 text-lg mb-4">
            <strong className="text-3xl text-white">€50</strong> one-time payment for lifelong platform access
          </p>
          <p className="text-slate-400">
            Complete AI-powered 3D generation platform with REST API access, 
            advanced processing capabilities, and professional 3D model export options.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformPricingBanner;
