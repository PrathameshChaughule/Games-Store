import Chart from "react-apexcharts";

const RevenueChart = ({ dates, revenue, theme }) => {
    const isDark = theme === "dark";

    const options = {
        chart: {
            type: "area",
            toolbar: { show: false },
            foreColor: isDark ? "#CBD5E1" : "#334155",
        },
        stroke: { curve: "smooth", width: 3 },
        dataLabels: { enabled: false },
        xaxis: {
            categories: dates,
            labels: {
                formatter: (val) => {
                    const d = new Date(val);
                    return d.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                    });
                },
            },
        },
        yaxis: {
            labels: {
                formatter: (val) => `₹${val.toFixed(2)}`,
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `₹${val.toFixed(2)}`,
            },
        },
        grid: {
            borderColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "#E5E7EB",
        },
        colors: [isDark ? "#22C55E" : "#16A34A"],
        fill: {
            type: "gradient",
            gradient: {
                shade: isDark ? "dark" : "light",
                opacityFrom: 0.5,
                opacityTo: 0.1,
            },
        },
    };

    const series = [
        {
            name: "Revenue",
            data: revenue,
        },
    ];

    return (
        <Chart
            options={options}
            series={series}
            type="area"
            height={240}
        />
    );
};

export default RevenueChart;
