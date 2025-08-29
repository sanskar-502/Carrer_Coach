"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full pt-24 md:pt-28 pb-16">
      {/* Floating elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-xl floating-animation" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10">
        <div className="space-y-6 text-center">
          <div className="space-y-6 mx-auto">
            {/* Enhanced badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card text-base font-semibold">
              <div className="relative mr-3 flex items-center">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></span>
                <span className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></span>
              </div>
              <span className="gradient-text-secondary flex items-center">🚀 AI-Powered Career Transformation</span>
            </div>
            
            <h1 className="text-5xl font-black md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] mb-4">
              <span className="block gradient-title">
                Career Success
              </span>
              <span className="block gradient-title">
                Starts Here
              </span>
            </h1>
            
            <div className="text-xl md:text-2xl font-bold mb-3">
              <span className="gradient-text-accent">Accelerate • Innovate • Dominate</span>
            </div>
            
            <p className="mx-auto max-w-[800px] text-lg md:text-xl text-foreground/80 leading-relaxed font-medium">
              Unlock your potential with our revolutionary AI platform that provides 
              <span className="gradient-text-secondary font-bold"> personalized career guidance</span>, 
              smart resume optimization, and expert interview preparation.
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 text-base font-semibold">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-card hover:scale-105 transition-transform duration-300">
                <div className="w-3 h-3 gradient-secondary rounded-full animate-pulse"></div>
                <span className="gradient-text-secondary">Smart Resume Builder</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-card hover:scale-105 transition-transform duration-300">
                <div className="w-3 h-3 gradient-accent rounded-full animate-pulse"></div>
                <span className="gradient-text-accent">AI Interview Mastery</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-card hover:scale-105 transition-transform duration-300">
                <div className="w-3 h-3 gradient-success rounded-full animate-pulse"></div>
                <span className="text-emerald-600 font-bold">Industry Intelligence</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-4 text-lg font-bold gradient glow-effect hover:scale-110 hover:shadow-2xl transition-all duration-300 rounded-xl">
                🚀 Launch Your Career
                <span className="ml-2 text-xl">→</span>
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold glass-card hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-xl border-2 border-primary/30">
                ✨ Explore Features
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground/70">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>10,000+ Success Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">🏆</span>
              <span>Industry Leader</span>
            </div>
          </div>
          
          <div className="hero-image-wrapper mt-10 md:mt-12">
            <div ref={imageRef} className="hero-image relative group">
              {/* Enhanced glow effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 via-purple-500/20 to-pink-500/30 rounded-2xl blur-3xl transform scale-95 group-hover:scale-100 transition-transform duration-700"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
              
              {/* Image container */}
              <div className="relative glass-card p-4 rounded-2xl">
                <Image
                  src="/catalyst_hero.png"
                  width={1280}
                  height={720}
                  alt="AI Career Coach Dashboard - Your Gateway to Success"
                  className="relative rounded-xl shadow-2xl border-2 border-white/30 mx-auto group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                
                {/* Floating elements around the image */}
                <div className="absolute -top-6 -left-6 w-12 h-12 gradient-secondary rounded-full opacity-80 floating-animation" style={{animationDelay: '0s'}}></div>
                <div className="absolute -top-4 -right-8 w-8 h-8 gradient-accent rounded-full opacity-70 floating-animation" style={{animationDelay: '2s'}}></div>
                <div className="absolute -bottom-6 -right-4 w-10 h-10 gradient-success rounded-full opacity-60 floating-animation" style={{animationDelay: '4s'}}></div>
                <div className="absolute -bottom-8 -left-8 w-6 h-6 gradient-warning rounded-full opacity-80 floating-animation" style={{animationDelay: '1s'}}></div>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
