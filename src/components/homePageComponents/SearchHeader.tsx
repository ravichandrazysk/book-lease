/* eslint-disable multiline-ternary */
"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  image: string;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Combo banner one",
    image: "/pngs/combo-books.webp",
  },
  {
    id: "2",
    title: "Combo banner two",
    image: "/pngs/combo-book2.jpg",
  },
  {
    id: "3",
    title: "Combo banner three",
    image: "/pngs/combo-books.webp",
  },
  {
    id: "4",
    title: "Atomic Love Part one",
    image: "/pngs/combo-books.webp",
  },
];

interface SearchHeaderProps {
  onClose: () => void;
}

export function SearchHeader({ onClose }: SearchHeaderProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredResults = React.useMemo(() => {
    if (!query) return mockResults;
    return mockResults.filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center gap-2 px-2 ">
        <div className="flex items-center border w-full border-[#FF851B] min-h-6 rounded-lg p-2">
          <Search className="h-7 w-7 shrink-0 text-[#D9D9D9]" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent p-2 shadow-none focus-visible:ring-0 font-medium text-base text-[#1F2937]"
            placeholder="Search books..."
          />
        </div>
        <Button
          variant="ghost"
          className="h-8 w-8 shrink-0 p-2 border border-[#FF851B] rounded-lg min-h-12 min-w-12"
          onClick={onClose}
        >
          <X className="h-7 w-7" color="#FF851B" />
        </Button>
      </div>
      {query && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border bg-background shadow-lg">
          <div className="max-h-[300px] overflow-auto py-2">
            {filteredResults.length === 0 ? (
              <p className="px-4 py-2 text-sm text-muted-foreground">
                No results found.
              </p>
            ) : (
              <>
                {filteredResults.map((result) => (
                  <button
                    key={result.id}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2 text-left text-sm",
                      "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <Image
                        src={result.image}
                        alt={result.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium">{result.title}</span>
                  </button>
                ))}
                <button
                  className={cn(
                    "w-full px-4 py-2 text-center text-sm font-normal text-[#FF851B]",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  See more
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
