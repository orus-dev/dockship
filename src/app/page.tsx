"use client";

import { getDocker } from "@/core/client/docker";

export default function Home() {
  return (
    <div>
      <button
        onClick={async () => {
          console.log(await getDocker("localhost", "oD7tMrnkxIvuFrR+b6QZh66E4PU="));
        }}
      >
        Get docker
      </button>
    </div>
  );
}
