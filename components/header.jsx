"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="fixed top-0 w-full border-b border-white/20 bg-background/80 backdrop-blur-xl z-50 supports-[backdrop-filter]:bg-background/60">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-teal-500/5"></div>
      
      <nav className="relative container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="group">
          <div className="flex items-center space-x-2">
            <Image
              src={"/aicatalyst.png"}
              alt="AI Catalyst logo"
              width={200}
              height={60}
              className="h-14 py-1 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Navigation Links for larger screens - only show on home page */}
        {isHomePage && (
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              How it Works
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Testimonials
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="hidden md:inline-flex items-center gap-2 hover:bg-blue-500/10 hover:text-primary transition-all duration-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0 hover:bg-blue-500/10">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gradient hover:scale-105 transition-all duration-300 shadow-lg">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Growth Tools</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 glass-morphism border border-white/20 shadow-2xl">
                <DropdownMenuItem asChild className="hover:bg-blue-500/10 transition-colors">
                  <Link href="/resume" className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Build Resume</div>
                      <div className="text-xs text-muted-foreground">AI-powered resume builder</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-purple-500/10 transition-colors">
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <PenBox className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Cover Letter</div>
                      <div className="text-xs text-muted-foreground">Personalized letters</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-teal-500/10 transition-colors">
                  <Link href="/interview" className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium">Interview Prep</div>
                      <div className="text-xs text-muted-foreground">Practice with AI</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-11 h-11 ring-2 ring-primary/20 hover:ring-primary/40 transition-all",
                  userButtonPopoverCard: "shadow-2xl border border-white/20 backdrop-blur-xl",
                  userPreviewMainIdentifier: "font-semibold",
                  userButtonPopoverActionButton: "hover:bg-primary/10",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
