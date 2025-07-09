import { NextRequest, NextResponse } from "next/server";
import { getAllNewsPaginatedBy10 } from "../../../database";

// Receive 10 news from the database according to pagination
export const GET = async (req: NextRequest, {params} : { params: {pageNumber: string}} ) => {
    let { pageNumber } = await params;
    let rowsToSkip = 0;
    for (let n = 0; n < parseInt(pageNumber) - 1; n++) {
        rowsToSkip += 10;
    };
    
    return NextResponse.json(await getAllNewsPaginatedBy10(rowsToSkip));
};
