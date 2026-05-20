import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { CheckCircle2, Clock3, MousePointerClick, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { getLeadStats } from "../services/leadService";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const { data } = await getLeadStats();
      setStats(data);
      setLoading(false);
    };

    loadStats().catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading label="Loading dashboard..." />;
  }

  const statCards = [
    { label: "Total Leads", value: stats?.total || 0, tone: "primary", icon: UsersRound },
    { label: "New Leads", value: stats?.new || 0, tone: "info", icon: MousePointerClick },
    { label: "Contacted Leads", value: stats?.contacted || 0, tone: "warning", icon: Clock3 },
    { label: "Converted Leads", value: stats?.converted || 0, tone: "success", icon: CheckCircle2 }
  ];

  const statusData = {
    labels: ["New", "Contacted", "Converted"],
    datasets: [
      {
        data: [stats?.new || 0, stats?.contacted || 0, stats?.converted || 0],
        backgroundColor: ["#14b8a6", "#f59e0b", "#22c55e"]
      }
    ]
  };

  const sourceData = {
    labels: stats?.bySource?.map((item) => item.source) || [],
    datasets: [
      {
        label: "Leads",
        data: stats?.bySource?.map((item) => item.count) || [],
        backgroundColor: "#2563eb",
        borderRadius: 6
      }
    ]
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
        <div className="conversion-chip">
          <span>{stats?.conversionRate || 0}%</span>
          Conversion rate
        </div>
      </div>

      <section className="insight-strip mb-4">
        <div>
          <span className="eyebrow">Today Focus</span>
          <h2>Keep every client lead moving</h2>
        </div>
        <p>
          Review new prospects, update contacted leads, and track conversion performance from one clean CRM view.
        </p>
      </section>

      <div className="row g-3 mb-4">
        {statCards.map((card) => (
          <div className="col-12 col-sm-6 col-xl-3" key={card.label}>
            <div className={`stat-card border-${card.tone}`}>
              <div className={`stat-icon text-bg-${card.tone}`}>
                <card.icon size={20} />
              </div>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <section className="panel">
            <h2>Status Mix</h2>
            <div className="chart-box">
              <Doughnut data={statusData} options={{ maintainAspectRatio: false }} />
            </div>
          </section>
        </div>
        <div className="col-12 col-lg-7">
          <section className="panel">
            <h2>Lead Sources</h2>
            <div className="chart-box">
              <Bar
                data={sourceData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
