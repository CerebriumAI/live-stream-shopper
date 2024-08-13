import CerebriumLogo from "@/app/assets/logos/cerebrium.svg";
// import ExpiryTimer from "../Session/ExpiryTimer";

const aCx =
  "underline decoration-primary-400/0 hover:decoration-primary-400 underline-offset-4 transition-all duration-300";

function Header() {
  return (
    <header
      id="header"
      className="w-full flex self-start items-center p-[--app-padding] justify-between"
    >
      <div className="group flex gap-1">
        <span className="rounded-xl p-2 flex place-content-center transition-all">
          <img
              src={CerebriumLogo.src}
              alt="Cerebrium.ai"
              className="w-[300px] h-[100px] aspect-square [&>*:nth-child(5)]:invisible group-hover:[&>*:nth-child(5)]:visible group-hover:[&>*:nth-child(4)]:invisible group-hover:animate-wiggle"
            />
          {/* <Logo  /> */}
        </span>

        <nav className="pointer-events-none flex-row items-center gap-8 text-lg leading-7 hidden group-hover:flex group-hover:pointer-events-auto">
          <a href="https://join.slack.com/t/cerebriumworkspace/shared_invite/zt-1lvbha401-lPsnCWYnVlGymGKS2E5fvA" target="_blank" className={aCx}>
            Slack
          </a>
          <a href="https://discord.gg/ATj6USmeE2" target="_blank" className={aCx}>
            Discord
          </a>
        </nav>
      </div>
      {/* <ExpiryTimer /> */}
    </header>
  );
}

export default Header;
