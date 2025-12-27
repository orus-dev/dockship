import { ContainerInfo } from "dockerode";

export interface Node {
  node_id: string;
  key: string;
  ip: string;
  os: string;
  name: string;
  description: string;
  labels: string[];
}

export interface NodeLiveData {
  liveData: {
    cpu: {
      manufacturer: string;
      brand: string;
      cores: number;
      usage: number;
    };
    memory: {
      total: number;
      used: number;
      free: number;
      usage: number;
    };
    disk: {
      size: number;
      available: number;
      used: number;
    };
    disks: {
      fs: string;
      size: number;
      used: number;
      usage: number;
    }[];
    network: {
      iface: string;
      rx: number;
      tx: number;
    }[];
  };
}

export interface Docker {
  version: string;
  containers: ContainerInfo[];
}
