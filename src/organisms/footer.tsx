import Link from "next/link";
import DiscordIcon from "src/icons/discord-icon";
import TwitterIcon from "src/icons/twitter-icon";

export default function Footer() {
  return (
    <footer className="flex text-center justify-center items-center p-2.5 text-xs text-white space-x-2">
      <Link href="https://twitter.com/LPFinance_" target="_blank">
        <TwitterIcon />
      </Link>

      <Link href="https://discord.com/invite/ug7mstrHNW" target="_blank">
        <DiscordIcon />
      </Link>
    </footer>
  );
}
