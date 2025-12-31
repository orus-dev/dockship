import { ContainerStats } from "dockerode";

export function CPUusage(stats: ContainerStats) {
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const onlineCPUs =
    stats.cpu_stats.online_cpus ||
    stats.cpu_stats.cpu_usage.percpu_usage.length;

  if (systemDelta > 0 && cpuDelta > 0) {
    return (cpuDelta / systemDelta) * onlineCPUs * 100.0;
  }
  return 0.0;
}
