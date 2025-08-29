import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden scroll-mt-0.01">
        <div className="absolute inset-0 gradient opacity-10"></div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-6">
              <span className="gradient-text-secondary font-bold">✨ Core Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
              <span className="gradient-title block">Powerful Tools</span>
              <span className="gradient-title block">Career Excellence</span>
            </h2>
            <p className="text-2xl text-foreground/70 max-w-3xl mx-auto font-medium leading-relaxed">
              🚀 Everything you need to <span className="gradient-text-accent font-bold">dominate your career journey</span> in one intelligent, AI-powered platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-morphism border-2 border-white/20 hover:border-primary/50 card-hover group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative z-10 pt-8 pb-6 text-center flex flex-col items-center h-full">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient opacity-10"></div>
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-6">
              <span className="gradient-text-secondary font-bold">🏆 Our Impact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              <span className="gradient-title">Trusted by Professionals</span>
            </h2>
            <p className="text-xl text-foreground/70 font-medium">
              Join a thriving community of <span className="gradient-text-accent font-bold">successful professionals</span> worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="group">
              <Card className="glass-morphism text-center p-6 card-hover border border-blue-200/50">
                <CardContent className="p-0">
                  <h3 className="text-3xl md:text-4xl font-bold gradient-text-secondary mb-2">50+</h3>
                  <p className="text-muted-foreground font-medium">Industries Covered</p>
                </CardContent>
              </Card>
            </div>
            <div className="group">
              <Card className="glass-morphism text-center p-6 card-hover border border-purple-200/50">
                <CardContent className="p-0">
                  <h3 className="text-3xl md:text-4xl font-bold gradient-text-secondary mb-2">1000+</h3>
                  <p className="text-muted-foreground font-medium">Interview Questions</p>
                </CardContent>
              </Card>
            </div>
            <div className="group">
              <Card className="glass-morphism text-center p-6 card-hover border border-teal-200/50">
                <CardContent className="p-0">
                  <h3 className="text-3xl md:text-4xl font-bold gradient-text-secondary mb-2">95%</h3>
                  <p className="text-muted-foreground font-medium">Success Rate</p>
                </CardContent>
              </Card>
            </div>
            <div className="group">
              <Card className="glass-morphism text-center p-6 card-hover border border-indigo-200/50">
                <CardContent className="p-0">
                  <h3 className="text-3xl md:text-4xl font-bold gradient-text-secondary mb-2">24/7</h3>
                  <p className="text-muted-foreground font-medium">AI Support</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 md:py-24 relative scroll-mt-0.01">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-6">
              <span className="gradient-text-secondary font-bold">📝 Your Journey</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
              <span className="gradient-title block">Your Success</span>
              <span className="gradient-title block">Roadmap</span>
            </h2>
            <p className="text-2xl text-foreground/70 font-medium leading-relaxed">
              Four game-changing steps to <span className="gradient-text-accent font-bold">transform your career trajectory</span> forever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Connecting line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0"></div>
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-6 p-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl gradient flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-primary border-2 border-primary/20">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-16 md:py-24 relative overflow-hidden scroll-mt-0.01">
        <div className="absolute inset-0 gradient opacity-10"></div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-6">
              <span className="gradient-text-secondary font-bold">🗣️ Success Stories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
              <span className="gradient-title block">Career</span>
              <span className="gradient-title block">Transformations</span>
            </h2>
            <p className="text-2xl text-foreground/70 font-medium leading-relaxed max-w-4xl mx-auto">
              Real stories from professionals who <span className="gradient-text-accent font-bold">revolutionized their careers</span> with our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="glass-morphism border-2 border-white/30 card-hover group relative overflow-hidden">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  index % 3 === 0 ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' :
                  index % 3 === 1 ? 'bg-gradient-to-br from-purple-500/10 to-teal-500/10' :
                  'bg-gradient-to-br from-teal-500/10 to-blue-500/10'
                }`}></div>
                
                <CardContent className="relative z-10 pt-8 pb-6">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-14 w-14 flex-shrink-0">
                        <div className={`w-14 h-14 rounded-full ${testimonial.bgColor} flex items-center justify-center text-white font-bold text-lg shadow-lg border-3 border-primary/30`}>
                          {testimonial.initials}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-lg">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {testimonial.role}
                        </p>
                        <p className="text-sm font-semibold gradient-text-secondary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    
                    <blockquote className="relative">
                      <div className="absolute -top-4 -left-2">
                        <svg className="w-8 h-8 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                        </svg>
                      </div>
                      <p className="text-foreground/90 italic leading-relaxed pl-6">
                        {testimonial.quote}
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-6">
              <span className="gradient-text-secondary font-bold">❔ FAQ</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
              <span className="gradient-title block">Got Questions?</span>
              <span className="gradient-title block">We've Got Answers</span>
            </h2>
            <p className="text-2xl text-foreground/70 font-medium leading-relaxed">
              Find everything you need to know about our <span className="gradient-text-accent font-bold">revolutionary platform</span>
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass-morphism rounded-2xl p-8 border border-white/20">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-xl px-6 py-2 hover:bg-primary/5 transition-colors">
                    <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl floating-animation" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl floating-animation" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Ready to
                <span className="block bg-gradient-to-r from-white via-blue-100 to-white text-transparent bg-clip-text">
                  Accelerate Your Career?
                </span>
              </h2>
              <p className="mx-auto max-w-[700px] text-white/90 text-lg md:text-xl leading-relaxed">
                Join thousands of professionals who are advancing their careers
                with AI-powered guidance and personalized insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 text-lg font-semibold bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Start Your Journey Today <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="text-white/70 text-sm">
                ✨ Free to get started
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
