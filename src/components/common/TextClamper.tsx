"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TextClamperProps {
  text: string;
  TextContainerClassName: string;
}

export default function TextClamper({
  text,
  TextContainerClassName,
}: TextClamperProps) {
  const [isClamped, setIsClamped] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTextOverflow = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        setShowButton(scrollHeight > clientHeight);
      }
    };

    checkTextOverflow();
    window.addEventListener("resize", checkTextOverflow);

    return () => {
      window.removeEventListener("resize", checkTextOverflow);
    };
  }, [text]);

  const toggleClamp = () => {
    setIsClamped(!isClamped);
  };

  return (
    <div className={cn(TextContainerClassName)}>
      <p
        ref={textRef}
        className={`${isClamped ? "line-clamp-2" : ""} text-muted-foreground`}
      >
        {text}
      </p>
      {showButton && (
        <Button
          variant="link"
          onClick={toggleClamp}
          className="mt-2 p-0 h-auto font-semibold text-orange-600 hover:text-orange-800"
        >
          {isClamped ? "See More" : "See Less"}
        </Button>
      )}
    </div>
  );
}
