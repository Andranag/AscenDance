import React from 'react';
import { Mail } from 'lucide-react';

const NewsletterSection = ({ email, setEmail, loading, handleNewsletterSubmit }) => {
  return (
    <section id="newsletter" className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="card backdrop-blur-sm bg-white/95">
          <div className="p-8">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-black mb-4">
              Stay in Rhythm with Our Newsletter
            </h2>
            <p className="text-black/70 mb-6">
              Get the latest dance tips, course updates, and special offers
              delivered to your inbox.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto"
            >
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 input-field"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-secondary"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
                <p
                  className="text-sm text-black/50"
                >
                  By clicking the button you agree to our{" "}
                  <a
                    href="/privacy"
                    className="text-primary hover:text-primary/90"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
