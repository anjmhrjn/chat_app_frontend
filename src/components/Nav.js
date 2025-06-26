import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed mb-3 w-full">
      <nav className="backdrop-blur-xl w-full p-3 flex justify-center shadow-2xl">
        <Link href={"/"}>
          <Image src={"/next.svg"} width={75} height={75} alt="Logo" />
        </Link>
      </nav>
    </header>
  );
}
