import { NextRequest, NextResponse } from "next/server";
import testAuth from "../auth";
import { StatusCodes } from "http-status-codes";
import si from "systeminformation";
import { average } from "@/lib/format";

type Usage = {
  cpu: number;
  memory: number;
  in: number;
  out: number;
};

const usageSecs: Usage[] = [];

const usageMins: (Usage & { time: string })[] = [];

const usageHours: (Usage & { time: string })[] = new Array(12).fill({
  time: "00:00",
  cpu: 0,
  memory: 0,
  in: 0,
  out: 0,
});

var hr = 0;

function getTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

setInterval(async () => {
  const [mem, load, network] = await Promise.all([
    si.mem(),
    si.currentLoad(),
    si.networkStats(),
  ]);

  const sec = {
    cpu: load.currentLoad,
    memory: ((mem.total - mem.available) / mem.total) * 100,
    in: average(network, (n) => n.rx_bytes),
    out: average(network, (n) => n.tx_bytes),
  };
  usageSecs.push(sec);

  if (usageSecs.length === 10) {
    usageHours[hr] = { time: getTime(), ...sec };
  } else if (usageSecs.length >= 60) {
    usageMins.push({
      time: getTime(),
      cpu: average(usageSecs, (s) => s.cpu),
      memory: average(usageSecs, (s) => s.memory),
      in: average(usageSecs, (s) => s.in),
      out: average(usageSecs, (s) => s.out),
    });

    if (usageMins.length >= 60) {
      const time = getTime();
      if (hr >= 12) {
        usageHours.shift();
        usageHours.push({
          time,
          cpu: average(usageMins, (s) => s.cpu),
          memory: average(usageMins, (s) => s.memory),
          in: average(usageMins, (s) => s.in),
          out: average(usageMins, (s) => s.out),
        });
      } else {
        usageHours[hr] = {
          time,
          cpu: average(usageMins, (s) => s.cpu),
          memory: average(usageMins, (s) => s.memory),
          in: average(usageMins, (s) => s.in),
          out: average(usageMins, (s) => s.out),
        };
        hr++;
      }

      usageMins.splice(0, usageSecs.length);
    }

    usageSecs.splice(0, usageSecs.length);
  }
}, 1000);

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await testAuth(req);

  if (auth) {
    return NextResponse.json(
      { message: auth },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  return NextResponse.json({
    message: "ok",
    metrics: usageHours,
  });
}
