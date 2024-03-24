'use client'
// biome-ignore lint/style/useImportType: <explanation>
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAtom, atom } from 'jotai';
import Edit from './edit-results';
import { getDates } from '@/app/tracker/page';

export const resultsAtom = atom({});
export const editsAtom = atom(null);
export const openAtom = atom(false);
export const previewAtom = atom(null);
export const todaysCaloriesAtom = atom(0);

const FileUpload = ({ component }: { component: ("tracker" | "meal") }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useAtom(previewAtom);
    const [results, setResults] = useAtom(resultsAtom);
    const [open, setOpen] = useAtom(openAtom);
    const [edits, setEdits] = useAtom(editsAtom);
    const [todaysCalories, setTodaysCalories] = useAtom(todaysCaloriesAtom);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        const reader = new FileReader();
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        reader.onloadend = () => setPreview(reader.result as any);
        reader.readAsDataURL(file);

        // Cleanup function to revoke the object URL
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        return () => URL.revokeObjectURL(preview as any);
    }, [file]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            setFile((files as any)[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        // Base64 encode the image file
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (e) => { // Mark this function as async
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const base64Data = (e.target as any).result.split(',')[1]; // Extract the Base64 data

            try {
                // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                const response = await axios.post('http://167.71.172.236:5000/add-img', { "image_base64": base64Data }, {
                    headers: {
                        'Content-Type': 'application/json', // Use JSON content type for Base64 data
                    },
                });
                setResults(response.data);
                setOpen(true);
                setPreview(null);

            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Error uploading file');
            }
        };

        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            alert('Error reading file');
        };
    };

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const postConfirmedResults = async (res: any) => {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        if (JSON.stringify(res) !== "{}") {
            const response = await axios.post(`http://167.71.172.236:5000/${component === "tracker" ? "add-data" : "add-inv-data"}`, JSON.parse(JSON.stringify({ "items": res, "date": getDates(1)[0] })), {
                headers: {
                    'Content-Type': 'application/json', // Use JSON content type for Base64 data
                },
            });
            console.log(response)

            if (component === "tracker") setTodaysCalories(todaysCalories + response.data.calories);
        }
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {

        if (open === false && edits != null && Object.keys(edits as any).sort().toString() === Object.keys(results).sort().toString()) {
            console.log("hey", edits);
            for (let i = 0; i < Object.keys(edits as any).length; i++) {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                if ((edits as any)[Object.keys(edits as any)[i]] !== (results as any)[Object.keys(edits as any)[i]]) {
                    console.log(edits);
                    postConfirmedResults(edits);
                    setEdits(null);
                    return;
                }
            }

            postConfirmedResults(edits);
            setEdits(null);
        } else if (open === false && results !== null) {
            console.log("p",);
            postConfirmedResults(results);
        }
    }, [open])

    return (
        <>
            {open && <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <Edit />
                </DialogContent>
            </Dialog>}
            <div className='p-4'>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 px-4 min-w-96">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className='hidden' onChange={handleFileChange} />
                        {preview && <div className='flex space-x-4 items-center'>
                            <img src={preview} className='h-12' alt="Preview" />
                            <Button onClick={handleFileUpload}>Upload</Button>
                        </div>}
                    </label>
                </div>
            </div>
        </>
    );
};

export default FileUpload;