"use client";
import DashboardPage from "../../components/pages/dashboard-page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminDashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "admin") {
      router.push("/student-dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // avoid crashing while redirecting
  }

  console.log("✅ Session:", session);

  return <DashboardPage />;
};

export default AdminDashboardPage;
