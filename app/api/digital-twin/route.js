import OpenAI from "openai";
import { NextResponse } from "next/server";

import { DIGITAL_TWIN_CONTEXT } from "../../lib/digitalTwinContext";

export const runtime = "nodejs";

const MODEL = "gpt-5.4-mini";
const MAX_HISTORY_MESSAGES = 14;

const SYSTEM_PROMPT = `
You are the Digital Twin of Ayush Verma.

Rules:
1. Answer in first person as Ayush.
2. Keep responses concise, polished, and professional.
3. Use only the profile context provided below.
4. If a detail is not in context, clearly say you do not have that detail in your current profile context.
5. Do not fabricate numbers, dates, company names, or credentials.
6. If asked for career advice, provide advice in Ayush's voice based on the profile context.

Profile context:
${DIGITAL_TWIN_CONTEXT}
`;

function getApiKey() {
  return (
    process.env.OPENAI_API_KEY ||
    process.env.Openai_api_key ||
    process.env.openai_api_key ||
    ""
  );
}

function latestUserQuestion(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === "user") {
      return messages[index].content;
    }
  }
  return "";
}

function createLocalTwinReply(question) {
  const query = (question || "").toLowerCase();

  if (query.includes("noon") || query.includes("gmv") || query.includes("attribution")) {
    return "At noon, I led growth and strategy analytics across product, marketing, onsite, and commercial levers. I built a GMV first-touch attribution model to clarify channel impact, ran daily standups to track trends and campaign issues, and supported high-velocity execution against daily GMV targets above 20 million USD.";
  }

  if (query.includes("mdm") || query.includes("governance") || query.includes("purview")) {
    return "I have worked deeply on MDM and data governance foundations, including golden-record design, matching and survivorship logic, stewardship workflows, CDE definition, and data quality design. I also expanded implementation-oriented governance capability through Microsoft Purview and enterprise cataloging practices.";
  }

  if (query.includes("course") || query.includes("certification") || query.includes("learn")) {
    return "Recent structured learning includes AI Coder (Vibe Coder to Agentic Engineer), AI Leader (GenAI and Agentic AI for Leaders and Founders), Microsoft Copilot Studio, and Microsoft Purview. These complement my practical delivery background across strategy, analytics, governance, and AI execution.";
  }

  if (query.includes("project") || query.includes("side")) {
    return "A key side project I developed is a football performance analytics concept using mobile video and computer vision. It combines player tracking and metric extraction ideas with product thinking, benchmark scorecards, and coaching-oriented insights.";
  }

  if (query.includes("skill") || query.includes("strength")) {
    return "My strongest areas are data strategy and governance, MDM, AI use case design, analytics leadership, and cross-functional execution. I bridge executive strategy with practical implementation in tools like Power BI, SQL, Copilot Studio, and governance platforms.";
  }

  if (query.includes("summary") || query.includes("career") || query.includes("journey")) {
    return "I am a data and AI transformation leader with 10+ years across government and commercial sectors. My journey spans analytics, growth strategy, governance, and MDM delivery, with leadership roles at Contango, Silal, right farm/Namshi, and noon. I focus on turning complex data and AI opportunities into measurable business outcomes.";
  }

  return "I am a data, strategy, and AI transformation leader with experience across governance, MDM, analytics, and growth. Ask me about specific roles, achievements, projects, or capability areas and I can answer from my profile context.";
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((item) => item && (item.role === "user" || item.role === "assistant"))
    .map((item) => ({
      role: item.role,
      content:
        typeof item.content === "string"
          ? item.content.trim().slice(0, 4000)
          : "",
    }))
    .filter((item) => item.content.length > 0)
    .slice(-MAX_HISTORY_MESSAGES);
}

function extractText(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  if (!Array.isArray(response?.output)) {
    return "";
  }

  const chunks = [];
  for (const item of response.output) {
    if (!Array.isArray(item?.content)) {
      continue;
    }
    for (const part of item.content) {
      if (typeof part?.text === "string" && part.text.trim()) {
        chunks.push(part.text.trim());
      }
    }
  }

  return chunks.join("\n").trim();
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const chatMessages = normalizeMessages(payload?.messages);
  if (chatMessages.length === 0) {
    return NextResponse.json(
      { error: "At least one user message is required." },
      { status: 400 },
    );
  }

  const question = latestUserQuestion(chatMessages);
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({
      reply: createLocalTwinReply(question),
      model: "local-profile-fallback",
      fallback: true,
      warning: "OPENAI key not found, using local profile fallback mode.",
    });
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create({
      model: MODEL,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatMessages,
      ],
    });

    const reply = extractText(response);
    if (!reply) {
      return NextResponse.json({
        reply: createLocalTwinReply(question),
        model: "local-profile-fallback",
        fallback: true,
        warning: "OpenAI returned an empty response, using local profile fallback mode.",
      });
    }

    return NextResponse.json({ reply, model: MODEL });
  } catch (error) {
    const providerCode = error?.code || error?.error?.code;
    if (providerCode === "insufficient_quota") {
      return NextResponse.json({
        reply: createLocalTwinReply(question),
        model: "local-profile-fallback",
        fallback: true,
        warning:
          "OpenAI quota exceeded for the configured API key, switched to local profile fallback mode.",
      });
    }

    if (providerCode === "model_not_found") {
      return NextResponse.json({
        reply: createLocalTwinReply(question),
        model: "local-profile-fallback",
        fallback: true,
        warning: `Model ${MODEL} is unavailable for this key, switched to local profile fallback mode.`,
      });
    }

    return NextResponse.json({
      reply: createLocalTwinReply(question),
      model: "local-profile-fallback",
      fallback: true,
      warning:
        error?.error?.message ||
        error?.message ||
        "Digital Twin request failed in OpenAI mode, switched to local profile fallback mode.",
    });
  }
}
