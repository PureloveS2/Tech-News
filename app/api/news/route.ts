import { NextRequest, NextResponse } from "next/server";
import { getRecentNews } from "./database";
import { postNoticeToDB } from "./database";
import { v4 as uuidv4 } from 'uuid'; //Library to generate uuid
import fs from "fs"; 
import { fileTypeFromBuffer } from "file-type"; // Library to check the mime type of a buffer

// Search the database for the 10 most recent news
export const GET = async () => {
    return NextResponse.json(await getRecentNews());
};

// Receives a multipartform with the information of a news and then sends it to the database
export const POST = async (req: NextRequest) => {
    const data = await req.formData();
    
    // Getting the values from the form
    const noticeImage    = data.get('noticeImage') as File;
    const noticeTitle    = data.get('noticeTitle') as string;
    const noticeSubtitle = data.get('noticeSubtitle') as string;
    const noticeBody     = data.get('noticeBody') as string;
    const categorie      = data.get('categorie') as string;
    
    const noticeImageBuffer = await noticeImage.arrayBuffer();
    
    const noticeImageMimeType = await fileTypeFromBuffer(noticeImageBuffer); 
    
    try {
        // Checking if the mime type of the received file is a webp, jpeg, or png
        if (noticeImageMimeType?.mime === 'image/webp' || noticeImageMimeType?.mime === 'image/jpeg' || noticeImageMimeType?.mime === 'image/png') {
            const noticeImageUrl = `public/news-images/${uuidv4()}.${noticeImageMimeType.ext}` as string;
            
            fs.writeFileSync(noticeImageUrl, Buffer.from(noticeImageBuffer));

            postNoticeToDB(noticeTitle, noticeSubtitle, noticeBody, noticeImageUrl, categorie);

            return NextResponse.json(await getRecentNews());
            
        }
        
        // If it is not, instance an error
        throw new Error("The file is not a valid image"); 

    } catch(err: unknown) { // Handling the error
        if (err instanceof Error) {
            return NextResponse.json(`Error: ${err.message}`);
        } else {
            return NextResponse.json('Unknown error');
        };
    };
};
