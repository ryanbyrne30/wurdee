import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useRef, useState } from "react";
import { z } from "zod";
import { trpc } from "../utils/trpc";

function QuoteForm({
  setError,
}: {
  setError: Dispatch<SetStateAction<string | null>>;
}) {
  const quoteRef = useRef<HTMLTextAreaElement>(null);
  const sourceRef = useRef<HTMLInputElement>(null);

  const createMutation = trpc.content.addQuote.useMutation();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const quote = quoteRef.current?.value;
    const source = sourceRef.current?.value;
    if (!quote || !source) return setError("Invalid quote or source.");
    createMutation.mutate({ quote, source });
  };

  if (createMutation.isError) setError(createMutation.error.message);
  if (createMutation.isSuccess) {
    alert("Quote created!");
    window.location.replace("/");
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="group">
        <label>Quote</label>
        <textarea ref={quoteRef} placeholder="You know my methods, Watson." />
      </div>
      <div className="group">
        <label>Source</label>
        <input ref={sourceRef} placeholder="Sherlock Holmes" />
      </div>
      <button>Add</button>
    </form>
  );
}

function WordForm({
  setError,
}: {
  setError: Dispatch<SetStateAction<string | null>>;
}) {
  const wordRef = useRef<HTMLInputElement>(null);
  const posRef = useRef<HTMLSelectElement>(null);
  const definitionRef = useRef<HTMLInputElement>(null);
  const partsOfSpeech = ["noun", "verb", "adjective", "adverb"];
  const createMutation = trpc.content.addWord.useMutation();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const word = wordRef.current?.value;
    const pos = posRef.current?.value;
    const definition = definitionRef.current?.value;
    const parsed = z
      .object({
        word: z.string(),
        pos: z.enum(["noun", "verb", "adjective", "adverb"]),
        definition: z.string(),
      })
      .safeParse({ word, pos, definition });
    if (!parsed.success)
      return setError(`Invalid input. ${parsed.error.toString()}`);
    createMutation.mutate(parsed.data);
  };

  if (createMutation.isError) setError(createMutation.error.message);
  if (createMutation.isSuccess) {
    alert("Word created!");
    window.location.replace("/");
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="group">
        <label>Word</label>
        <input ref={wordRef} placeholder="Awesomeness" />
      </div>
      <div className="group">
        <label>Part of speech</label>
        <select ref={posRef}>
          {partsOfSpeech.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="group">
        <label>Definition</label>
        <input ref={definitionRef} placeholder="Me" />
      </div>
      <button>Add</button>
    </form>
  );
}

export default function AddPage() {
  const [state, setState] = useState<string>("quote");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center">
      <span className="italic text-red-500">{error}</span>
      <select onChange={(e) => setState(e.currentTarget.value)}>
        <option value="quote">Quote</option>
        <option value="word">Word</option>
      </select>
      {state === "quote" ? (
        <QuoteForm setError={setError} />
      ) : (
        <WordForm setError={setError} />
      )}
    </div>
  );
}
