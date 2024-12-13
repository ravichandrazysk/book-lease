"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { User } from "next-auth";

interface CustomUser extends User {
  coins?: number;
}
interface CustomSession extends Session {
  accessToken?: string;
  user?: CustomUser;
}
const Coins = () => {
  const { data: session } = useSession() as { data: CustomSession };
  return (
    <section
      id="coins"
      className="flex flex-col gap-6 md:mr-9 2xl:max-w-5xl my-4 max-md:mx-auto max-sm:w-[345px]"
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-medium text-2xl">
            Earn Coins at Every Turn!
          </CardTitle>
          <CardDescription className="text-[#7A7977]">
            Boost your coin stash at every turn. Your actions make it grow!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex py-4 gap-4 items-center">
            <Image
              src="/pngs/coin.png"
              alt="coin"
              width={80}
              height={80}
              className="sm:h-20 h-16 sm:w-20 w-16"
            />
            <div className="flex flex-col justify-center m-2 ">
              <p className="font-semibold text-2xl">Coins</p>
              <p className="text-[#7A7977] sm:text-xl font-normal">
                Your Available Reward Coins :{" "}
                <span className="text-3xl font-semibold text-[#FF851B]">
                  {session?.user?.coins}
                </span>
              </p>
            </div>
          </div>
          <div className="pt-4">
            <p className="text-xl font-medium mb-6">How it works?</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 ">
              {Array.from({ length: 6 }, (_, index) => (
                <Card key={index} className="flex p-6 ">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/pngs/success.png`} />
                    <AvatarFallback>{`img${index + 1}`}</AvatarFallback>
                  </Avatar>
                  <CardHeader className="py-0">
                    <CardTitle className="font-medium">{`Card Title ${index + 1}`}</CardTitle>
                    <CardDescription>{`This is the description for card ${index + 1}. This is the description for card ${index + 1}.`}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Coins;
