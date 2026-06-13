"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  BookOpen,
  PenTool,
  Users,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(500);
  const [visibleSections, setVisibleSections] = useState(new Set<string>());
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>();
    const sectionNames = [
      "hero",
      "personas",
      "features",
      "social-proof",
      "final-cta",
    ];

    sectionNames.forEach((name) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, name]));
          }
        },
        { threshold: 0.1 },
      );

      const element = sectionRefs.current[name];
      if (element) {
        observer.observe(element);
        observers.set(name, observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent, isFirstForm = true) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setStatus("loading");

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong");
      }
      setCount(count + 1);
      setEmail("");
      setTimeout(() => setSubmitted(false), 2000);
      if (!isFirstForm) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const isVisible = (section: string) => visibleSections.has(section);

  return (
    <main className="overflow-hidden bg-background">
      {/* Hero Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionRefs.current["hero"] = el;
        }}
        className="relative min-h-screen w-full flex items-center justify-center px-4 py-20 overflow-hidden"
      >
        {/* Subtle background accent */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-5"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={`transition-all duration-1000 transform ${
                isVisible("hero")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
                Where Nigeria&apos;s Stories Come Home
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-balance max-w-md">
                Join a community connecting readers and authors from across
                Africa. Discover, read, and share stories that matter.
              </p>

              {/* Signup Form */}
              <form onSubmit={(e) => handleSubmit(e, true)} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-6 py-4 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition backdrop-blur-md bg-opacity-50"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2 whitespace-nowrap"
                    onClick={handleSubmit}
                  >
                    Join Waitlist
                    <ChevronRight size={20} />
                  </button>
                </div>
              </form>

              {/* Social Proof Counter */}
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle size={16} className="text-accent" />
                <p>
                  Be one of the first{" "}
                  <span className="text-foreground font-semibold">
                    {count}+
                  </span>{" "}
                  to call this home
                </p>
                {/* <span>
                  Join{" "}
                  <span className="text-foreground font-semibold">
                    {count}+
                  </span>{" "}
                  readers and authors already on the list
                </span> */}
              </div>
            </div>

            {/* Right - Book Stack Illustration */}
            <div
              className={`transition-all duration-1000 transform ${
                isVisible("hero")
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              <div className="relative h-80 lg:h-96 perspective">
                {/* Decorative book stack illustration */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src="/book-stack.png"
                    alt="Stack of colorful book covers"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Persona Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionRefs.current["personas"] = el;
        }}
        className="relative w-full py-20 px-4 bg-gradient-to-b from-background to-card"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              For Readers & Authors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re seeking your next great read or ready to share
              your voice with the world
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Readers Card */}
            <div
              className={`group relative rounded-2xl overflow-hidden transition-all duration-1000 transform ${
                isVisible("personas")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10"></div>
              <img
                src="/reader-image.jpg"
                alt="Cozy reading scene with warm lamp glow"
                className="w-full h-96 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="relative z-20 p-8 pt-24 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-accent bg-opacity-20">
                    <BookOpen className="text-accent" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">For Readers</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Discover stories that resonate with your soul. Explore new
                  voices, connect with authors, and build your personal library
                  of African literature.
                </p>
              </div>
            </div>

            {/* Authors Card */}
            <div
              className={`group relative rounded-2xl overflow-hidden transition-all duration-1000 transform ${
                isVisible("personas")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10"></div>
              <img
                src="/author-image.jpg"
                alt="Creative author workspace"
                className="w-full h-96 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="relative z-20 p-8 pt-24 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-accent bg-opacity-20">
                    <PenTool className="text-accent" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">For Authors</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Publish your work and reach readers across Africa. Get
                  discovered, build your audience, and bring your stories to the
                  world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Teaser Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionRefs.current["features"] = el;
        }}
        className="relative w-full py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground">
              Sneak peek at what&apos;s being built
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Discovery Engine", image: "/ui-discovery.png" },
              { name: "Author Dashboard", image: "/ui-dashboard.png" },
              { name: "Reading Interface", image: "/ui-reading.png" },
              { name: "Community Tools", image: "/ui-community.png" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-1000 transform group-hover:scale-[1.02] ${
                  isVisible("features")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Card Background */}
                <div className="relative h-64 bg-card border border-border rounded-2xl overflow-hidden">
                  {/* Blurred UI Preview Image */}
                  <img
                    src={feature.image}
                    alt={`${feature.name} preview`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:blur-[4px] blur-[10px]"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50 transition-all duration-500 group-hover:from-black/20 group-hover:via-black/30 group-hover:to-black/40"></div>

                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                    Coming Soon
                  </div>
                </div>

                {/* Feature Name */}
                <div className="p-4 bg-gradient-to-b from-card to-background">
                  <h3 className="text-center font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                    {feature.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonial Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionRefs.current["social-proof"] = el;
        }}
        // ref={(el) => {
        //   if (el) sectionRefs.current["social-proof"] = el;
        // }}
        className="relative w-full py-32 lg:py-40 px-4"
      >
        <div className="max-w-3xl mx-auto">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible("social-proof")
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            {/* Large Serif Quote */}
            <blockquote className="font-serif text-3xl lg:text-4xl italic text-[#F5F0E8] text-center mb-8 leading-relaxed text-balance">
              &quot;BookSocial is more than a platform—it&apos;s a movement to
              amplify African voices and connect our stories with the
              world.&quot;
            </blockquote>

            {/* Attribution */}
            <p className="text-center text-xs lg:text-sm uppercase tracking-widest text-accent font-semibold mb-16">
              — Beta Tester Community
            </p>

            {/* Avatar Row and Counter Container */}
            <div className="flex flex-col items-center gap-12">
              {/* Avatar Row */}
              <div className="flex items-center justify-center">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div
                      key={num}
                      className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent flex-shrink-0 ring-2 ring-background hover:scale-110 transition-transform duration-300"
                    >
                      <img
                        src={`/avatar-${num}.png`}
                        alt={`Early believer ${num}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Counter */}
              <div className="text-center">
                {/* <div className="text-5xl lg:text-6xl font-bold text-accent mb-2">
                  500+
                </div> */}
                <p className="text-muted-foreground text-sm uppercase tracking-wide">
                  Be among our first 500 founding members
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionRefs.current["final-cta"] = el;
        }}
        className="relative w-full py-32 px-4 overflow-hidden"
      >
        {/* Background illustration */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="/open-book.png"
            alt="Open book with transforming pages"
            className="w-full h-full object-cover blur-sm"
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible("final-cta")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Be the First to Turn the Page
            </h2>
            <p className="text-lg text-muted-foreground mb-12 text-balance max-w-xl mx-auto">
              Join thousands of readers and authors waiting to be part of
              something extraordinary. Your story starts here.
            </p>

            <form onSubmit={(e) => handleSubmit(e, false)} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-4 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition backdrop-blur-md bg-opacity-50"
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {submitted ? "✓ Added!" : "Join Now"}
                </button>
              </div>
            </form>

            {submitted && (
              <div className="text-accent text-sm font-medium animate-fade-in">
                Welcome to BookSocial! Check your email for updates.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-12 px-4 border-t border-border bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-accent" />
                BookSocial
              </h3>
              <p className="text-sm text-muted-foreground">
                Where Nigeria&apos;s stories come home
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">
                For Readers
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Discover Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    My Library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">
                For Authors
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Publish
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 BookSocial. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-accent transition">
                Twitter
              </a>
              <a href="#" className="hover:text-accent transition">
                Instagram
              </a>
              <a href="#" className="hover:text-accent transition">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
