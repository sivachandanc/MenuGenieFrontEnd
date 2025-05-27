import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { Line } from "react-chartjs-2";
import { supabaseClient } from "../../../supabase-utils/SupaBaseClient";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { ChartNoAxesCombined } from "lucide-react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BusinessAnalyticsDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data } = await supabaseClient
        .from("business")
        .select("business_id, name");
      if (data) setBusinesses(data);
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const results = {};
      for (const biz of businesses) {
        const { data: analytics } = await supabaseClient
          .from("business_analytics_daily")
          .select("*")
          .eq("business_id", biz.business_id)
          .eq("date", selectedDate)
          .single();

        const { data: trend } = await supabaseClient
          .from("business_analytics_daily")
          .select("date, total_messages")
          .eq("business_id", biz.business_id)
          .order("date");

        results[biz.business_id] = { analytics, trend };
      }
      setAnalyticsData(results);
    };
    if (businesses.length > 0) fetchAll();
  }, [businesses, selectedDate]);

  return (
    <div className="p-4 max-w-4xl mx-auto text-[var(--textMain)] bg-[var(--background)] min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <ChartNoAxesCombined size={25}/>
        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          QR Chat Analytics
        </h2>
      </div>

      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Select Date:
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded border border-gray-300 bg-white text-black"
        />
      </div>

      <Tab.Group>
        <Tab.List className="flex overflow-x-auto gap-2 p-1 rounded-md bg-[var(--button)] mb-4">
          {businesses.map((biz) => (
            <Tab
              key={biz.business_id}
              className={({ selected }) =>
                classNames(
                  "px-4 py-2 rounded whitespace-nowrap font-semibold transition",
                  selected
                    ? "bg-white text-black shadow"
                    : "text-white hover:bg-[var(--button-hover)]"
                )
              }
            >
              {biz.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {businesses.map((biz) => {
            const data = analyticsData[biz.business_id];
            if (!data) return <div key={biz.business_id}>Loading...</div>;

            const { analytics, trend } = data;

            return (
              <Tab.Panel key={biz.business_id} className="space-y-6">
                {!analytics ? (
                  <p className="text-center text-gray-500">
                    No data available for {selectedDate}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard
                      label="Users via QR"
                      value={analytics.qr_chat_users}
                    />
                    <StatCard
                      label="Total Messages"
                      value={analytics.total_messages}
                    />
                    <StatCard
                      label="Bot Reply Rate"
                      value={`${analytics.bot_reply_rate * 100}%`}
                    />
                    <StatCard
                      label="Avg Msgs / Session"
                      value={analytics.avg_messages_per_session}
                    />
                  </div>
                )}

                {trend && trend.length > 0 && (
                  <div className="bg-white p-4 rounded border shadow">
                    <h4 className="text-sm font-semibold mb-2 text-black">
                      Message Trend (Last 7 Days)
                    </h4>
                    <Line
                      data={{
                        labels: trend.map((row) => row.date),
                        datasets: [
                          {
                            label: "Total Messages",
                            data: trend.map((row) => row.total_messages),
                            borderColor: "#3b82f6",
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { ticks: { color: "#000" } },
                          x: { ticks: { color: "#000" } },
                        },
                      }}
                    />
                  </div>
                )}
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 bg-white text-black rounded shadow border">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-[var(--button)]">
        {value ?? "-"}
      </p>
    </div>
  );
}
