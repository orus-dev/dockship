export interface Node {
  node_id: string;
  key: string;
  ip: string;
  name: string;
  labels?: string[];
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
