import Particles from "../components/Particles";

function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Particles className="absolute inset-0" quantity={100} />
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        </div>
    );
}

export default NotFound;
