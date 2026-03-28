"use client";

import { useState } from "react";

type Narrator = "murtaza" | "sarrah";

interface Chapter {
  id: string;
  year: string;
  title: string;
  body: string;
}

interface StoryData {
  subtitle: string;
  description: string;
  quote: string;
  quoteAttribution: string;
  chapters: Chapter[];
  closing: string;
}

const stories: Record<Narrator, StoryData> = {
  murtaza: {
    subtitle: "As told by Murtaza",
    description:
      "From a bus stop pickup in Mississauga to wedding shopping across India — this is how it happened, from my side of things.",
    quote:
      "She asked me what my favorite food was and I said chocolate biryani. She looked at me like I was insane. I knew right then.",
    quoteAttribution: "Murtaza, probably",
    chapters: [
      {
        id: "first-meeting",
        year: "Late 2023",
        title: "The Bus Stop Pickup",
        body: "Mom had invited her over for dinner. She\u2019d just moved to Canada and was staying in North York \u2014 I was out in Mississauga. I picked her up from the bus stop, and what was supposed to be a simple evening turned into hours of talking. Mostly about food. At some point I told her I wanted to try chocolate biryani. She laughed. It became our thing.",
      },
      {
        id: "halloween",
        year: "October 2023",
        title: "Kensington Market",
        body: 'We met up again right before Halloween for some costume shopping. No real plan \u2014 just walked around Toronto, ended up in Kensington Market, tried on ridiculous outfits, and talked smack about how expensive all these "thrift" stores were. It was one of those perfect, effortless days where time just disappears.',
      },
      {
        id: "new-years",
        year: "New Year\u2019s Eve",
        title: "The Awkward Ask",
        body: "On New Year\u2019s I asked her to be my girlfriend \u2014 a bit embarrassingly, if I\u2019m honest. And then I immediately dropped her home and drove off to go watch fireworks. She still jokes about how I just left and went to enjoy myself. In my defense, the fireworks were really good.",
      },
      {
        id: "growing",
        year: "2024",
        title: "Falling Into It",
        body: "This was the year we really fell in love. We had some of those hard, honest conversations about life, but talking to her never felt difficult \u2014 and she\u2019d say the same about me. We told our families around Eid in April. I even switched to an iPhone so we could FaceTime. Concerts, park dates, Winter Wonderland, arcades, and more food than I can remember.",
      },
      {
        id: "toronto",
        year: "2025",
        title: "The Toronto Year",
        body: "I moved to Toronto and suddenly we could see each other all the time. She helped me decorate my apartment. For a brief stretch I was cat-sitting a friend\u2019s cat and she loved Libro more than she loved me \u2014 her words, not mine. We travelled to Montreal for our first festival together. She made me jump off a cliff into water. I was terrified. She was delighted.",
      },
      {
        id: "india",
        year: "Late 2025",
        title: "Hong Kong, India & 18 Hours on a Train",
        body: "She finished her studies, and we celebrated with the trip of a lifetime \u2014 a mini layover in Hong Kong, then on to India where I met her parents and her family. We did the classic 18-hour Indian train ride. We did so much wedding shopping that I now know more about women\u2019s clothing and cut styles than any man probably should. It was chaotic, exhausting, and absolutely perfect.",
      },
      {
        id: "forever",
        year: "2026",
        title: "Forever Begins",
        body: "And now here we are. Two people who started with chocolate biryani jokes and thrift store arguments, building a life together. This isn\u2019t the end of the story \u2014 it\u2019s just where the best part starts.",
      },
    ],
    closing:
      "From chocolate biryani to forever \u2014 we cannot wait to celebrate with you.",
  },
  sarrah: {
    subtitle: "As told by Sarrah",
    description:
      "My version of events. He\u2019ll say it went differently. He\u2019s wrong.",
    quote:
      "Life is short. Dance more. Pet every cat you meet. Marry the one who lets you do both.",
    quoteAttribution: "Sarrah",
    chapters: [
      {
        id: "lorem-ipsum",
        year: "Coming Soon",
        title: "Lorem Ipsum",
        body: "To fill the emptiness.",
      },
    ],
    closing:
      "Her side of the story is still being written \u2014 check back soon.",
  },
};

function TimelineEntry({
  year,
  title,
  body,
  align,
}: {
  year: string;
  title: string;
  body: string;
  align: "left" | "right";
}) {
  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-start">
      <div
        className={
          align === "left"
            ? "text-right"
            : "text-right opacity-0 pointer-events-none"
        }
      >
        {align === "left" && (
          <>
            <p className="text-xs tracking-[0.4em] uppercase text-accent font-body mb-2">
              {year}
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-light text-foreground mb-3 leading-snug">
              {title}
            </h3>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-body max-w-sm ml-auto">
              {body}
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-accent/60 border-2 border-background ring-2 ring-accent/20" />
        <div className="w-px flex-1 bg-border/60 min-h-[80px]" />
      </div>

      <div
        className={
          align === "right"
            ? "text-left"
            : "text-left opacity-0 pointer-events-none"
        }
      >
        {align === "right" && (
          <>
            <p className="text-xs tracking-[0.4em] uppercase text-accent font-body mb-2">
              {year}
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-light text-foreground mb-3 leading-snug">
              {title}
            </h3>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-body max-w-sm">
              {body}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function OurStoryClient() {
  const [narrator, setNarrator] = useState<Narrator>("murtaza");
  const story = stories[narrator];

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center py-32 md:py-44 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-cream/50 via-background to-background" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.5em] uppercase text-accent font-body mb-6 animate-fade-in">
            {story.subtitle}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-foreground animate-fade-up delay-100">
            Our Story
          </h1>

          {/* Narrator toggle */}
          <div className="mt-8 flex items-center justify-center gap-1 bg-cream/60 p-1 rounded-full w-fit mx-auto">
            <button
              onClick={() => setNarrator("murtaza")}
              className={`px-5 py-2 text-[11px] tracking-[0.25em] uppercase font-body rounded-full transition-all duration-300 cursor-pointer ${
                narrator === "murtaza"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-text-secondary hover:text-foreground"
              }`}
            >
              Murtaza
            </button>
            <button
              onClick={() => setNarrator("sarrah")}
              className={`px-5 py-2 text-[11px] tracking-[0.25em] uppercase font-body rounded-full transition-all duration-300 cursor-pointer ${
                narrator === "sarrah"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-text-secondary hover:text-foreground"
              }`}
            >
              Sarrah
            </button>
          </div>

          <div className="mt-8 w-24 h-px bg-accent/40 mx-auto" />
          <p className="mt-8 text-base md:text-lg text-text-secondary leading-relaxed font-body max-w-xl mx-auto">
            {story.description}
          </p>
        </div>
      </section>

      {/* Opening quote */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-snug text-center italic">
          &ldquo;{story.quote}&rdquo;
        </blockquote>
        <p className="text-center text-xs tracking-[0.3em] uppercase text-text-secondary font-body mt-6">
          &mdash; {story.quoteAttribution}
        </p>
      </section>

      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-4 pb-20">
        <div className="w-16 h-px bg-border" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
        <div className="w-16 h-px bg-border" />
      </div>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-6 pb-32">
        <div className="flex flex-col">
          {story.chapters.map((chapter, i) => (
            <TimelineEntry
              key={chapter.id}
              year={chapter.year}
              title={chapter.title}
              body={chapter.body}
              align={i % 2 === 0 ? "right" : "left"}
            />
          ))}
          <div className="flex justify-center">
            <div className="w-4 h-4 rounded-full bg-accent/30 border-2 border-accent/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* Closing section */}
      <section className="bg-linear-to-b from-background via-cream/30 to-background py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-snug">
            {story.closing}
          </p>
          <div className="mt-10 w-24 h-px bg-accent/40 mx-auto" />
          <p className="mt-10 text-sm tracking-[0.3em] uppercase text-accent font-body">
            October 20, 2026
          </p>
        </div>
      </section>
    </div>
  );
}
