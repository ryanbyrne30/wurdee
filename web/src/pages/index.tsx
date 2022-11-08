import { useInterval } from "@/hooks/useInterval";
import type { Quote, Word } from "@prisma/client";
import { trpc } from "../utils/trpc";

function DisplayQuote({ quote }: { quote: Quote }) {
  return (
    <div className="flex flex-col items-center">
      <p>{quote.quote}</p>
      <span className="pt-4 font-light italic">- {quote.source}</span>
    </div>
  );
}

function DisplayWord({ word }: { word: Word }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center pb-4">
        <span className="font-bold">{word.word}</span>
        <span className="pl-2 text-sm italic sm:text-lg">({word.pos})</span>
      </div>
      <span>{word.definition}</span>
    </div>
  );
}

export default function Home() {
  const query = trpc.content.get.useQuery();

  // useInterval(() => query.refetch(), 3000);

  return (
    <div className="text-lg sm:text-xl lg:text-2xl">
      {!!query.data?.quote && <DisplayQuote quote={query.data.quote} />}
      {!!query.data?.word && <DisplayWord word={query.data.word} />}
    </div>
  );
}
