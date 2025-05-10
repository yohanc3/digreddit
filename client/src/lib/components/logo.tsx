import Link from "next/link";
import Image from "next/image";

export function FullLogo(){
    return (
        <Link href="/">
            <Image
                alt="DigReddit"
                src="/digreddit-logo.png"
                width={180}
                height={40}
            />
        </Link>
    );
}

export function NameOnly(){
    return (
        <Link href="/">
            <Image
                alt="DigReddit"
                src="/digreddit_logo_word.png"
                width={180}
                height={40}
            />
        </Link>
    );
}