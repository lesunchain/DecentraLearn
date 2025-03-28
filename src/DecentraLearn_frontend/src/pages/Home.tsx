import { Link, useNavigate } from "react-router-dom";
import Particles from "../components/Particles";

interface LoginProps {
  isAuthenticated: boolean;
  login: () => void;
}

export default function Home({ isAuthenticated, login }: LoginProps): JSX.Element {
  const navigate = useNavigate(); // React Router navigation hook

  const handleLoginClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link behavior
    if (isAuthenticated) {
      navigate("/explore"); // Redirect to explore if already logged in
    } else {
      login(); // Trigger Internet Identity login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          <li>
            <Link
              to="/explore"
              className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
            >
              Explore
            </Link>
          </li>
          <li>
            <a
              href="#"
              onClick={handleLoginClick}
              className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
            >
              Login
            </a>
          </li>
        </ul>
      </nav>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={100} />
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl lg:text-9xl whitespace-nowrap bg-clip-text ">
        DecentraLearn
      </h1>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="m-16 text-center animate-fade-in">
        <h2 className="text-sm text-zinc-500 ">
          Discover the first free, decentralized, and open-source learning platform—empowering learners with limitless knowledge and total freedom.
        </h2>
      </div>
    </div>
  );
}
