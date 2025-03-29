import { SidebarProvider } from "../components/SidebarProvider";
import { Outlet } from 'react-router-dom';

export default function LearnLayout() {
    return (
        <SidebarProvider>
            <div className="h-full">
                <Outlet />
            </div>
        </SidebarProvider>
    );
}