import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import si from "systeminformation";
import { NodeLiveData } from "@/lib/types";

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

  const disks = await si.fsSize();

  const root = disks.find((d) => d.mount === "/" || d.fs.includes("disk3"));

  console.log(mem.available, mem.total);

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
        usage: ((mem.total - mem.available) / mem.total) * 100,
      },
      disk: {
        used: (root?.size || 0) - (root?.available || 0),
        size: root?.size || 0,
        available: root?.available || 0,
      },
      disks: disk.map((d) => ({
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
  } as NodeLiveData);
}
