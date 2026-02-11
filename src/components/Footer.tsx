
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { 
  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin,
  Heart, Shield, FileText, HelpCircle, BookOpen
} from 'lucide-react';

const Footer = () => {
  const { user } = useAuth();
  const { getSetting, loading } = usePlatformSettings();

  const contactEmail = getSetting('contact_email', '');
  const contactPhone = getSetting('contact_phone', '');
  const contactAddress = getSetting('contact_address', '');
  const companyName = getSetting('company_name', 'Rollno31 Edtech Private Limited');

  const socialFacebook = getSetting('social_facebook', '');
  const socialTwitter = getSetting('social_twitter', '');
  const socialInstagram = getSetting('social_instagram', '');
  const socialLinkedin = getSetting('social_linkedin', '');

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: socialFacebook },
    { name: 'Twitter', icon: Twitter, href: socialTwitter },
    { name: 'Instagram', icon: Instagram, href: socialInstagram },
    { name: 'LinkedIn', icon: Linkedin, href: socialLinkedin },
  ].filter(s => s.href && s.href.length > 0);

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Scholarships', path: '/scholarships' },
    { name: 'Career Insights', path: '/blog' },
    { name: 'Advanced Search', path: '/search' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const userLinks = user ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Profile', path: '/profile' },
    { name: 'Bookmarks', path: '/bookmarks' },
    { name: 'Submit Opportunity', path: '/submit' },
  ] : [
    { name: 'Sign In', path: '/auth' },
    { name: 'Create Account', path: '/auth' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help-center' },
    { name: 'Contact Support', path: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">OH</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-400">OpportunityHub</h3>
            </Link>
            <p className="text-gray-300 mb-2 text-sm">
              A product of <strong>{companyName}</strong>
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              Connecting students and professionals with the best internships, job opportunities, 
              contests, and scholarships worldwide.
            </p>
            
            {/* Contact Info - Only show if configured */}
            <div className="space-y-3 mb-6">
              {contactEmail && (
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                  <a href={`mailto:${contactEmail}`} className="hover:text-blue-400 transition-colors text-sm">
                    {contactEmail}
                  </a>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <a href={`tel:${contactPhone}`} className="hover:text-blue-400 transition-colors text-sm">
                    {contactPhone}
                  </a>
                </div>
              )}
              {contactAddress && (
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm">{contactAddress}</span>
                </div>
              )}
            </div>

            {/* Social Links - Only show if configured */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-800"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User/Account Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {user ? 'Your Account' : 'Get Started'}
            </h4>
            <ul className="space-y-2">
              {userLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              Support
            </h4>
            <ul className="space-y-2 mb-6">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h5 className="text-md font-medium mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Legal
            </h5>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} OpportunityHub by {companyName}. All rights reserved.
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <span className="mr-2">Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span>for students worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
