import "@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Email Functions!")
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");


Deno.serve(async (req) => {
  const { to, subject, html } = await req.json();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Sarrah & The Dumb Kid Wedding <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
})