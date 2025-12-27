export interface Node {
  name: string;
  node_id: string;
  ip: string;
  key: string;
}

export interface NodeLiveData {
  name: string;
  node_id: string;
  ip: string;
  key: string;
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
