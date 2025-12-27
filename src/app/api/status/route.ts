import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import si from "systeminformation";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const [cpu, mem, load, disk, network] = await Promise.all([
    si.cpu(),
    si.mem(),
    si.currentLoad(),
    si.fsSize(),
    si.networkStats(),
  ]);

  return NextResponse.json({
    message: "ok",
    liveData: {
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        cores: cpu.cores,
        usage: load.currentLoad,
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        usage: ((mem.total - mem.free) / mem.total) * 100,
      },
      disk: disk.map((d) => ({
        fs: d.fs,
        size: d.size,
        used: d.used,
        usage: d.use,
      })),
      network: network.map((n) => ({
        iface: n.iface,
        rx: n.rx_bytes,
        tx: n.tx_bytes,
      })),
    },
  });
}
