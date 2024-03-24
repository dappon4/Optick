'use client'
import React, { useEffect, useState } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import FileUpload, { todaysCaloriesAtom } from "@/components/ui/file-upload";
import { useAtom } from "jotai";

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
        <div className="p-2 flex justify-center items-center flex-wrap space-x-4 space-y-4 h-[100vh]">
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
            <FileUpload component="tracker" />
        </div>
    )
};

export default Tracker;