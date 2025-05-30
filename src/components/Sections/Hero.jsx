import React from 'react';
import { LinkButton } from '../Button';
import { ArrowRight, Play, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/10 to-accent/10"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Lindyverse - Your Gateway to Swing Dance Mastery
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Immerse yourself in the world of Lindy Hop and Swing Dance with our
          expert instructors. From beginners to advanced dancers, our
          comprehensive courses and supportive community will help you
          achieve your dance goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <LinkButton
                to="/courses"
                variant="primary"
                className="btn-primary px-8 py-4 text-lg"
              >
                Start Learning
              </LinkButton>
              <LinkButton
                to="/profile"
                variant="secondary"
                className="text-primary bg-primary/5 shadow-md px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                My Profile
              </LinkButton>
            </>
          ) : (
            <>
              <LinkButton
                to="/login"
                variant="primary"
                className="text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out px-8 py-4 rounded-lg text-lg font-semibold"
              >
                Sign In
              </LinkButton>
              <LinkButton
                to="/register"
                variant="secondary"
                className="text-primary bg-primary/5 hover:bg-primary/10 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out px-8 py-4 rounded-lg text-lg font-semibold"
              >
                Sign Up
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
