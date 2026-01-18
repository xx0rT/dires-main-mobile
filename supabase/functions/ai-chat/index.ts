import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  question: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { question }: RequestBody = await req.json();

    if (!question || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");

    if (!groqApiKey) {
      console.error("GROQ_API_KEY not configured");
      return new Response(
        JSON.stringify({
          answer: "Omlouvám se, AI služba není momentálně dostupná. Zkuste to prosím později."
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const systemPrompt = `Jsi AI asistent specializující se na fyzioterapii a rehabilitaci.
Odpovídáš v češtině profesionálně, srozumitelně a stručně.
Poskytuj praktické rady a informace týkající se fyzioterapie, cvičení, léčby bolesti a rehabilitace.
Pokud se tě někdo zeptá na něco mimo tvou oblast, zdvořile upozorni, že se specializuješ na fyzioterapii.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", errorText);
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const answer = groqData.choices[0]?.message?.content ||
      "Omlouvám se, nepodařilo se mi vygenerovat odpověď.";

    return new Response(
      JSON.stringify({ answer }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    return new Response(
      JSON.stringify({
        answer: "Omlouvám se, došlo k chybě při zpracování vaší otázky. Zkuste to prosím znovu."
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
