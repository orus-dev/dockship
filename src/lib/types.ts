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
  liveData?: {
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

export interface Application {
  id: string;
  name: string;
  repo: string;
  nodeId: string;
  createdAt: string;
}

export interface ImageApp {
  app?: Application;
  id: string;
  name: string;
  image: string;
  containers: number;
  replicas: string;
  cpu: number;
  memory: number;
  network: string;
  status: "running" | "stopped";
  ports: string[];
}

export interface SimpleStats {
  cpu: number;
  memory: number;
}

export interface Log {
  timestamp: string;
  level: "info" | "warn" | "error";
  source: string;
  message: string;
}

export interface EnvVariable {
  key: string;
  value: string;
  secret: boolean;
}

export interface Env {
  id: string;
  name: string;
  variables: EnvVariable[];
}
