import DashboardLayout from "../../components/layout/Main-layout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="text-gray-600">
        This is the dashboard page. Add widgets, charts, or summaries here.
      </p>
    </DashboardLayout>
  );
}
