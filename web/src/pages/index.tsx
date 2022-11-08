import { useInterval } from "@/hooks/useInterval";
import type { Quote, Word } from "@prisma/client";
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

export default function Home() {
  const query = trpc.content.get.useQuery();

  // useInterval(() => query.refetch(), 3000);

  return (
    <div
      className="w-screen max-w-2xl cursor-pointer p-4 text-lg sm:text-xl lg:text-2xl"
      onClick={() => query.refetch()}
    >
      {!!query.data?.quote && <DisplayQuote quote={query.data.quote} />}
      {!!query.data?.word && <DisplayWord word={query.data.word} />}
      <div className="my-6 flex w-full flex-col items-center opacity-60">
        <span className="text-xs">Viewed {query.data?.queried} times</span>
      </div>
    </div>
  );
}
