import type { Quote, Word } from "@prisma/client";
import { trpc } from "../utils/trpc"

function DisplayQuote({quote}: {quote: Quote}) {
  return <div className="flex flex-col items-center">
    <p>{quote.quote}</p>
    <span className="italic pt-4 font-light">- {quote.source}</span>
  </div>
}

function DisplayWord({word}: {word: Word}) {
  return <div className="flex flex-col items-center">
    <div className="flex flex-row items-center pb-4">
      <span className="font-bold">{word.word}</span>
      <span className="text-sm sm:text-lg italic pl-2">({word.pos})</span>
    </div>
    <span>{word.definition}</span>
  </div>
}

export default function Home() {
  const query = trpc.content.get.useQuery();

  return <div className="text-lg sm:text-xl lg:text-2xl">
    {
      query.data?.type === 'quote' && <DisplayQuote quote={query.data.content as Quote} />
    }{
      query.data?.type === 'word' && <DisplayWord word={query.data?.content as Word} />
    }
  </div>

}