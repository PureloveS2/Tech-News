import { NextRequest, NextResponse } from "next/server";
import { searchNotice } from "../../../database";

// Receive 10 news from the database according to pagination
export const GET = async (req: NextRequest, {params} : { params: {slug: string}} ) => {
    let { slug } = await params;
    
    return NextResponse.json(await searchNotice(slug));
};
