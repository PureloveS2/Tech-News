import { NextResponse } from "next/server";
import { getRecentNews } from "../../database";

// Search the database for the 10 most recent news
export const GET = async () => {
    return NextResponse.json(await getRecentNews());
};
