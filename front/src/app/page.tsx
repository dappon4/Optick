// pages/A.js
import React from "react";
import Link from "next/link";
import Image from "next/image";
import base from "./svgs.css";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div>
        <h1 className="text-4xl font-semibold mb-8 text-center text-green-900">Hey Dahong!</h1>
        <p className="text-lg italic mb-8 text-center text-gray-800">{quote}</p>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className={`${base.bgLeft} flex items-center justify-center w-1/2 h-full`}>
          <Image src="/ice_cream.svg" height={480} width={480} alt="" />
          <div className="ml-4">
            <Link href="/tracker">
              <Button className="bg-[#228B22] w-48 h-12">Add to Stomach!</Button>
            </Link>
          </div>
        </div>
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
