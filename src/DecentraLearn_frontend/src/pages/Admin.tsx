import { Navigate } from "react-router-dom"

// This component redirects to the admin dashboard
function Admin() {
  return <Navigate to="/admin/dashboard" replace />
}

export default Admin

