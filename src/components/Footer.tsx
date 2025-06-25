
import { MapPin, Mail, Phone, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">PowerPrint</h3>
            <p className="text-slate-300 mb-4">
              Transform your ideas into reality with AI-powered 3D model generation. 
              Professional quality models from images in minutes.
            </p>
            <div className="flex items-start space-x-2 text-slate-300">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <div>
                <p>Olgastraße</p>
                <p>Stuttgart, Germany</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#generate" className="text-slate-300 hover:text-purple-400 transition-colors">
                  Generate Models
                </a>
              </li>
              <li>
                <a href="#marketplace" className="text-slate-300 hover:text-purple-400 transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-slate-300 hover:text-purple-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#history" className="text-slate-300 hover:text-purple-400 transition-colors">
                  History
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4" />
                <span>info@powerprint.ai</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4" />
                <span>+49 711 123456</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Globe className="w-4 h-4" />
                <span>www.powerprint.ai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2025 PowerPrint. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#support" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
