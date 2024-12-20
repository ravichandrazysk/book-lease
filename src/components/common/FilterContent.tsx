/* eslint-disable indent */
"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/AxiosConfig";
import { FilteredSectionSekelton } from "./loaders/FilteredSectionSekelton";

interface CategoryTypes {
  id: 1;
  name: string;
  age: string;
}

interface TagsTypes {
  id: number;
  name: string;
}

interface FilterContentProps {
  onCategoryChange: React.Dispatch<React.SetStateAction<string[]>>;
  onTagChange: React.Dispatch<React.SetStateAction<string[]>>;
  onAgeGroupChange: React.Dispatch<React.SetStateAction<string[]>>;
  checkedCategories: string[];
  checkedTags: string[];
  checkedAgeGroups: string[];
}
export const FilterContent = ({
  onCategoryChange,
  onTagChange,
  onAgeGroupChange,
  checkedCategories,
  checkedTags,
  checkedAgeGroups,
}: FilterContentProps) => {
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [tags, setTags] = useState<TagsTypes[]>([]);
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [openItems, setOpenItems] = useState<string[]>([
    "categories",
    "tags",
    "age-groups",
  ]);
  const [loading, setLoading] = useState({
    categoryLoading: false,
    tagLoading: false,
  });

  const handleClearAll = () => {
    onCategoryChange([]);
    onTagChange([]);
    onAgeGroupChange([]);
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
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading((prev) => ({ ...prev, categoryLoading: true }));
        const response = await axiosInstance.get("/categories");
        if (response.status === 200) {
          setCategories(response.data.data);
          const ages = response.data.data.map((category: CategoryTypes) => {
            return category.age;
          });
          setAgeGroups(ages);
          setLoading((prev) => ({ ...prev, categoryLoading: false }));
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        setLoading((prev) => ({ ...prev, categoryLoading: false }));
        // eslint-disable-next-line no-console
        console.log("categories fetch error", error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading((prev) => ({ ...prev, tagLoading: true }));
        const response = await axiosInstance.get("/tag-list");
        if (response.status === 200) setTags(response.data.data);
        setLoading((prev) => ({ ...prev, tagLoading: false }));
        // eslint-disable-next-line brace-style
      } catch (error) {
        setLoading((prev) => ({ ...prev, tagLoading: false }));
        // eslint-disable-next-line no-console
        console.log("categories fetch error", error);
      }
    };
    fetchTags();
  }, []);
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
              {loading.categoryLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <FilteredSectionSekelton key={index} />
                  ))
                : categories &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={checkedCategories.includes(
                          category.id.toString()
                        )}
                        onCheckedChange={() =>
                          handleCheckboxChange(
                            onCategoryChange,
                            category.id.toString()
                          )
                        }
                        className="data-[state=checked]:bg-[#FF851B]"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
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
              {loading.tagLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <FilteredSectionSekelton key={`tag-skeleton-${index}`} />
                  ))
                : tags &&
                  tags.length > 0 &&
                  tags.map((tag) => (
                    <div
                      key={`tag-${tag.id}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={checkedTags.includes(tag.id.toString())}
                        onCheckedChange={() =>
                          handleCheckboxChange(onTagChange, tag.id.toString())
                        }
                        className="data-[state=checked]:bg-[#FF851B]"
                      />
                      <label
                        htmlFor={`tag-${tag.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tag.name}
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
              {loading.categoryLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <FilteredSectionSekelton key={index} />
                  ))
                : ageGroups &&
                  ageGroups.length > 0 &&
                  ageGroups.map((age) => (
                    <div key={age} className="flex items-center space-x-2">
                      <Checkbox
                        id={age}
                        checked={checkedAgeGroups.includes(age)}
                        onCheckedChange={() =>
                          handleCheckboxChange(onAgeGroupChange, age)
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
