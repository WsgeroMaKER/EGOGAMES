import { MessageCircle, Mail, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { STUDIO_CONFIG } from '@/config/studio';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Contact() {
  const containerRef = useScrollReveal<HTMLElement>();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const subject = encodeURIComponent(`Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
      );
      window.location.href = `mailto:${STUDIO_CONFIG.email}?subject=${subject}&body=${body}`;
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section ref={containerRef} className="relative section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-jp text-xs tracking-widest text-gray-600">
              連絡
            </span>
            <span className="h-px w-12 bg-white/20" />
          </div>
          <h2 className="reveal section-title">
            Get in Touch
          </h2>
          <p className="reveal section-subtitle">
            Have a question, partnership idea, or just want to say hello? We would
            love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="reveal space-y-6">
            <div className="card-base p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Connect With Us
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base mb-6">
                Whether you are a player with feedback, a creator looking to
                collaborate, or a business interested in partnering with EGO? Games,
                we are always open to meaningful conversations.
              </p>

              <div className="space-y-4">
                {/* Discord */}
                <a
                  href={STUDIO_CONFIG.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-none glass hover:bg-white/[0.06] transition-all group"
                >
                  <div className="p-3 rounded-none glass">
                    <MessageCircle size={22} className="text-white/80" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">Discord Community</p>
                    <p className="text-sm text-gray-500">Join our server for updates and support</p>
                  </div>
                  <Send size={16} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${STUDIO_CONFIG.email}`}
                  className="flex items-center gap-4 p-4 rounded-none glass hover:bg-white/[0.06] transition-all group"
                >
                  <div className="p-3 rounded-none glass">
                    <Mail size={22} className="text-white/80" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">Email Us</p>
                    <p className="text-sm text-gray-500">{STUDIO_CONFIG.email}</p>
                  </div>
                  <Send size={16} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            <div className="card-base p-6 md:p-8">
              <h4 className="font-display text-lg font-semibold text-white mb-2">
                Join the EGO? Games Community
              </h4>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Our Discord server is the best place to connect with other players,
                get the latest news, and interact directly with the development team.
              </p>
              <a
                href={STUDIO_CONFIG.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <MessageCircle size={18} />
                Join Discord
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="reveal card-base p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-white mb-6">
              Send Us a Message
            </h3>

            {submitted && (
              <div className="mb-6 flex items-center gap-3 p-4 rounded-none border border-white/20 animate-fade-in">
                <CheckCircle2 size={20} className="text-white shrink-0" />
                <p className="text-sm text-gray-300">
                  Your email client is opening with your message. Thank you for
                  reaching out!
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  className={`w-full px-4 py-3 rounded-none glass text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                    errors.name
                      ? 'ring-1 ring-error-500/50'
                      : 'focus:ring-white/30'
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-error-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  className={`w-full px-4 py-3 rounded-none glass text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                    errors.email
                      ? 'ring-1 ring-error-500/50'
                      : 'focus:ring-white/30'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-error-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange('message')}
                  className={`w-full px-4 py-3 rounded-none glass text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all resize-none ${
                    errors.message
                      ? 'ring-1 ring-error-500/50'
                      : 'focus:ring-white/30'
                  }`}
                  placeholder="Tell us what is on your mind..."
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-error-400">{errors.message}</p>
                )}
              </div>

              <button type="submit" className="btn-primary w-full">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
