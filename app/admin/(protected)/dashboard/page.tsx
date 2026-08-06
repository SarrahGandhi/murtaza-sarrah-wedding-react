import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusIcon } from "@/app/shared/StatusIcon";
import type { GuestSide } from "@/lib/types";

type SideTally = { families: number; guests: number };

type EventTally = {
  invited: number;
  pending: number;
  accepted: number;
  declined: number;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  // Rows rather than head-only counts: the per-side breakdown needs each
  // family's side and each guest's family, and a wedding roster is small.
  const [
    { data: familyRows },
    { data: guestRows },
    { data: events },
    { data: rsvps },
  ] = await Promise.all([
    supabase.from("guest_families").select("id, side"),
    supabase.from("guests").select("family_id"),
    supabase
      .from("events")
      .select("id, name, date, time")
      .order("date", { ascending: true })
      .order("time", { ascending: true }),
    supabase.from("event_guests_rsvp").select("event_id, rsvp_status"),
  ]);

  const guests = guestRows?.length ?? 0;
  const families = familyRows?.length ?? 0;

  const sideOfFamily = new Map<number, GuestSide>();
  const bySide: Record<GuestSide, SideTally> = {
    BRIDE: { families: 0, guests: 0 },
    GROOM: { families: 0, guests: 0 },
  };
  for (const f of familyRows ?? []) {
    sideOfFamily.set(f.id, f.side);
    bySide[f.side].families += 1;
  }
  for (const g of guestRows ?? []) {
    const side = g.family_id === null ? undefined : sideOfFamily.get(g.family_id);
    if (side) bySide[side].guests += 1;
  }

  const tallyByEvent = new Map<number, EventTally>();
  for (const r of rsvps ?? []) {
    const tally =
      tallyByEvent.get(r.event_id) ??
      ({ invited: 0, pending: 0, accepted: 0, declined: 0 } satisfies EventTally);
    tally.invited += 1;
    if (r.rsvp_status === "PENDING") tally.pending += 1;
    else if (r.rsvp_status === "ACCEPTED") tally.accepted += 1;
    else if (r.rsvp_status === "DECLINED") tally.declined += 1;
    tallyByEvent.set(r.event_id, tally);
  }

  const cards = [
    {
      label: "Roster",
      count: guests,
      sub: `${families} ${families === 1 ? "family" : "families"}`,
      breakdown: [
        { label: "Bride's side", tally: bySide.BRIDE },
        { label: "Groom's side", tally: bySide.GROOM },
      ],
      href: "/admin/guests",
      roman: "I",
    },
    {
      label: "Events",
      count: events?.length ?? 0,
      sub: null,
      breakdown: null,
      href: "/admin/events",
      roman: "II",
    },
  ];

  return (
    <div className="animate-fade-up">
      <header className="mb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-body mb-3">
          The Ledger
        </p>
        <h1 className="font-display italic text-5xl md:text-6xl font-light text-foreground leading-none">
          Overview.
        </h1>
        <div className="mt-5 w-12 h-px bg-accent/40" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40 border border-border/40">
        {cards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className={`group bg-warm-white p-7 flex flex-col gap-6 hover:bg-cream/40 transition-colors animate-fade-up delay-${(i + 1) * 100}`}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-display italic text-sm text-text-secondary">
                {card.roman}.
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-text-secondary font-body">
                {card.label}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="font-display text-6xl font-light leading-none tabular-nums text-foreground">
                  {card.count}
                </span>
                {card.sub && (
                  <span className="mt-2 text-[10px] tracking-[0.25em] uppercase font-body text-muted tabular-nums">
                    {card.sub}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-body text-text-secondary group-hover:text-accent transition-colors">
                Manage &rarr;
              </span>
            </div>
            {card.breakdown && (
              <dl className="mt-auto border-t border-border/40 pt-4 flex flex-col gap-2">
                {card.breakdown.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 text-[10px] tracking-[0.25em] uppercase font-body"
                  >
                    <dt className="text-text-secondary">{row.label}</dt>
                    <dd className="text-muted tabular-nums">
                      {row.tally.families}{" "}
                      {row.tally.families === 1 ? "family" : "families"} ·{" "}
                      {row.tally.guests}{" "}
                      {row.tally.guests === 1 ? "guest" : "guests"}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Link>
        ))}
      </div>

      <section className="mt-12 animate-fade-up delay-300">
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display italic text-sm text-text-secondary">
              III.
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-secondary font-body">
              Replies by event
            </span>
          </div>
          <Link
            href="/admin/rsvp"
            className="text-[10px] tracking-[0.25em] uppercase font-body text-text-secondary hover:text-accent transition-colors"
          >
            Manage &rarr;
          </Link>
        </div>

        {!events || events.length === 0 ? (
          <p className="text-sm text-text-secondary font-body italic">
            No events yet — add one from the Events chapter to begin sending
            invitations.
          </p>
        ) : (
          <div className="border border-border/40 bg-border/40 flex flex-col gap-px">
            {events.map((event) => {
              const tally = tallyByEvent.get(event.id) ?? {
                invited: 0,
                pending: 0,
                accepted: 0,
                declined: 0,
              };
              return (
                <Link
                  key={event.id}
                  href="/admin/rsvp"
                  className="group bg-warm-white px-7 py-5 flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 hover:bg-cream/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-display italic text-lg text-foreground">
                      {event.name}
                    </span>
                    <span className="ml-3 text-[10px] tracking-[0.25em] uppercase font-body text-muted tabular-nums">
                      {tally.invited} invited
                    </span>
                  </div>
                  <div className="flex items-baseline gap-5 text-[10px] tracking-[0.25em] uppercase font-body text-text-secondary tabular-nums">
                    <span>
                      <StatusIcon status="ACCEPTED" className="mr-2" />
                      {tally.accepted} accepted
                    </span>
                    <span className={tally.pending > 0 ? "text-accent" : ""}>
                      <StatusIcon status="PENDING" className="mr-2" />
                      {tally.pending} pending
                    </span>
                    <span>
                      <StatusIcon status="DECLINED" className="mr-2" />
                      {tally.declined} declined
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <p className="mt-12 text-xs text-text-secondary font-body italic max-w-prose leading-relaxed">
        A working notebook for the days ahead. Use the chapters above to mind
        the roster of families and their guests, the order of events, and the
        replies still owed.
      </p>
    </div>
  );
}
