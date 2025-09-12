import DashboardPage from "../../components/pages/dashboard-page";
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NEXT_AUTH } from '../api/auth/[...nextauth]/route';
const AdminDashboardPage = async () => {
  const session = await getServerSession(NEXT_AUTH);

  if (!session || session.user?.role !== 'admin') {
    redirect('/login');
  }

  console.log(session.user); 
  return <DashboardPage />;
};

export default AdminDashboardPage;
