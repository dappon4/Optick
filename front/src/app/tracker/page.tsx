'use client'
import React, { useEffect, useState } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import FileUpload, { todaysCaloriesAtom } from "@/components/ui/file-upload";
import { useAtom } from "jotai";
import Percentage from '@/components/ui/percentage'

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

function convertDate(dateString: string) {
    if (!dateString || dateString.length !== 6) {
        return "Invalid date format";
    }

    const month = dateString.slice(0, 2);
    const day = dateString.slice(2, 4);

    return `${month}/${day}`;
}

const Tracker = () => {
    const [data, setData] = useState<any>([]);
    const [todaysCalories, setTodaysCalories] = useAtom(todaysCaloriesAtom);

    useEffect(() => {
        const list = (getDates(5).slice(1, 5));
        const newObj = [{ date: getDates(1)[0], calories: 0 }, { date: list[0], calories: 1500 }, { date: list[1], calories: 2000 }, { date: list[2], calories: 3400 }, { date: list[3], calories: 4000 }, { date: list[4], calories: 3400 }, { date: list[5], calories: 2500 }];

        setData(newObj);
    }, []);

    useEffect(() => {
        const temp = JSON.parse(JSON.stringify(data));
        const today = temp.find((day: any) => day.date === getDates(1)[0]);
        if (today) {
            today.calories = todaysCalories;
            setData(temp);
        }

    }, [todaysCalories]);

    return (
        <>
            <div className="relative font-[sans-serif] before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50 before:z-10 w-[100vw]">
                <img src="https://cdn.discordapp.com/attachments/1066684337162039337/1221456802894581960/steve-daniel-PWlf4B38YJ8-unsplash.jpg?ex=6612a54b&is=6600304b&hm=116c00c8b945fe5f3ded1689fc302c4a128d30bf2df2178035aa7748c000b940&" alt="Banner Image" className="absolute inset-0 w-full h-full object-cover" />
                <div className="min-h-[300px] relative z-50 h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
                    <h2 className="sm:text-4xl text-2xl font-bold mb-6">snap 'n track</h2>
                </div>
            </div>
            <div className="p-2 flex justify-center items-center flex-wrap space-x-4 space-y-4">
                <div className="flex space-x-2 space-y-2 flex-wrap justify-center items-center">
                    <div className="w-96">

                        <VictoryChart
                            // adding the material theme provided with Victory
                            theme={VictoryTheme.material}
                            domainPadding={20}
                        >
                            <VictoryAxis
                                tickValues={getDates(5)}
                                tickFormat={getDates(5).map((date: string) => convertDate(date))}
                            />
                            <VictoryAxis
                                dependentAxis
                                tickFormat={(x) => (`${x}`)}
                            />
                            <VictoryBar
                                data={data}
                                x="date"
                                y="calories"
                            />
                        </VictoryChart>
                        <h4 className="ml-4">kCL</h4>
                    </div>
                    <div className="w-64">
                        <Percentage cals={todaysCalories} />
                    </div>

                </div>

                <FileUpload component="tracker" />
            </div>
        </>
    )
};

export default Tracker;