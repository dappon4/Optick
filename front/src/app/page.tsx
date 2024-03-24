'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import base from "./svgs.css";
import { Button } from "@/components/ui/button";
import  { useEffect, useState } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import axios from 'axios';
import { Badge } from "@/components/ui/badge"

const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
];

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};


const A = () => {
  const quote = getRandomQuote();

  const [suggestions, setSuggestions] = useState(null);

  const fetchSuggestions = async () => {
      if (suggestions === null) {
          try {
              // biome-ignore lint/complexity/useLiteralKeys: <explanation>
              const response = await axios.get('http://167.71.172.236:5000/get-suggestions', {
                  headers: {
                      'Content-Type': 'application/json', // Use JSON content type for Base64 data
                  },
              });

              console.log(JSON.parse(response.data));

              setSuggestions(response.data)
          } catch (error) {
              console.error('Error uploading file:', error);
              fetchSuggestions();
          }
      }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div>
        <h1 className="text-4xl font-semibold mb-8 text-center text-green-900">Hey!</h1>
        <p className="text-lg italic mb-8 text-center text-gray-800">{quote}</p>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className={`${base.bgLeft} flex items-center justify-center w-1/2 h-full`}>
          <Image src="/ice_cream.svg" height={480} width={480} alt="" />
          <div className="ml-4">
            <Link href="/tracker">
              <Button className="bg-[#228B22] w-48 h-12 ">Add to Stomach!</Button>
            </Link>
          </div>
        </div>
        <Sheet>
                <SheetTrigger>
                    <Button onClick={() => fetchSuggestions()} className="bg-[#228B22]">
                        Suggest Recipes!
                    </Button>
                </SheetTrigger>
                <SheetContent className="w-144" side="left">
                    <SheetHeader>
                        <SheetTitle>Recipes Based on Your Inventory:</SheetTitle>
                    </SheetHeader>
                    {suggestions === null ? <div className="flex mb-4">
                        <div className="dots-loading" />
                    </div> : (<>{Object.keys(JSON.parse(suggestions)).map((key: string, i: number) => {
                        return (<div>
                            <h1 className="font-bold text-[#228B22] mb-2">{i + 1}. {JSON.parse(suggestions)[key].name}</h1>
                            <div className="flex flex-wrap">
                                {JSON.parse(suggestions)[key].ingredients.map((ing: any) => {
                                    return (<Badge className="m-2" variant="outline">{ing.name}, {ing.quantity}</Badge>)
                                })}
                            </div>
                            <div className="flex flex-col space-y-2 my-2">
                                {JSON.parse(suggestions)[key].instructions.map((step: string) => <p>{step}</p>)}
                            </div>
                        </div>)
                    })}</>)}
                </SheetContent>
            </Sheet>
        <div className={`${base.bgRight} flex items-center justify-center w-1/2 h-full`}>
          <div className="ml-4 mr-4">
            <Link href="/meal">
              <Button className="bg-[#228B22] w-48 h-12">Add to Inventory!</Button>
            </Link>
          </div>
          <Image src="/tea.svg" height={480} width={480} alt="" />
        </div>
        
      </div>
    </div>
  );
};

export default A;
