import {NextRequest, NextResponse} from 'next/server'


export async function middleware(request: NextRequest) {
    const cookieValue = request.cookies.get("scopedState-verificarScope")?.value;
    const scopedState = cookieValue ? JSON.parse(cookieValue) : null;

    const token = scopedState?.verificar.token ?? undefined;

    if (!token && request.nextUrl.pathname === '/teste') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next(); // Continua a requisição normalmente
}

export const config = {
    matcher: ['/', '/teste'] // Utiliza o array diretamente aqui
};

