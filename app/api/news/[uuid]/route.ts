import { NextRequest, NextResponse } from "next/server";
import { getSpecificNotice, modifyNotice } from "../../database";
import { fileTypeFromBuffer } from "file-type";
import fs from 'fs';

// Receive 10 news from the database according to pagination
export const GET = async (req: NextRequest, {params} : { params: {uuid: string}} ) => {
    const { uuid } = await params;

    return NextResponse.json(await getSpecificNotice(uuid));
};

export const PUT = async(req: NextRequest, {params} : {params: {uuid: string}}) => {
    const data = await req.formData();
    const { uuid } = await params;
     
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
            const noticeImageUrl = `public/news-images/${uuid}.${noticeImageMimeType.ext}` as string;
            
            fs.writeFileSync(noticeImageUrl, Buffer.from(noticeImageBuffer));

            modifyNotice(noticeTitle, noticeSubtitle, noticeBody, noticeImageUrl, categorie, uuid);

            return NextResponse.json(
                {message: 'Resource updated successfully'},
                {status: 200}
            );
            
        };
        
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
