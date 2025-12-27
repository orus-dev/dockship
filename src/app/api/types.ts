import { randomBytes, randomUUID } from "crypto";

export interface NodeJson {
  node_id: string;
  key: string;
}

export const NodeJsonTemplate: () => NodeJson = () => ({
  node_id: randomUUID(),
  key: randomBytes(20).toString("base64"),
});
