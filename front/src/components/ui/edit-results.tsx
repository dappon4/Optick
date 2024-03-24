'use client'
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { resultsAtom, openAtom, editsAtom } from './file-upload';

const Edit = () => {
    const [results, setResults] = useAtom(resultsAtom);
    const [edits, setEdits] = useAtom(editsAtom);

    const handleChange = (event: any, key: string) => {
        let temp = JSON.parse(JSON.stringify(edits ?? results));
        (temp as any)[key] = Number(event.target.value);
        setEdits(temp);
    }

    return <div className="">
        <h1 className="font-bold text-[#228B22]"> Confirm Items:</h1>
        <div className="[max-height:70vh] overflow-scroll flex flex-col py-x space-y-2">
            {Object.keys(results).map(key => (
                <div className='flex justify-between items-center px-4'>
                    <h1>{key}</h1>
                    <div className="w-16 py-2">
                        <Input type="email" placeholder={(results as any)[key].toString()} onChange={(event) => handleChange(event, key)} />
                    </div>
                </div>
            ))}
        </div>
    </div>;
}

export default Edit;