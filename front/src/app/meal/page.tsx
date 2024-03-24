'use client'
import React from "react";
import FileUpload from "@/components/ui/file-upload";
import Image from "next/image";
import Tasting from '../../../public/tasting.svg'

const Meal = () => {
    return (
        <div className="overscroll-x-hidden">
               <div className="relative font-[sans-serif] before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50 before:z-10 w-[100vw]">
                <img src="https://media.discordapp.net/attachments/1220865747467636887/1221479352978509994/anh-nguyen-kcA-c3f_3FE-unsplash.jpg?ex=6612ba4b&is=6600454b&hm=35930efe57c50e989c1a6a9da3df089b17e15484ced12faed4fbd9d2e872a643&=&format=webp&width=733&height=733" alt="Banner Image" className="absolute inset-0 w-full h-full object-cover" />
                <div className="min-h-[300px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
                    <h2 className="sm:text-4xl text-2xl font-bold mb-6">stock up!</h2>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <FileUpload component="meal" />
            </div>


        </div >
        

    )
};

export default Meal;