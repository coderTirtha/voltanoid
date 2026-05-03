import { onValue, ref, runTransaction } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { rtdb } from "../../firebase/firebase.config";

const toNumericValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const numericValue = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(numericValue) ? numericValue : null;
};

const normalizeLogs = (value) => {
    const entries = Array.isArray(value)
        ? value
        : value && typeof value === "object"
            ? Object.values(value)
            : [];

    return entries.map((entry, index) => {
        const timestamp = entry?.timestamp || entry?.time || entry?.createdAt || entry?.date || entry?.updatedAt || index + 1;

        return {
            timestamp: String(timestamp),
            power: toNumericValue(entry?.power ?? entry?.powerConsumption ?? entry?.power_consumption ?? entry?.powerUsage ?? entry?.usage ?? entry?.watts ?? entry?.load),
            voltage: toNumericValue(entry?.voltage ?? entry?.volt),
            current: toNumericValue(entry?.current ?? entry?.amp)
        };
    }).filter((entry) => entry.power !== null || entry.voltage !== null || entry.current !== null);
};

const MetricCard = ({ title, value, unit, toneClass, description }) => (
    <article className={`rounded-3xl border ${toneClass} bg-linear-to-br from-white/10 to-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]`}>
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/65">{title}</p>
                <p className="mt-3 text-4xl font-semibold text-white">
                    {value ?? "--"}
                    {value !== null && value !== undefined && value !== "" ? unit : ""}
                </p>
            </div>
            <div className="h-3 w-3 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.9)]" />
        </div>
        <p className="mt-4 text-sm text-white/70">{description}</p>
    </article>
);

const MiniChart = ({ title, dataKey, stroke, unit, data }) => (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
        <div className="mb-4 flex items-start justify-between gap-3">
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Individual graph</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-200">
                Live {unit}
            </span>
        </div>

        <div className="h-64 rounded-2xl border border-white/10 bg-black/20 p-3">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                    <XAxis dataKey="timestamp" hide />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                            background: "rgba(6, 8, 20, 0.96)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "14px",
                            color: "white"
                        }}
                        labelStyle={{ color: "#fff" }}
                    />
                    <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </article>
);

const controlButtons = [
    { key: "LOAD1", label: "Load 1" },
    { key: "LOAD2", label: "Load 2" },
    { key: "LOAD3", label: "Load 3" },
    { key: "LOAD4", label: "Load 4" }
];

const Dashboard = () => {
    const [latestDevice, setLatestDevice] = useState(null);
    const [logSeries, setLogSeries] = useState([]);
    const [rangeOption, setRangeOption] = useState("30");
    const [loadStates, setLoadStates] = useState({ LOAD1: false, LOAD2: false, LOAD3: false, LOAD4: false });
    const [loadUpdating, setLoadUpdating] = useState({ LOAD1: false, LOAD2: false, LOAD3: false, LOAD4: false });
    const [loading, setLoading] = useState(true);
    const [latestError, setLatestError] = useState("");
    const [logsError, setLogsError] = useState("");
    const [controlError, setControlError] = useState("");
    const [loaded, setLoaded] = useState({ latest: false, logs: false, control: false });

    useEffect(() => {
        const latestRef = ref(rtdb, "/devices/ESP32_001/latest");

        const unsubscribe = onValue(
            latestRef,
            (snapshot) => {
                const value = snapshot.val() || {};

                setLatestDevice({
                    id: "ESP32_001",
                    name: value.name || value.deviceName || "ESP32_001",
                    status: (value.status || value.state || value.connectionStatus || "online").toString(),
                    powerConsumption: toNumericValue(value.power ?? value.powerConsumption ?? value.power_consumption ?? value.powerUsage ?? value.usage ?? value.watts ?? value.load),
                    voltage: toNumericValue(value.voltage ?? value.volt),
                    current: toNumericValue(value.current ?? value.amp),
                    location: value.location || value.zone || value.room || "ESP32 device",
                    lastUpdated: value.updatedAt || value.lastUpdated || value.timestamp || value.time || null
                });

                setLatestError("");
                setLoaded((previous) => ({ ...previous, latest: true }));
            },
            () => {
                setLatestError("Unable to load live data from /devices/ESP32_001/latest.");
                setLoaded((previous) => ({ ...previous, latest: true }));
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const logsRef = ref(rtdb, "/devices/ESP32_001/logs");

        const unsubscribe = onValue(
            logsRef,
            (snapshot) => {
                setLogSeries(normalizeLogs(snapshot.val()));
                setLogsError("");
                setLoaded((previous) => ({ ...previous, logs: true }));
            },
            () => {
                setLogsError("Unable to load chart data from /devices/ESP32_001/logs.");
                setLoaded((previous) => ({ ...previous, logs: true }));
            }
        );

        return () => unsubscribe();
    }, []);

    const filteredLogSeries = useMemo(() => {
        if (!logSeries || logSeries.length === 0) return [];
        if (rangeOption === "all") return logSeries;
        const n = Number(rangeOption) || 30;
        return logSeries.slice(-n);
    }, [logSeries, rangeOption]);

    useEffect(() => {
        const controlRef = ref(rtdb, "/control/ESP32_001");

        const unsubscribe = onValue(
            controlRef,
            (snapshot) => {
                const value = snapshot.val();
                setLoadStates({
                    LOAD1: Number(value?.LOAD1) === 1,
                    LOAD2: Number(value?.LOAD2) === 1,
                    LOAD3: Number(value?.LOAD3) === 1,
                    LOAD4: Number(value?.LOAD4) === 1
                });
                setControlError("");
                setLoaded((previous) => ({ ...previous, control: true }));
            },
            () => {
                setControlError("Unable to load control state from /control/ESP32_001.");
                setLoaded((previous) => ({ ...previous, control: true }));
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (loaded.latest && loaded.logs && loaded.control) {
            setLoading(false);
        }
    }, [loaded]);

    

    const handleLoadToggle = async (loadKey) => {
        if (loadUpdating[loadKey]) {
            return;
        }

        const nextValue = !loadStates[loadKey];
        setLoadUpdating((previous) => ({ ...previous, [loadKey]: true }));
        setLoadStates((previous) => ({ ...previous, [loadKey]: nextValue }));

        try {
            const loadRef = ref(rtdb, `/control/ESP32_001/${loadKey}`);

            await runTransaction(loadRef, (currentValue) => (Number(currentValue) === 1 ? 0 : 1));
            setControlError("");
        } catch (error) {
            setLoadStates((previous) => ({ ...previous, [loadKey]: !previous[loadKey] }));
            setControlError(`Unable to update ${loadKey} state.`);
        } finally {
            setLoadUpdating((previous) => ({ ...previous, [loadKey]: false }));
        }
    };

    const metrics = useMemo(() => {
        return [
            {
                title: "Power",
                value: latestDevice?.powerConsumption,
                unit: " W",
                description: "Realtime power reading from the latest snapshot.",
                toneClass: "border-emerald-400/20"
            },
            {
                title: "Voltage",
                value: latestDevice?.voltage,
                unit: " V",
                description: "Realtime voltage reading from the latest snapshot.",
                toneClass: "border-cyan-400/20"
            },
            {
                title: "Current",
                value: latestDevice?.current,
                unit: " A",
                description: "Realtime current reading from the latest snapshot.",
                toneClass: "border-amber-400/20"
            }
        ];
    }, [latestDevice]);

    const hasLiveData = Boolean(latestDevice);

    return (
        <section className="px-4 py-10 md:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="rounded-4xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <p className="text-sm uppercase tracking-[0.3em] text-[#a58cff]">Devices dashboard</p>
                            <h1 className="text-3xl font-semibold text-white md:text-5xl">ESP32_001</h1>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-xl">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Device</p>
                                <p className="mt-2 text-lg font-semibold text-white">ESP32_001</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Live</p>
                                <p className="mt-2 text-lg font-semibold text-white">{hasLiveData ? latestDevice.status : "--"}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Samples</p>
                                <p className="mt-2 text-lg font-semibold text-white">{logSeries.length}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Last sync</p>
                                <p className="mt-2 text-lg font-semibold text-white">{latestDevice?.lastUpdated ? String(latestDevice.lastUpdated) : "Live"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300">
                        Loading device data...
                    </div>
                ) : null}

                {latestError ? (
                    <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-8 text-red-200">
                        {latestError}
                    </div>
                ) : null}

                {logsError ? (
                    <div className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-8 text-amber-100">
                        {logsError}
                    </div>
                ) : null}

                {controlError ? (
                    <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-8 text-red-200">
                        {controlError}
                    </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-3">
                    <MetricCard
                        title="Power Consumption"
                        value={latestDevice?.powerConsumption}
                        unit=" W"
                        toneClass="border-emerald-400/20"
                        description="Your real time power data goes here!"
                    />
                    <MetricCard
                        title="Voltage"
                        value={latestDevice?.voltage}
                        unit=" V"
                        toneClass="border-cyan-400/20"
                        description="Your real time voltage data goes here!"
                    />
                    <MetricCard
                        title="Current"
                        value={latestDevice?.current}
                        unit=" A"
                        toneClass="border-amber-400/20"
                        description="Your real time current data goes here!"
                    />
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4 md:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-[#a58cff]">Live logs</p>
                            <h2 className="mt-2 text-2xl font-semibold text-white">Realtime power, voltage and current</h2>
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
                            <p className="text-sm text-gray-400">Source: /devices/ESP32_001/logs</p>
                            <label className="flex w-full flex-col gap-2 text-sm text-gray-300 sm:w-56">
                                <span className="sr-only">Choose graph range</span>
                                <span className="text-xs uppercase tracking-[0.25em] text-white/60">Graph range</span>
                                <select
                                    value={rangeOption}
                                    onChange={(event) => setRangeOption(event.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300/40 focus:bg-white/10"
                                >
                                    <option value="10">Last 10 samples</option>
                                    <option value="30">Last 30 samples</option>
                                    <option value="100">Last 100 samples</option>
                                    <option value="all">All samples</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="h-90 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredLogSeries} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                                <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        background: "rgba(6, 8, 20, 0.96)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "16px",
                                        color: "white"
                                    }}
                                    labelStyle={{ color: "#fff" }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="power" name="Power (W)" stroke="#6ee7b7" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#67e8f9" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="current" name="Current (A)" stroke="#fbbf24" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-[#a58cff]">Relay control</p>
                            <h3 className="mt-2 text-2xl font-semibold text-white">ESP32_001 relay</h3>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {controlButtons.map((button) => {
                            const isEnabled = loadStates[button.key];
                            const isUpdating = loadUpdating[button.key];

                            return (
                                <div
                                    key={button.key}
                                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${isEnabled ? "border-emerald-400/30 bg-emerald-500/8 text-emerald-100" : "border-red-400/30 bg-red-500/8 text-red-100"}`}
                                >
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.25em] text-white/65">{button.label}</p>
                                        <p className="mt-1 text-lg font-semibold text-white">{isUpdating ? "Updating..." : isEnabled ? "ON (1)" : "OFF (0)"}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleLoadToggle(button.key)}
                                        disabled={isUpdating}
                                        aria-pressed={isEnabled}
                                        className={`relative inline-flex h-9 w-16 items-center rounded-full border px-1 transition ${isEnabled ? "border-emerald-300/40 bg-emerald-400/25" : "border-red-300/40 bg-red-400/20"} ${isUpdating ? "cursor-not-allowed opacity-70" : "hover:scale-[1.03]"}`}
                                    >
                                        <span className={`absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow transition-transform ${isEnabled ? "translate-x-7" : "translate-x-0"}`}></span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                    <MiniChart title="Power graph" dataKey="power" stroke="#6ee7b7" unit="W" data={filteredLogSeries} />
                    <MiniChart title="Voltage graph" dataKey="voltage" stroke="#67e8f9" unit="V" data={filteredLogSeries} />
                    <MiniChart title="Current graph" dataKey="current" stroke="#fbbf24" unit="A" data={filteredLogSeries} />
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
