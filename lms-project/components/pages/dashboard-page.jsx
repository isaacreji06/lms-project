"use client";
import React from "react";
import MainLayout from "../layout/Main-layout.jsx";
import Sidebar from "../layout/Sidebar.jsx";
// import Navbar from "../layout/Navbar.jsx";
import Card from "../global/Card.jsx";

const DashboardPage = () => (
  <MainLayout sidebar={<Sidebar role="admin" />}>
    <h1 className="text-3xl font-bold mb-6 text-black">Admin Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <h2 className="text-xl text-black font-semibold mb-2">Welcome!</h2>
        <p className="text-black">
          This is your admin dashboard. Here you can find your courses, progress, and more.
        </p>
      </Card>
    </div>
  </MainLayout>
);

export default DashboardPage;
