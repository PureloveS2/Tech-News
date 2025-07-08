import { NextRequest, NextResponse } from "next/server";
import { getUserPassword } from "../../../database";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import jwt, { Secret } from 'jsonwebtoken';

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as Secret;

export const POST = async (req: NextRequest) => {
    const headersList = await headers();
    const cookieStore = await cookies();

    const userPassword = await getUserPassword(headersList.get("username") as string);

    if (!userPassword[0]) {
        return NextResponse.json(
            {message: 'User not found'},
            {status: 404}
        );
    };

    const generateToken = () => {
        if (headersList.get("password") === userPassword[0].password) {
            const token: string = jwt.sign({ username: headersList.get("username") as string }, JWT_PRIVATE_KEY, { expiresIn: '12h' });

            return token;
        };

        return undefined;
    };

    const token = generateToken();

    if (!token) {
        return NextResponse.json(
            {message: 'Unauthorized'},
            {status: 401}
        );
    };
    
    cookieStore.set('userToken', token, { maxAge: 43200 }); // 12 hours in seconds

    return NextResponse.json(
        {message: 'Token generated'},
        {status: 200}
    )
};
