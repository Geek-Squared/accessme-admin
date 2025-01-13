import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Building2,
  Users,
  FileText,
  ShieldCheck,
  Clock,
  AlertTriangle,
} from "lucide-react";
import "./styles.scss";
import "../../App.css";
import useFetchUsers from "../../hooks/useFetchUsers";
import useFetchSites from "../../hooks/useFetchSites";
import useFetchCustomForms from "../../hooks/useFetchCustomForms";
import useFetchVisitors from "../../hooks/useFetchVisitors";

interface DashboardMetric {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

const groupByMonthAndCategory = (visitors: any[]) => {
  const groupedData: Record<
    string,
    { month: string; visitors: number; contractors: number; deliveries: number }
  > = {};

  visitors.forEach((visitor) => {
    const entryDate = new Date(visitor.createdAt);
    const month = entryDate.toLocaleString("default", { month: "short" });

    if (!groupedData[month]) {
      groupedData[month] = {
        month,
        visitors: 0,
        contractors: 0,
        deliveries: 0,
      };
    }

    if (visitor.category?.name === "Visitor") {
      groupedData[month].visitors += 1;
    } else if (visitor.category?.name === "Delivery") {
      groupedData[month].deliveries += 1;
    } else {
      groupedData[month].contractors += 1;
    }
  });

  return Object.values(groupedData);
};

const Dashboard = () => {
  const { users } = useFetchUsers();
  const { sites } = useFetchSites();
  const { forms } = useFetchCustomForms();
  const { visitors } = useFetchVisitors();

  console.log('visitors', visitors)

  const personnel =
    users?.filter((user: { role: string }) => user.role === "PERSONNEL") || [];
  const activePersonnelCount = personnel.length;

  // Dynamic change for site count
  const previousSiteCount = sites?.length || 0; // Replace with actual previous count if available
  const currentSiteCount = sites?.length || 0;
  const siteChange =
    currentSiteCount > previousSiteCount
      ? currentSiteCount - previousSiteCount
      : 0;

  const metrics: DashboardMetric[] = [
    {
      title: "Total Sites",
      value: currentSiteCount,
      change: siteChange,
      icon: <Building2 className="h-6 w-6" />,
    },
    {
      title: "Active Personnel",
      value: activePersonnelCount,
      change: 5,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Custom Forms",
      value: forms?.length || 0,
      change: 3,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Security Checks",
      value: visitors?.length,
      change: 23,
      icon: <ShieldCheck className="h-6 w-6" />,
    },
  ];

  const visitorData = groupByMonthAndCategory(visitors || []);

  const recentActivity = [
    { time: "10:45 AM", event: "New contractor form created", type: "form" },
    { time: "10:30 AM", event: "Security alert at Site A", type: "alert" },
    { time: "10:15 AM", event: "New site added: Tech Park B", type: "site" },
    { time: "10:00 AM", event: "15 new visitors checked in", type: "visitor" },
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Admin Dashboard</h1>

      {/* Key Metrics */}
      <div className="dashboard__metrics">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-card__icon">{metric.icon}</div>
            <div className="metric-card__content">
              <h3 className="metric-card__title">{metric.title}</h3>
              <p className="metric-card__value">{metric.value}</p>
              <span
                className={`metric-card__change ${metric.change >= 0 ? "positive" : "negative"}`}
              >
                {metric.change >= 0 ? "+" : ""}
                {metric.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard__charts">
        <div className="chart-card">
          <h3>Visitor Traffic Overview</h3>
          <ResponsiveContainer width="70%" height={300}>
            <BarChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visitors" fill="#8884d8" />
              <Bar dataKey="contractors" fill="#82ca9d" />
              <Bar dataKey="deliveries" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard__activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-item__icon">
                {activity.type === "alert" && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                {activity.type === "form" && (
                  <FileText className="h-5 w-5 text-blue-500" />
                )}
                {activity.type === "site" && (
                  <Building2 className="h-5 w-5 text-green-500" />
                )}
                {activity.type === "visitor" && (
                  <Users className="h-5 w-5 text-purple-500" />
                )}
              </div>
              <div className="activity-item__content">
                <p className="activity-item__event">{activity.event}</p>
                <span className="activity-item__time">
                  <Clock className="h-4 w-4" />
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
