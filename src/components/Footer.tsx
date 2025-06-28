
import { MapPin, Mail, Phone, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-center">
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-center">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center justify-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4" />
                <span>Olgastraße, Stuttgart, Germany</span>
              </li>
              <li className="flex items-center justify-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4" />
                <span>info@powerprint.ai</span>
              </li>
              <li className="flex items-center justify-center space-x-2 text-slate-300">
                <Phone className="w-4 h-4" />
                <span>+49 711 123456</span>
              </li>
              <li className="flex items-center justify-center space-x-2 text-slate-300">
                <Globe className="w-4 h-4" />
                <span>www.powerprint.ai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-6 pt-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 PowerPrint. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
