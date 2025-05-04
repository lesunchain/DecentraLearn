import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-background">
            <AdminSidebar />
            <div className="flex-1 p-6 overflow-auto">
                <Outlet /> {/* This will render the nested routes content */}
            </div>
        </div>
    );
}
