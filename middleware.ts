import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_PRIVATE_KEY = new TextEncoder().encode(process.env.JWT_PRIVATE_KEY);

export const middleware = async (req: NextRequest) => {

    const cookieStore = await cookies();
    
    const token = cookieStore.get('userToken')?.value as string;

    if (req.method === 'POST' || req.method === 'PUT') {
        try {
            const {payload} = await jwtVerify(token, JWT_PRIVATE_KEY);
            if (payload.username === 'admin') {
                return NextResponse.next();
            }
        } catch {
            return NextResponse.json(
            {message: 'Forbidden'},
            {status: 403})
        };   
    };
};

export const config = {
    matcher: '/api/news/:path*',
};
