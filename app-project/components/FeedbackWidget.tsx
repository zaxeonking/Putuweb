"use client";

import { useState, FormEvent } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import { IconCheckCircle, IconMessageSquare, IconSend, IconX } from "./icons";

type Status = "idle" | "submitting" | "success";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);

  function resetAndClose() {
    setIsOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setRating(0);
      setComment("");
      setName("");
    }, 300);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please choose a star rating before submitting.");
      return;
    }
    if (!comment.trim()) {
      setError("Let us know a bit more in the comment field.");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, name, honeypot: company }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      toast.success("Thanks for the feedback!");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-3 w-80 rounded-xl border border-ink-100 bg-white p-5 shadow-lg sm:w-96">
          {status === "success" ? (
            <div className="flex flex-col items-center py-4 text-center">
              <IconCheckCircle className="h-10 w-10 text-emerald-500" />
              <p className="mt-3 font-display text-base font-semibold text-ink-900">
                Feedback received
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Thank you for helping us improve the site.
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="mt-4 rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-900 hover:text-ink-900"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-base font-semibold text-ink-900">
                  Share your feedback
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close feedback panel"
                  className="rounded p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              <div>
                <span className="block text-sm font-medium text-ink-700">
                  How's your experience with the site?
                </span>
                <div className="mt-1.5">
                  <StarRating value={rating} onChange={setRating} />
                </div>
              </div>

              <div>
                <label htmlFor="feedback-comment" className="block text-sm font-medium text-ink-700">
                  Comments
                </label>
                <textarea
                  id="feedback-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
                  placeholder="Tell us what's working or what could be better..."
                />
              </div>

              <div>
                <label htmlFor="feedback-name" className="block text-sm font-medium text-ink-700">
                  Name <span className="text-ink-400">(optional)</span>
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
                />
              </div>

              {/* Honeypot field, hidden from real users */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="feedback-company">Company</label>
                <input
                  id="feedback-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {error && (
                <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Send feedback"}
                {status !== "submitting" && <IconSend className="h-4 w-4" />}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={clsx(
          "flex items-center gap-2 rounded-full bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-ink-800",
          isOpen && "bg-ink-800"
        )}
      >
        {isOpen ? <IconX className="h-4 w-4" /> : <IconMessageSquare className="h-4 w-4" />}
        <span className="hidden sm:inline">{isOpen ? "Close" : "Feedback"}</span>
      </button>
    </div>
  );
}
