'use client'
import React, { useEffect, useState } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import FileUpload, { todaysCaloriesAtom } from "@/components/ui/file-upload";
import { useAtom } from "jotai";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Tasting from '../../../public/tasting.svg'
import axios from 'axios';
import { Badge } from "@/components/ui/badge"

export function getDates(pastDays: number) {
    const dates = [];

    for (let i = 0; i <= pastDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let year = date.getFullYear().toString().slice(-2);

        dates.push(month + day + year);
    }

    return dates;
}

const Meal = () => {
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
        <div className="p-2 flex flex-col justify-center items-center flex-wrap space-x-4 space-y-4 h-[100vh]">
            <div className="flex flex-col items-center">
                <Image src={Tasting} alt="" width={250} />
                <FileUpload component="meal" />
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
        </div >
    )
};

export default Meal;