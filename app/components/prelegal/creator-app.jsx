"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { prelegalApi } from "../../lib/prelegal-api";
import { downloadPrelegalPdf } from "../../lib/prelegal-pdf";

export default function PrelegalCreatorApp() {
  const router = useRouter();

  const [email, setEmail] = useState(null);
  const [state, setState] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const prevDisabledRef = useRef(false);

  const refreshDrafts = useCallback(async () => {
    try {
      const list = await prelegalApi.listDrafts();
      setDrafts(list);
    } catch {
      // drafts list is auxiliary, ignore list failures
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [me, initial] = await Promise.all([
          prelegalApi.me(),
          prelegalApi.chatState(),
        ]);
        setEmail(me.email);
        setState(initial);
        await refreshDrafts();
      } catch {
        router.replace("/ai-projects/prelegal/login?next=/ai-projects/prelegal/creator");
      }
    })();
  }, [router, refreshDrafts]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state?.messages?.length]);

  useEffect(() => {
    const disabled = sending || busy;
    if (prevDisabledRef.current && !disabled) {
      textareaRef.current?.focus();
    }
    prevDisabledRef.current = disabled;
  }, [sending, busy]);

  async function send() {
    const content = draft.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);
    const previous = state;

    setState((current) =>
      current
        ? {
            ...current,
            messages: [...current.messages, { role: "user", content }],
          }
        : current,
    );
    setDraft("");

    try {
      const next = await prelegalApi.chatSend(content);
      setState(next);
      await refreshDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      if (previous) setState(previous);
      setDraft(content);
    } finally {
      setSending(false);
    }
  }

  async function resetActive() {
    if (
      !window.confirm("Start over on this draft? This clears the conversation and fields.")
    ) {
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const next = await prelegalApi.chatReset();
      setState(next);
      await refreshDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  async function createNewDraft() {
    setBusy(true);
    setError(null);
    try {
      const next = await prelegalApi.createDraft();
      setState(next);
      await refreshDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create draft");
    } finally {
      setBusy(false);
    }
  }

  async function selectDraft(id) {
    if (state?.draft_id === id) return;

    setBusy(true);
    setError(null);
    try {
      const next = await prelegalApi.activateDraft(id);
      setState(next);
      await refreshDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to switch draft");
    } finally {
      setBusy(false);
    }
  }

  function startRename(draftSummary) {
    setRenamingId(draftSummary.id);
    setRenameTitle(draftSummary.title);
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameTitle("");
  }

  async function commitRename() {
    if (renamingId === null) return;

    const id = renamingId;
    const trimmed = renameTitle.trim();
    if (!trimmed) {
      cancelRename();
      return;
    }

    try {
      await prelegalApi.renameDraft(id, trimmed);
      if (state?.draft_id === id) {
        setState({ ...state, title: trimmed });
      }
      await refreshDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rename failed");
    } finally {
      cancelRename();
    }
  }

  async function removeDraft(id) {
    if (!window.confirm("Delete this draft? This cannot be undone.")) return;

    setBusy(true);
    setError(null);
    try {
      await prelegalApi.deleteDraft(id);
      const next = await prelegalApi.chatState();
      setState(next);
      await refreshDrafts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!state?.is_complete) return;
    downloadPrelegalPdf(state.sections, state.filename_slug || "document");
  }

  async function logout() {
    try {
      await prelegalApi.logout();
    } finally {
      router.replace("/ai-projects/prelegal/login");
    }
  }

  if (!email || !state) {
    return (
      <main className="pl-loading">
        <div className="pl-loading-inline">
          <Spinner />
          <span>Loading your drafts...</span>
        </div>
      </main>
    );
  }

  const subtitle = state.document_name
    ? `Filling in your ${state.document_name} via chat.`
    : "Describe what you need and the assistant will pick the right template.";

  return (
    <main className="pl-creator-shell">
      <header className="pl-creator-topbar">
        <div className="pl-creator-topbar-inner">
          <Link href="/ai-projects/prelegal" className="pl-logo-link">
            LexDraft
          </Link>
          <div className="pl-creator-topbar-actions">
            <span className="pl-user-email">{email}</span>
            <button onClick={logout} className="pl-btn-muted pl-btn-signout">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="pl-creator-grid">
        <DraftsSidebar
          drafts={drafts}
          activeId={state.draft_id}
          busy={busy}
          renamingId={renamingId}
          renameTitle={renameTitle}
          onNew={createNewDraft}
          onSelect={selectDraft}
          onStartRename={startRename}
          onCancelRename={cancelRename}
          onCommitRename={commitRename}
          onRenameTitleChange={setRenameTitle}
          onDelete={removeDraft}
        />

        <ChatPane
          title={state.title}
          subtitle={subtitle}
          messages={state.messages}
          scrollRef={scrollRef}
          textareaRef={textareaRef}
          draft={draft}
          onDraftChange={setDraft}
          onSend={send}
          onReset={resetActive}
          sending={sending}
          busy={busy}
          error={error}
        />

        <PreviewPane state={state} onDownload={download} />
      </div>
    </main>
  );
}

function DraftsSidebar({
  drafts,
  activeId,
  busy,
  renamingId,
  renameTitle,
  onNew,
  onSelect,
  onStartRename,
  onCancelRename,
  onCommitRename,
  onRenameTitleChange,
  onDelete,
}) {
  return (
    <aside className="pl-pane pl-drafts-pane">
      <div className="pl-pane-head">
        <span className="pl-pane-kicker">Drafts</span>
        <button onClick={onNew} disabled={busy} className="pl-btn-primary pl-btn-small">
          <PlusIcon />
          New
        </button>
      </div>

      <ul className="pl-drafts-list">
        {drafts.length === 0 ? (
          <li className="pl-empty-state">No drafts yet.</li>
        ) : null}

        {drafts.map((draftItem) => {
          const isActive = draftItem.id === activeId;
          const isRenaming = renamingId === draftItem.id;
          const subline = draftItem.document_name ?? "No document selected";
          const progress =
            draftItem.total_count > 0
              ? `${draftItem.filled_count}/${draftItem.total_count}`
              : "—";

          return (
            <li key={draftItem.id}>
              <div className={`pl-draft-row ${isActive ? "is-active" : ""}`}>
                {isRenaming ? (
                  <input
                    autoFocus
                    value={renameTitle}
                    onChange={(event) => onRenameTitleChange(event.target.value)}
                    onBlur={onCommitRename}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") onCommitRename();
                      if (event.key === "Escape") onCancelRename();
                    }}
                    className="pl-rename-input"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(draftItem.id)}
                    className="pl-draft-select"
                  >
                    <div className="pl-draft-main">
                      {isActive ? <span className="pl-active-dot" aria-hidden /> : null}
                      <span className="pl-draft-title">{draftItem.title}</span>
                    </div>
                    <div className="pl-draft-meta">
                      <span className="pl-draft-subline">{subline}</span>
                      <span className="pl-draft-progress">{progress}</span>
                    </div>
                  </button>
                )}

                {!isRenaming ? (
                  <div className="pl-draft-actions">
                    <button onClick={() => onStartRename(draftItem)} className="pl-link-btn">
                      Rename
                    </button>
                    <button
                      onClick={() => onDelete(draftItem.id)}
                      className="pl-link-btn pl-link-danger"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function ChatPane({
  title,
  subtitle,
  messages,
  scrollRef,
  textareaRef,
  draft,
  onDraftChange,
  onSend,
  onReset,
  sending,
  busy,
  error,
}) {
  return (
    <section className="pl-pane pl-chat-pane" aria-label="Chat">
      <div className="pl-pane-head pl-chat-head">
        <div className="pl-chat-head-copy">
          <h2 className="pl-pane-title">{title}</h2>
          <p className="pl-pane-subtitle">{subtitle}</p>
        </div>
        <button
          onClick={onReset}
          disabled={busy || sending}
          className="pl-btn-muted pl-btn-pane-action"
        >
          Start over
        </button>
      </div>

      <div ref={scrollRef} className="pl-chat-log">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {sending ? (
          <div className="pl-typing-row">
            <TypingDots />
            <span>LexDraft is thinking...</span>
          </div>
        ) : null}
      </div>

      {error ? <div className="pl-chat-error">{error}</div> : null}

      <form
        className="pl-chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
      >
        <div className="pl-chat-composer-row">
          <textarea
            ref={textareaRef}
            autoFocus
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            rows={2}
            disabled={sending || busy}
            placeholder="Describe what you need..."
            className="pl-chat-input"
          />
          <button
            type="submit"
            disabled={sending || busy || !draft.trim()}
            className="pl-btn-primary pl-btn-send"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`pl-message-row ${isUser ? "is-user" : "is-assistant"}`}>
      <div className={`pl-message-bubble ${isUser ? "is-user" : ""}`}>
        {message.content}
      </div>
    </div>
  );
}

function PreviewPane({ state, onDownload }) {
  return (
    <section className="pl-pane pl-preview-pane" aria-label="Document preview">
      <div className="pl-pane-head pl-preview-head">
        <div>
          <p className="pl-pane-kicker">Preview</p>
          <h3 className="pl-pane-title">
            {state.document_name ?? "No document selected"}
          </h3>
        </div>
        <DownloadButton state={state} onClick={onDownload} />
      </div>

      <div className="pl-preview-body">
        {state.is_complete ? (
          <DocumentView sections={state.sections} />
        ) : state.document_type_id ? (
          <CollectingState
            docName={state.document_name ?? "your document"}
            filled={state.filled_count}
            total={state.total_count}
            fields={state.field_specs}
          />
        ) : (
          <SelectionState />
        )}
      </div>
    </section>
  );
}

function DownloadButton({ state, onClick }) {
  const remaining = state.total_count - state.filled_count;
  const title = state.is_complete
    ? "Download your document"
    : state.document_type_id
      ? `${remaining} more ${remaining === 1 ? "field" : "fields"} needed`
      : "Choose a document first";

  return (
    <button
      onClick={onClick}
      disabled={!state.is_complete}
      title={title}
      className={`pl-btn-primary pl-btn-download ${state.is_complete ? "" : "is-disabled"}`}
    >
      <DownloadIcon />
      Download PDF
    </button>
  );
}

function DocumentView({ sections }) {
  return (
    <article className="pl-doc">
      {sections.map((section, index) => (
        <section key={`${section.heading}-${index}`} className="pl-doc-section">
          {index === 0 ? (
            <h1 className="pl-doc-title">{section.heading}</h1>
          ) : (
            <h2 className="pl-doc-heading">{section.heading}</h2>
          )}
          <div className="pl-doc-paragraphs">
            {section.body.map((paragraph, itemIndex) => (
              <p key={`${section.heading}-${itemIndex}`}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}

function SelectionState() {
  return (
    <div className="pl-empty-panel">
      <DocumentOutlineIcon />
      <h3>Your document will appear here</h3>
      <p>
        Tell LexDraft which document you need, or describe the situation in your
        own words. The assistant will pick a template and guide each field.
      </p>
    </div>
  );
}

function CollectingState({ docName, filled, total, fields }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const remaining = total - filled;

  return (
    <div className="pl-collecting">
      <h3>Filling in your {docName}</h3>
      <p>
        {remaining === 0
          ? "All fields collected. Your draft is now ready."
          : `Answer the remaining ${remaining === 1 ? "question" : "questions"} in chat.`}
      </p>

      <div className="pl-progress-meta">
        <span>
          {filled} of {total} fields
        </span>
        <span>{pct}%</span>
      </div>
      <div className="pl-progress-track" role="progressbar" aria-valuenow={filled} aria-valuemin={0} aria-valuemax={total}>
        <div className="pl-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <ul className="pl-fields-list">
        {fields.map((field) => (
          <li key={field.name}>
            <span className={`pl-check-pill ${field.filled ? "is-filled" : ""}`}>
              {field.filled ? <CheckIcon /> : null}
            </span>
            <span className={`pl-field-label ${field.filled ? "is-filled" : ""}`}>
              {field.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="pl-icon-sm">
      <path d="M10 4a.75.75 0 0 1 .75.75V9.25h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 10 4Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="pl-icon-md">
      <path d="M10 3a.75.75 0 0 1 .75.75v7.69l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V3.75A.75.75 0 0 1 10 3Z" />
      <path d="M3.75 14.5a.75.75 0 0 1 .75.75V17h11v-1.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="pl-icon-xs">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="pl-spinner">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" className="pl-spinner-track" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="pl-typing-dots" aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}

function DocumentOutlineIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      fill="none"
      className="pl-doc-outline"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M18 10h20l10 10v34a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2Z"
        strokeLinejoin="round"
      />
      <path d="M38 10v10h10" strokeLinejoin="round" />
      <path d="M24 30h16M24 38h16M24 46h10" strokeLinecap="round" />
    </svg>
  );
}
