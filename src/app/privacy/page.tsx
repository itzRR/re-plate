'use client';

import { motion } from 'motion/react';
import { Shield, Eye, Database, Cookie, UserCheck, Lock, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    id: 'information-collection',
    icon: Database,
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you create an account on RePlate, we collect your name, email address, phone number, and location data. For businesses and charities, we may also collect organizational details, food handling certifications, and operational hours.',
      },
      {
        subtitle: 'Usage Data',
        text: 'We automatically collect information about how you interact with our platform, including pages visited, features used, food listings viewed, pickup/delivery history, and search queries. This helps us improve the food rescue experience.',
      },
      {
        subtitle: 'Location Data',
        text: 'With your permission, we collect precise location data to connect you with nearby food donations and optimize rescue routes. You can disable location services at any time through your device settings.',
      },
    ],
  },
  {
    id: 'how-we-use-data',
    icon: Eye,
    title: 'How We Use Your Data',
    content: [
      {
        subtitle: 'Platform Operations',
        text: 'Your data powers core platform features: matching food donors with recipients, calculating optimal pickup routes, tracking impact metrics, and maintaining food safety compliance across the rescue chain.',
      },
      {
        subtitle: 'Communication',
        text: 'We use your contact information to send pickup notifications, delivery confirmations, food safety alerts, and platform updates. You can manage your notification preferences in your account settings.',
      },
      {
        subtitle: 'Analytics & Improvement',
        text: 'Aggregated and anonymized data helps us understand food waste patterns, measure environmental impact, improve our matching algorithms, and develop new features for the community.',
      },
    ],
  },
  {
    id: 'data-sharing',
    icon: UserCheck,
    title: 'Data Sharing & Third Parties',
    content: [
      {
        subtitle: 'Within the Platform',
        text: 'When you list food or claim a donation, relevant information (name, location, pickup details) is shared with the other party to facilitate the rescue. We never share more than what\'s necessary for the transaction.',
      },
      {
        subtitle: 'Service Providers',
        text: 'We work with trusted third-party services for mapping, notifications, analytics, and hosting. These providers are contractually bound to protect your data and may only use it to perform services on our behalf.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information when required by law, to protect the safety of our users, or to enforce our terms of service. We will notify you of such disclosures when legally permitted.',
      },
    ],
  },
  {
    id: 'cookies',
    icon: Cookie,
    title: 'Cookies & Tracking',
    content: [
      {
        subtitle: 'Essential Cookies',
        text: 'These cookies are necessary for the platform to function properly. They enable core features like user authentication, session management, and security protections. These cannot be disabled.',
      },
      {
        subtitle: 'Analytics Cookies',
        text: 'We use analytics cookies to understand how users interact with RePlate, which features are most popular, and where we can improve. This data is aggregated and does not identify individual users.',
      },
      {
        subtitle: 'Preference Cookies',
        text: 'These cookies remember your settings and preferences, such as language, location defaults, dietary filters, and notification preferences, to provide a personalized experience.',
      },
    ],
  },
  {
    id: 'user-rights',
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Portability',
        text: 'You have the right to request a copy of all personal data we hold about you. We will provide this in a structured, commonly used, and machine-readable format within 30 days of your request.',
      },
      {
        subtitle: 'Correction & Deletion',
        text: 'You can update your personal information at any time through your account settings. You may also request the deletion of your account and associated data, subject to legal retention requirements.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You can opt out of non-essential data collection, marketing communications, and analytics tracking at any time. Some features may have reduced functionality if certain data collection is disabled.',
      },
    ],
  },
  {
    id: 'data-security',
    icon: Lock,
    title: 'Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data transmitted between your device and our servers is encrypted using TLS 1.3. Sensitive data at rest is encrypted using AES-256 encryption. We regularly audit our security practices.',
      },
      {
        subtitle: 'Access Controls',
        text: 'We implement strict role-based access controls, ensuring that only authorized personnel can access user data. All access is logged and monitored for suspicious activity.',
      },
      {
        subtitle: 'Incident Response',
        text: 'In the unlikely event of a data breach, we will notify affected users within 72 hours as required by applicable regulations. We maintain a comprehensive incident response plan.',
      },
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact Us',
    content: [
      {
        subtitle: 'Data Protection Officer',
        text: 'For any questions about this privacy policy or how we handle your data, please contact our Data Protection Officer at privacy@replate.eco.',
      },
      {
        subtitle: 'Response Time',
        text: 'We aim to respond to all privacy-related inquiries within 5 business days. For data access or deletion requests, we will process your request within 30 calendar days.',
      },
      {
        subtitle: 'Updates to This Policy',
        text: 'We may update this privacy policy from time to time. Significant changes will be communicated through the platform and via email. Continued use of RePlate after changes constitutes acceptance.',
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-teal-500/8 rounded-full blur-[96px]" />

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
              <Shield className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Policy</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Your privacy matters to us. This policy explains how RePlate collects, uses, and protects your personal information as you help reduce food waste.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Last updated: June 14, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-8"
        >
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sections.map((section, i) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors py-2 px-3 rounded-xl hover:bg-white/[0.03]"
              >
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-semibold">
                  {i + 1}
                </span>
                {section.title}
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.05 }}
              className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-8 hover:border-emerald-500/10 transition-colors"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center shrink-0">
                  <section.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-6 ml-0 md:ml-16">
                {section.content.map((item, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-[15px]">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/10 p-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-outfit)]">
            Questions About Your Privacy?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            We are committed to transparency. If you have any questions about how we handle your data, do not hesitate to reach out.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
          >
            <Mail className="w-5 h-5" />
            Contact Us
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
