"use client";

import { useEffect, useRef, useState } from "react";

const quickPrompts = [
  "Give me a quick career summary.",
  "What did Ayush lead at noon?",
  "What are Ayush's strongest skills?",
  "Tell me about the MDM and governance project work.",
];

const welcomeMessage =
  "Hi, I am Ayush's Digital Twin. Ask me about career milestones, achievements, projects, and domain expertise.";

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DigitalTwinChat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeMessage,
      createdAt: Date.now(),
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState("");
  const transcriptRef = useRef(null);

  useEffect(() => {
    const element = transcriptRef.current;
    if (!element) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [messages, isSending]);

  async function sendMessage(rawText) {
    const messageText = rawText.trim();
    if (!messageText || isSending) {
      return;
    }

    setNotice("");
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      createdAt: Date.now(),
    };
    const outgoingMessages = [...messages, userMessage];
    setMessages(outgoingMessages);
    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: outgoingMessages,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Unable to connect with Digital Twin.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: payload.reply || "No response received.",
          createdAt: Date.now(),
        },
      ]);

      if (payload.warning) {
        setNotice(payload.warning);
      }
    } catch (requestError) {
      setNotice(requestError.message || "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "I could not process that message right now. Please try again.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(draft);
  }

  return (
    <section className="twin-widget" aria-label="Digital Twin chat widget">
      <div className="twin-widget-head">
        <div className="twin-head-left">
          <span className="twin-orb" aria-hidden="true" />
          <div>
            <p className="twin-title">Digital Twin</p>
            <p className="twin-subtitle">Career intelligence assistant</p>
          </div>
        </div>
        <span className="twin-status">{isSending ? "Thinking" : "Ready"}</span>
      </div>

      <div ref={transcriptRef} className="twin-transcript" role="log" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`twin-row ${
              message.role === "user" ? "twin-row-user" : "twin-row-assistant"
            }`}
          >
            <article className="twin-bubble">
              <p className="twin-bubble-role">
                {message.role === "user" ? "You" : "Ayush Twin"}
              </p>
              <p className="twin-bubble-text">{message.content}</p>
              <time className="twin-time">{formatTime(message.createdAt)}</time>
            </article>
          </div>
        ))}
        {isSending ? (
          <div className="twin-row twin-row-assistant">
            <article className="twin-bubble twin-bubble-typing">
              <p className="twin-bubble-role">Ayush Twin</p>
              <p className="twin-bubble-text">Analyzing your question...</p>
            </article>
          </div>
        ) : null}
      </div>

      <div className="twin-quick-list">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="twin-quick-chip"
            onClick={() => sendMessage(prompt)}
            disabled={isSending}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form className="twin-composer" onSubmit={handleSubmit}>
        <label htmlFor="digital-twin-input" className="sr-only">
          Ask Digital Twin
        </label>
        <textarea
          id="digital-twin-input"
          className="twin-input"
          placeholder="Ask about roles, projects, strategy decisions, or measurable impact..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={2}
          disabled={isSending}
        />
        <button
          type="submit"
          className="twin-send"
          disabled={isSending || !draft.trim()}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>

      <p className="twin-footnote">
        Grounded in profile context. Best for career, skills, and project queries.
      </p>
      {notice ? <p className="twin-notice">{notice}</p> : null}
    </section>
  );
}
