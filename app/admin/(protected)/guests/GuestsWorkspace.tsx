"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import {
  AddFamilyForm,
  CreatedFamilyLinks,
  type CreatedFamily,
} from "./AddFamilyForm";
import {
  GuestRoster,
  type FamilyWithGuests,
  type SideFilter,
} from "./GuestRoster";
import { Button } from "@/app/shared/Button";

export function GuestsWorkspace({
  brideFamilies,
  groomFamilies,
}: {
  brideFamilies: FamilyWithGuests[];
  groomFamilies: FamilyWithGuests[];
}) {
  const [formOpen, setFormOpen] = useState(true);
  const [focusNonce, setFocusNonce] = useState(0);
  const [created, setCreated] = useState<CreatedFamily[]>([]);
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState<SideFilter>("ALL");
  const [openFamilyIds, setOpenFamilyIds] = useState<Set<number>>(new Set());
  const [showFab, setShowFab] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const rosterRef = useRef<HTMLDivElement>(null);

  const isEmpty = brideFamilies.length === 0 && groomFamilies.length === 0;

  // The floating button only earns its place once the form is off-screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFab(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function onCreated(family: CreatedFamily) {
    setCreated((current) => [family, ...current]);
    // A lingering "#41" from an earlier jump would hide what was just created.
    setSearch("");
  }

  function jumpToFamily(id: number) {
    setSearch(`#${id}`);
    // An opposing side filter would otherwise swallow the jump entirely.
    setSideFilter("ALL");
    setOpenFamilyIds((current) => new Set(current).add(id));
    // The lone result sits right below the form, so only nudge if it is
    // actually out of view — no full-page travel.
    requestAnimationFrame(() => {
      const roster = rosterRef.current;
      if (!roster) return;
      const { top } = roster.getBoundingClientRect();
      if (top < 0 || top > window.innerHeight)
        roster.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openFormFromFab() {
    setFormOpen(true);
    setFocusNonce((n) => n + 1);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="mb-12 border-t border-b border-border/40 py-6"
      >
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <p className="text-[10px] tracking-[0.3em] uppercase text-text-secondary font-body">
            New family
          </p>
          <Button
            variant="ghost"
            aria-expanded={formOpen}
            aria-controls="new-family-form"
            onClick={() => setFormOpen((v) => !v)}
          >
            {formOpen ? "Hide form" : "+ New family"}
          </Button>
        </div>
        {formOpen && (
          <p className="text-xs text-text-secondary font-body italic mb-5 leading-relaxed">
            Add the family and everyone in it in one go. Emails are optional —
            guests can fill them in themselves later.
          </p>
        )}
        <div id="new-family-form">
          <AddFamilyForm
            open={formOpen}
            onCreated={onCreated}
            focusNonce={focusNonce}
          />
        </div>
        <CreatedFamilyLinks created={created} onJump={jumpToFamily} />
      </section>

      <div ref={rosterRef}>
        {isEmpty ? (
          <p className="text-sm text-text-secondary font-body italic">
            No families yet — start by adding one above.
          </p>
        ) : (
          <GuestRoster
            brideFamilies={brideFamilies}
            groomFamilies={groomFamilies}
            search={search}
            onSearchChange={setSearch}
            sideFilter={sideFilter}
            onSideFilterChange={setSideFilter}
            openFamilyIds={openFamilyIds}
            onOpenFamilyIdsChange={setOpenFamilyIds}
          />
        )}
      </div>

      {showFab && (
        <button
          type="button"
          onClick={openFormFromFab}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 bg-foreground text-background text-[10px] tracking-[0.3em] uppercase font-body shadow-lg hover:bg-accent transition-colors cursor-pointer"
        >
          <Plus size={14} strokeWidth={1.5} />
          New family
        </button>
      )}
    </>
  );
}
