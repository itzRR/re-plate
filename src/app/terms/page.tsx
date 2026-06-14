'use client';

import { motion } from 'motion/react';
import { FileText, UserCheck, ShieldAlert, Scale, Users, Award, Ban, Gavel, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    title: 'Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing or using the RePlate platform, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.',
      },
      {
        subtitle: 'Eligibility',
        text: 'You must be at least 18 years old and capable of forming a binding contract to use RePlate. Organizations must be legally registered and authorized to handle food donations in their jurisdiction.',
      },
      {
        subtitle: 'Modifications',
        text: 'RePlate reserves the right to modify these terms at any time. Material changes will be communicated via email and platform notifications at least 14 days before taking effect. Continued use constitutes acceptance of modified terms.',
      },
    ],
  },
  {
    id: 'user-accounts',
    icon: UserCheck,
    title: 'User Accounts',
    content: [
      {
        subtitle: 'Account Creation',
        text: 'To access platform features, you must create an account with accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.',
      },
      {
        subtitle: 'Account Types',
        text: 'RePlate offers accounts for individual donors, businesses, charities, and volunteers. Each account type has specific permissions and responsibilities. Misrepresenting your account type may result in suspension.',
      },
      {
        subtitle: 'Account Security',
        text: 'You must immediately notify RePlate of any unauthorized use of your account or any security breach. We recommend enabling two-factor authentication and using strong, unique passwords.',
      },
    ],
  },
  {
    id: 'food-safety',
    icon: ShieldAlert,
    title: 'Food Safety Disclaimer',
    content: [
      {
        subtitle: 'Platform Role',
        text: 'RePlate acts as a platform connecting food donors with recipients. We do not inspect, prepare, store, or handle any food items listed on the platform. All food safety responsibility lies with the donor and recipient.',
      },
      {
        subtitle: 'Donor Responsibilities',
        text: 'Donors must ensure that all listed food items are safe for consumption, properly stored, accurately described (including allergens), and within their use-by dates. Knowingly listing unsafe food is a violation of these terms.',
      },
      {
        subtitle: 'Recipient Responsibilities',
        text: 'Recipients accept food at their own risk and should inspect all items upon receipt. Recipients are responsible for proper storage and timely consumption of rescued food. When in doubt, do not consume.',
      },
    ],
  },
  {
    id: 'liability',
    icon: Scale,
    title: 'Liability Limitations',
    content: [
      {
        subtitle: 'Service Availability',
        text: 'RePlate strives for 99.9% uptime but does not guarantee uninterrupted service. We are not liable for losses resulting from platform downtime, technical issues, or service interruptions beyond our reasonable control.',
      },
      {
        subtitle: 'Food-Related Claims',
        text: 'To the maximum extent permitted by law, RePlate is not liable for any illness, injury, or damage resulting from food obtained through the platform. Users participate in food rescue activities at their own risk.',
      },
      {
        subtitle: 'Limitation of Damages',
        text: 'In no event shall RePlate be liable for indirect, incidental, special, consequential, or punitive damages. Our total liability for any claim shall not exceed the amount you paid to RePlate in the 12 months preceding the claim.',
      },
    ],
  },
  {
    id: 'user-conduct',
    icon: Users,
    title: 'User Conduct',
    content: [
      {
        subtitle: 'Acceptable Use',
        text: 'Users must use RePlate only for its intended purpose of reducing food waste through legitimate food rescue activities. You agree to act honestly, respectfully, and in good faith in all interactions on the platform.',
      },
      {
        subtitle: 'Prohibited Activities',
        text: 'Users may not: resell donated food for profit, manipulate platform metrics or leaderboards, create fake listings, harass other users, scrape platform data, or use the platform for any illegal purpose.',
      },
      {
        subtitle: 'Community Standards',
        text: 'All users are expected to honor their commitments - show up for scheduled pickups, respond to messages promptly, and maintain accurate listings. Repeated no-shows or unresponsiveness may affect your account standing.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: Award,
    title: 'Intellectual Property',
    content: [
      {
        subtitle: 'Platform Content',
        text: 'All RePlate branding, design, code, algorithms, and original content are owned by RePlate and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.',
      },
      {
        subtitle: 'User Content',
        text: 'You retain ownership of content you post (food listings, photos, reviews). By posting, you grant RePlate a non-exclusive, royalty-free license to use, display, and distribute this content for platform operations and promotion.',
      },
      {
        subtitle: 'Feedback',
        text: 'Any suggestions, feedback, or ideas you submit regarding the platform become the property of RePlate. We may use such feedback without restriction or compensation to improve our services.',
      },
    ],
  },
  {
    id: 'termination',
    icon: Ban,
    title: 'Termination',
    content: [
      {
        subtitle: 'By You',
        text: 'You may delete your account at any time through your account settings. Upon deletion, your personal data will be removed in accordance with our Privacy Policy, though anonymized impact data may be retained.',
      },
      {
        subtitle: 'By RePlate',
        text: 'We may suspend or terminate your account immediately if you violate these terms, engage in fraudulent activity, or pose a safety risk. We will provide notice and an opportunity to appeal except in cases of serious violations.',
      },
      {
        subtitle: 'Effect of Termination',
        text: 'Upon termination, your right to use the platform ceases immediately. Provisions relating to intellectual property, limitation of liability, and dispute resolution survive termination.',
      },
    ],
  },
  {
    id: 'governing-law',
    icon: Gavel,
    title: 'Governing Law',
    content: [
      {
        subtitle: 'Jurisdiction',
        text: 'These Terms shall be governed by and construed in accordance with applicable local laws. Any disputes arising from these terms or your use of RePlate shall be subject to the exclusive jurisdiction of the competent courts.',
      },
      {
        subtitle: 'Dispute Resolution',
        text: 'Before pursuing legal action, users agree to attempt good-faith resolution by contacting RePlate support. We encourage mediation and arbitration as alternatives to litigation wherever possible.',
      },
      {
        subtitle: 'Severability',
        text: 'If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect. The unenforceable provision shall be modified to the minimum extent necessary.',
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-40 left-1/3 w-64 h-64 bg-teal-500/8 rounded-full blur-[96px]" />

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
              <Scale className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Conditions</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using the RePlate platform. By using our services, you agree to be bound by these terms.
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
                  <h2 className="text-2xl font-bold text-white font-heading">
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
          <h2 className="text-2xl font-bold text-white mb-4 font-heading">
            Have Questions About These Terms?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Our team is here to help clarify any part of our terms. Reach out and we will get back to you promptly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white font-semibold hover:bg-white/[0.08] transition-all hover:-translate-y-0.5"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
