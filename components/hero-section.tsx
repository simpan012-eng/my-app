import Link from 'next/link'
import Image from 'next/image'

export function HeroSection() {
    return (
        <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24">
            {/* Bakgrundsbild — ligger i public/Bakgrund_test.jpg */}
            <Image
                src="/temp-bakgrund.png"
                alt=""
                fill
                priority
                className="object-cover"
            />
            {/* Mörk overlay så texten syns oavsett bild */}
            <div className="absolute inset-0 bg-neutral-950/50" />

            {/* Innehåll, måste ligga ovanpå bilden */}
            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Torsdagskröken
                    </h1>
                    <p className="font-heading max-w-md text-neutral-300">
                        En liten öl är man väl värd?
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <Link
                        href="/krokenkrew"
                        className="rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200">
                        Om oss
                    </Link>
                    <Link
                        href="/kontakt"
                        className="rounded-full border border-neutral-700 px-6 py-3 text-sm font-medium text-white transition hover:border-neutral-500">
                        Kontakta oss
                    </Link>
                </div>
            </div>
        </main>
    )
}