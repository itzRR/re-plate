'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MapPin, Clock, Send, CheckCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const contactCards = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'support@replate.eco',
    description: 'For general inquiries and support',
  },
  {
    icon: MapPin,
    title: 'Our Location',
    detail: 'Colombo, Sri Lanka',
    description: 'Serving communities worldwide',
  },
  {
    icon: Clock,
    title: 'Response Time',
    detail: 'Within 24 hours',
    description: 'Mon-Fri, 9:00 AM - 6:00 PM',
  },
];

const subjectOptions = [
  'General Inquiry',
  'Food Donation Support',
  'Partnership Opportunities',
  'Technical Support',
  'Report an Issue',
  'Feedback & Suggestions',
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-[#0F172A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-60 right-1/4 w-64 h-64 bg-teal-500/8 rounded-full blur-[96px]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Touch</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Have a question, want to partner with us, or just want to say hello? We would love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6 text-center hover:border-emerald-500/15 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <card.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-1 font-heading">
                {card.title}
              </h3>
              <p className="text-emerald-400 text-sm font-medium mb-1">{card.detail}</p>
              <p className="text-slate-500 text-xs">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-8 md:p-10"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                  Message Sent!
                </h3>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  Thank you for reaching out. We will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.08] transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 font-heading">
                    Send us a Message
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Fill out the form below and we will respond as soon as possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-2">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#1E293B] text-slate-400">
                      Select a subject
                    </option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option} className="bg-[#1E293B] text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
