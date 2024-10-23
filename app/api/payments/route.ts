import {NextResponse} from "next/server"

export async function POST(params: any) {
    console.log('Payment ENDPOINT')
    // todo тут можеш написати якусь логіку, щоб обробити платіж (перевірити, створити, удалити і тд) і повертай то що потрібно
    return NextResponse.json({ingredients: 'zxc'});
}
