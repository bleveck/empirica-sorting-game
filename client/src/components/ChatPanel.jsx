import { useGame, usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "./Avatar";

export function ChatPanel({ attribute }) {
  const game = useGame();
  const player = usePlayer();
  const players = usePlayers() || [];
  const [messages, setMessages] = useState([...(game.get(attribute) || [])]);
  const [draft, setDraft] = useState("");
  const [mention, setMention] = useState(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const facilitationType = game.get("treatment")?.facilitationType || "none";

  const mentionNames = useMemo(() => {
    const names = players
      .map((p) => p.get("nickname"))
      .filter(Boolean);
    if (facilitationType === "llm" && !names.includes("Facilitator")) {
      names.push("Facilitator");
    }
    return names;
  }, [players, facilitationType]);

  const mentionOptions = useMemo(() => {
    if (!mention) return [];
    const q = mention.query.toLowerCase();
    return mentionNames.filter((name) => name.toLowerCase().startsWith(q));
  }, [mention, mentionNames]);

  useEffect(() => {
    setMentionIndex(0);
  }, [mention?.query]);

  useEffect(() => {
    setMessages([...(game.get(attribute) || [])]);
    const intervalId = setInterval(() => {
      setMessages([...(game.get(attribute) || [])]);
    }, 300);
    return () => clearInterval(intervalId);
  }, [attribute, game]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length]);

  function updateMentionState(value, caretPos) {
    const uptoCaret = value.slice(0, caretPos);
    const at = uptoCaret.lastIndexOf("@");
    if (at < 0) {
      setMention(null);
      return;
    }
    const between = uptoCaret.slice(at + 1);
    if (/\s/.test(between)) {
      setMention(null);
      return;
    }
    if (at > 0 && /[^\s([{]/.test(uptoCaret[at - 1])) {
      setMention(null);
      return;
    }
    const query = between.replace(/^\[/, "").replace(/[^\w-].*$/, "");
    setMention({ at, query });
  }

  function insertMention(name) {
    if (!mention || !inputRef.current) return;
    const value = draft;
    const caret = inputRef.current.selectionStart || value.length;
    const prefix = value.slice(0, mention.at);
    const suffix = value.slice(caret);
    const next = `${prefix}@[${name}] ${suffix}`;
    setDraft(next);
    setMention(null);
    requestAnimationFrame(() => {
      const nextPos = (prefix + `@[${name}] `).length;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(nextPos, nextPos);
    });
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const chat = game.get(attribute) || [];
    const nextChat = [
      ...chat,
      {
        sender: {
          id: player.id,
          name: player.get("nickname") || player.id,
        },
        text,
      },
    ];
    game.set(attribute, nextChat);
    setMessages(nextChat);
    setDraft("");
    setMention(null);
  }

  function onInputKeyDown(e) {
    if (mentionOptions.length > 0 && (e.key === "Tab" || e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      if (e.key === "Tab") {
        insertMention(mentionOptions[mentionIndex] || mentionOptions[0]);
        return;
      }
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setMentionIndex((idx) => (idx + delta + mentionOptions.length) % mentionOptions.length);
      return;
    }
    if (mentionOptions.length > 0 && e.key === "Enter") {
      e.preventDefault();
      insertMention(mentionOptions[mentionIndex] || mentionOptions[0]);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function renderText(text) {
    return text.split(/(@\[[^\]]+\]|@\w+)/g).map((part, idx) => {
      if (!part) return null;
      if (part.startsWith("@")) {
        return (
          <span key={idx} className="bg-blue-100 text-blue-700 px-1 rounded font-medium">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  }

  return (
    <div className="h-full flex flex-col">
      <div ref={listRef} className="flex-1 overflow-auto pr-1 space-y-2">
        {messages.map((msg, idx) => {
          const name = msg?.sender?.name || msg?.sender?.id || "Unknown";
          const id = msg?.sender?.id || name;
          return (
            <div key={`${id}-${idx}`} className="flex items-start gap-2">
              <div className="h-8 w-8 shrink-0">
                <Avatar name={name} id={id} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-600">{name}</div>
                <div className="text-sm text-gray-800 break-words">{renderText(msg?.text || "")}</div>
              </div>
            </div>
          );
        })}
      </div>
      {mentionOptions.length > 0 && mention ? (
        <div className="mb-2 border rounded bg-white shadow-sm max-h-32 overflow-auto">
          {mentionOptions.map((name, idx) => (
            <button
              key={name}
              type="button"
              className={`w-full text-left px-2 py-1 text-sm ${idx === mentionIndex ? "bg-blue-50 text-blue-700" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                insertMention(name);
              }}
            >
              @{name}
            </button>
          ))}
        </div>
      ) : null}
      <textarea
        ref={inputRef}
        className="w-full border rounded px-2 py-1 text-sm resize-none"
        rows={3}
        placeholder="Type a message… Use @ to mention"
        value={draft}
        onChange={(e) => {
          const value = e.target.value;
          setDraft(value);
          updateMentionState(value, e.target.selectionStart || value.length);
        }}
        onKeyDown={onInputKeyDown}
      />
    </div>
  );
}
