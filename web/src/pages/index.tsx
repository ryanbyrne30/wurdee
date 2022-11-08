import type { Content, Quote, Word } from "@prisma/client";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

function DisplayQuote({ quote }: { quote: Quote }) {
  return (
    <div className="flex flex-col items-center">
      <p>{quote.quote}</p>
      <span className="pt-8 font-light italic">- {quote.source}</span>
    </div>
  );
}

function DisplayWord({ word }: { word: Word }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-bold">{word.word}</span>
      <span className="my-2 text-sm italic sm:text-lg">({word.pos})</span>
      <span>{word.definition}</span>
    </div>
  );
}

type ContentType = Content & { quote: Quote | null; word: Word | null };

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [current, setCurrent] = useState<ContentType | null>(null);
  const [next, setNext] = useState<ContentType | null>(null);

  const query = trpc.content.get.useQuery();

  const loadNext = async () => {
    const response = await query.refetch();
    if (response.isSuccess) setNext(response.data);
  };

  const change = async () => {
    setCurrent(next);
    await loadNext();
  };

  useEffect(() => {
    if (!hasMounted && query.data) {
      setHasMounted(true);
      setCurrent(query.data);
      loadNext();
    }
  }, [query.data]);

  return (
    <div
      className="w-screen max-w-2xl cursor-pointer p-4 text-lg sm:text-xl lg:text-2xl"
      onClick={change}
    >
      {!!current?.quote && <DisplayQuote quote={current.quote} />}
      {!!current?.word && <DisplayWord word={current.word} />}
      {!!current && (
        <div className="my-6 flex w-full flex-col items-center opacity-60">
          <span className="text-xs">Viewed {current?.queried} times</span>
        </div>
      )}
    </div>
  );
}
