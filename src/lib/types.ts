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
    status: "running" | "pending" | "error";
    cpu: number;
    memory: number;
    disk: number;
    containers: number;
  };
}
