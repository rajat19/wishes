// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts'
import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// import * as twilio from "https://deno.land/x/twilio@0.1.1/Twilio.ts";

const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!
const accountSid: string | undefined = Deno.env.get("TWILIO_ACCOUNT_SID");
const authToken: string | undefined = Deno.env.get("TWILIO_AUTH_TOKEN");
const fromNumber: string = "whatsapp:+14155238886";
const toNumber: string = "whatsapp:+919910364830";
const pool = new postgres.Pool(databaseUrl, 3, true);

serve(async (req) => {
  if (!accountSid || !authToken) {
    console.log(
      "Your Twilio account credentials are missing. Please add them.",
    );
    return;
  }

  const url: string = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const encodedCredentials: string = base64.fromUint8Array(
    new TextEncoder().encode(`${accountSid}:${authToken}`),
  );

  try {
    const connection = await pool.connect()
    try {
      const result = await connection.queryObject`SELECT * FROM events`
      const events = result.rows
      console.log(events)
      const today = new Date();
      const todayDate = today.getDate();
      const todayMonth = today.getMonth() + 1;
      events.forEach(async (event) => {
        if (event['day'] === todayDate && event['month'] === todayMonth) {
          let messageBody = `Today is ${event['name']}'s birthday. Wish them a happy birthday`;
          if (!event['is_bday']) {
            messageBody = `Today is ${event['name']}'s anniversary. Wish them a happy anniversary`;
          }

          const twilioRequestBody: URLSearchParams = new URLSearchParams({
            To: toNumber,
            From: fromNumber,
            Body: messageBody
          });

          console.log(url, twilioRequestBody);
        
          const twilioResponse = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Basic ${encodedCredentials}`,
            },
            body: twilioRequestBody,
          });
          console.log(`Response for ${event['name']} is `,twilioResponse)
        } 
      });

      // const body = JSON.stringify(
      //   birthdays,
      //   (key, value) => (typeof value === 'bigint' ? value.toString() : value),
      //   2
      // )

      return new Response(
        JSON.stringify({'message': 'Wished everyone'}), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
    } finally {
      connection.release()
    }
  } catch (err) {
    console.error(err)
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
