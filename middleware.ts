// // import { betterFetch } from "better-auth/client";
// import type { auth } from "@/lib/auth";
// import { NextResponse, type NextRequest } from "next/server";
// import { createAuthClient } from "better-auth/client";
// const { betterFetch } = createAuthClient();

// type Session = typeof auth.$Infer.Session;

// export default async function middleware(request: NextRequest) {
// 	const { data: session } = await betterFetch<Session>(
// 		"/api/auth/get-session",
// 		{
// 			baseURL: request.nextUrl.origin,
// 			headers: {
// 				//get the cookie from the request
// 				cookie: request.headers.get("cookie") || "",
// 			},
// 		},
// 	);

// 	if (!session) {
// 		if (request.nextUrl.pathname.startsWith("/dashboard")) {
// 			return NextResponse.redirect(new URL("/signin", request.url));
// 		}
// 		return NextResponse.next();
// 	}

// 	if (request.nextUrl.pathname === "/signin" || request.nextUrl.pathname === "/signup") {
// 		return NextResponse.redirect(new URL("/dashboard", request.url));
// 	}
    
// 	return NextResponse.next();
// }

// export const config = {
// 	matcher: ["/dashboard/:path*", "/signin", "/signup"],
// };


// import { NextResponse, type NextRequest } from "next/server";
// import { betterFetch } from "better-auth/client"; // Use the Next.js optimized import
// import type { auth } from "@/lib/auth";

// type Session = typeof auth.$Infer.Session;

// export default async function middleware(request: NextRequest) {
//     // Standard betterFetch utility
//     const { data: session } = await betterFetch<Session>(
//         "/api/auth/get-session",
//         {
//             baseURL: request.nextUrl.origin,
//             headers: {
//                 cookie: request.headers.get("cookie") || "",
//             },
//         },
//     );

//     const isAuthPage = request.nextUrl.pathname === "/signin" || request.nextUrl.pathname === "/signup";
//     const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

//     if (!session) {
//         if (isDashboardPage) {
//             return NextResponse.redirect(new URL("/signin", request.url));
//         }
//         return NextResponse.next();
//     }

//     if (isAuthPage) {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
    
//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/dashboard/:path*", "/signin", "/signup"],
// };

import { NextResponse, type NextRequest } from "next/server";
// import { betterFetch } from "better-fetch/fetch";
import { betterFetch } from "@better-fetch/fetch" // Direct access to the fetch utility
import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export default async function middleware(request: NextRequest) {
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: request.nextUrl.origin,
            headers: {
                // Important for Middleware: pass the cookies manually
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    const isAuthPage = request.nextUrl.pathname === "/signin" || request.nextUrl.pathname === "/signup";
    const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

    if (!session) {
        if (isDashboardPage) {
            return NextResponse.redirect(new URL("/signin", request.url));
        }
        return NextResponse.next();
    }

    if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/signin", "/signup"],
};