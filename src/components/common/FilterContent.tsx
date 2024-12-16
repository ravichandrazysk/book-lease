"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const categories = [
  "Comic books",
  "Science Fiction",
  "Literature",
  "Children's Literature",
  "Horror Fiction",
  "Novels",
  "Romantic Poetry",
  "Thriller",
];

const tags = [
  "First Edition",
  "Fantasy",
  "Latest Edition",
  "Action",
  "Suspense",
  "Drama",
];

const ageGroups = [
  "0-5 Years",
  "5-10 Years",
  "10-15 Years",
  "15-20 Years",
  "20-25 Years",
  "25-30 Years",
];
export const FilterContent = () => {
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [checkedAgeGroups, setCheckedAgeGroups] = useState<string[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([
    "categories",
    "tags",
    "age-groups",
  ]);

  const handleClearAll = () => {
    setCheckedCategories([]);
    setCheckedTags([]);
    setCheckedAgeGroups([]);
  };

  const handleCheckboxChange = (
    setChecked: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setChecked((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  return (
    <div className="min-w-[280px] space-y-6 p-4 sm:border min-h-screen sm:rounded-lg overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={handleClearAll}
        >
          Clear all
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="w-full"
      >
        <AccordionItem value="categories">
          <AccordionTrigger className="font-medium text-lg text-[#1F2937]">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={checkedCategories.includes(category)}
                    onCheckedChange={() =>
                      handleCheckboxChange(setCheckedCategories, category)
                    }
                    className="data-[state=checked]:bg-[#FF851B]"
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger className="font-medium text-lg text-[#1F2937]">
            Tags
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag}
                    checked={checkedTags.includes(tag)}
                    onCheckedChange={() =>
                      handleCheckboxChange(setCheckedTags, tag)
                    }
                    className="data-[state=checked]:bg-[#FF851B]"
                  />
                  <label
                    htmlFor={tag}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="age-groups">
          <AccordionTrigger className="font-medium text-lg text-[#1F2937]">
            Age Group
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ageGroups.map((age) => (
                <div key={age} className="flex items-center space-x-2">
                  <Checkbox
                    id={age}
                    checked={checkedAgeGroups.includes(age)}
                    onCheckedChange={() =>
                      handleCheckboxChange(setCheckedAgeGroups, age)
                    }
                    className=" data-[state=checked]:bg-[#FF851B]"
                  />
                  <label
                    htmlFor={age}
                    className="text-sm font-medium text-[#1F2937] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {age}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
