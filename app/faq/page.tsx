"use client";

import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account on qoupl?",
        a: "qoupl is launching soon! Join our waitlist to be among the first to know when we launch on iOS and Android. Once the app is available, you'll be able to sign up with your email or phone number, complete your profile with photos and information about yourself, and start matching. The entire process will take just a few minutes."
      },
      {
        q: "Is qoupl really free to use?",
        a: "Yes! qoupl will be free to use. You'll be able to create a profile, browse matches, and send messages. We'll also offer premium features for users who want enhanced functionality like unlimited likes, advanced filters, and more."
      },
      {
        q: "Who can use qoupl?",
        a: "qoupl is exclusively for college students aged 18 to 25 years. You must be a current college student enrolled in a recognized college or university. During account creation, you will be required to verify your college student status using a valid college/university ID card. We only accept college ID cards for verification - no other identification documents are accepted. This verification is mandatory to ensure all users are current college students within the eligible age range."
      },
      {
        q: "How does qoupl verify profiles?",
        a: "We require mandatory college ID verification where users must upload a valid college/university ID card to verify their student status. We also offer photo verification where users can verify their identity by taking a real-time selfie. Verified profiles get a blue checkmark badge. We use AI and human moderation to detect and remove fake profiles and ensure all users are legitimate college students."
      }
    ]
  },
  {
    category: "Matching & Discovery",
    questions: [
      {
        q: "How does qoupl's matching algorithm work?",
        a: "Our AI-powered algorithm analyzes your profile information, preferences, interests, behavior, and values to suggest highly compatible matches. The more you use qoupl, the better our algorithm becomes at understanding your preferences and suggesting suitable matches."
      },
      {
        q: "Can I filter matches by specific criteria?",
        a: "Yes! You can filter potential matches by age range, distance, height, education, religion, lifestyle choices, and more. Premium users get access to advanced filters for even more specific matching."
      },
      {
        q: "What should I do if I don't see many matches?",
        a: "Try expanding your search radius, adjusting your age preferences, completing your profile fully with quality photos, being active on the app regularly, and verifying your profile to appear more trustworthy to potential matches."
      },
      {
        q: "Can I undo a swipe or like?",
        a: "Yes! Premium users can use the 'Rewind' feature to undo their last swipe. This is especially helpful if you accidentally swiped left on someone you were interested in."
      }
    ]
  },
  {
    category: "Messaging & Communication",
    questions: [
      {
        q: "How do I start a conversation?",
        a: "Once you match with someone, you can start chatting immediately. We recommend using our AI-powered conversation starters or referencing something from their profile to make a great first impression."
      },
      {
        q: "Are my messages private and secure?",
        a: "Absolutely! All messages on qoupl are encrypted end-to-end, meaning only you and your match can read them. We take your privacy seriously and never read your private conversations."
      },
      {
        q: "Can I send photos in messages?",
        a: "Yes, you can share photos and voice messages with your matches. All shared content is moderated by our AI system to ensure it complies with our Community Guidelines."
      },
      {
        q: "What if someone sends me inappropriate messages?",
        a: "You can report any message or user that makes you uncomfortable. Use the report button in the chat, and our safety team will review it within 24 hours. You can also block users immediately."
      }
    ]
  },
  {
    category: "Safety & Privacy",
    questions: [
      {
        q: "How does qoupl keep me safe?",
        a: "We use multiple safety measures including photo verification, AI-powered content moderation, 24/7 human review team, encrypted messaging, reporting and blocking features, and safety tips before first meetings. Your safety is our top priority."
      },
      {
        q: "Can I hide my profile from certain people?",
        a: "Yes! You can block specific users, and they won't be able to see your profile or contact you. You can also use the 'Incognito Mode' (premium feature) to browse profiles privately without appearing in their discovery feed."
      },
      {
        q: "What information is visible on my profile?",
        a: "Your profile shows your photos, name, age, bio, interests, and any other information you choose to add. Your exact location is never shared - only approximate distance. You control what you share."
      },
      {
        q: "How do I report a suspicious profile?",
        a: "Tap the three dots on any profile and select 'Report.' Choose the reason (fake profile, inappropriate content, harassment, etc.) and submit. We review all reports within 24 hours."
      }
    ]
  },
  {
    category: "Premium Features",
    questions: [
      {
        q: "What is qoupl Plus?",
        a: "qoupl Plus is our premium subscription that includes unlimited likes, advanced filters, rewind feature, see who liked you, boost your profile, incognito mode, and no ads. It enhances your experience and increases your chances of finding matches."
      },
      {
        q: "How much does qoupl Plus cost?",
        a: "qoupl Plus is available in different subscription plans: monthly, 3-month, and 6-month options. Longer plans offer better value. Check the app for current pricing in your region."
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Yes! You can cancel your subscription at any time through your app store settings (App Store or Google Play). Your premium features will remain active until the end of your current billing period."
      },
      {
        q: "Do I get a refund if I cancel?",
        a: "Refunds are handled through your app store (Apple App Store or Google Play Store) and are subject to their refund policies. Generally, unused portions of subscriptions are not refundable, but you can check with the respective app store."
      }
    ]
  },
  {
    category: "Profile & Account",
    questions: [
      {
        q: "How do I edit my profile?",
        a: "Tap on your profile icon, then tap 'Edit Profile.' You can update your photos, bio, interests, preferences, and all other profile information anytime."
      },
      {
        q: "What makes a good profile?",
        a: "Use clear, recent photos that show your face, write a genuine and interesting bio, fill out all profile sections, showcase your interests and hobbies, be authentic and honest, and verify your profile for credibility."
      },
      {
        q: "Can I link my Instagram or Spotify?",
        a: "Yes! You can connect your Instagram and Spotify accounts to your qoupl profile to showcase more about your lifestyle and music taste. This helps potential matches get to know you better."
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings > Account > Delete Account. Keep in mind this is permanent and cannot be undone. All your matches, messages, and profile data will be permanently deleted."
      }
    ]
  },
  {
    category: "Technical Support",
    questions: [
      {
        q: "The app isn't working properly. What should I do?",
        a: "Try these steps: ensure you have the latest version of the app, restart the app, check your internet connection, restart your phone, or contact our support team at support@qoupl.ai with details about the issue."
      },
      {
        q: "I'm not receiving notifications. How do I fix this?",
        a: "Check your phone's notification settings for qoupl, ensure notifications are enabled in the app settings, make sure your phone isn't in Do Not Disturb mode, and check that you have a stable internet connection."
      },
      {
        q: "Why can't I log in to my account?",
        a: "Make sure you're using the correct email/phone number and password, try resetting your password, check if your account was suspended (check your email), ensure you have a stable internet connection, or contact support if the issue persists."
      },
      {
        q: "Can I use qoupl on multiple devices?",
        a: "Yes! You can log into your qoupl account on multiple devices. Your profile, matches, and messages will sync across all devices automatically."
      }
    ]
  },
  {
    category: "Success & Tips",
    questions: [
      {
        q: "What are the best tips for getting matches?",
        a: "Use high-quality, clear photos that show your face, complete your entire profile with honest information, be active on the app daily, write a unique and engaging bio, verify your profile, use the app during peak hours (evenings and weekends), and be yourself!"
      },
      {
        q: "How long does it usually take to find a match?",
        a: "This varies for everyone! Some users find matches within hours, while others may take longer. Stay active, keep your profile updated, and be patient. Our algorithm gets better at understanding your preferences over time."
      },
      {
        q: "What should I write in my first message?",
        a: "Reference something specific from their profile, ask an open-ended question, use humor (if appropriate), be genuine and friendly, and avoid generic openers like 'Hey' or 'What's up?' Show that you've read their profile!"
      },
      {
        q: "Is it okay to meet someone in person from qoupl?",
        a: "Yes! Many successful couples have met through qoupl. Always follow our safety guidelines: meet in public places, tell a friend where you're going, chat extensively before meeting, trust your instincts, and arrange your own transportation."
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-primary transition-colors"
      >
        <span className="font-medium pr-4">{question}</span>
        <div className="flex-shrink-0">
          {isOpen ? (
            <Minus className="h-5 w-5 text-primary" />
          ) : (
            <Plus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="pb-5 pr-12 text-muted-foreground leading-relaxed animate-in fade-in-50 slide-in-from-top-2 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-[#662D91] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about qoupl. Can't find what you're
            looking for? Contact our support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                <h2 className="text-xl font-bold text-primary">
                  {category.category}
                </h2>
              </div>
              <div className="bg-card rounded-lg border p-6">
                {category.questions.map((faq, faqIndex) => (
                  <FAQItem
                    key={faqIndex}
                    question={faq.q}
                    answer={faq.a}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-[#662D91]/10 p-8 rounded-lg border border-primary/20">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@qoupl.ai"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold"
            >
              Email Support
            </a>
            <a
              href="mailto:help@qoupl.ai"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary/10 transition-colors font-semibold"
            >
              Get Help
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
