"use client";

import { getDocker } from "@/actions/docker";

export default function Home() {
  return (
    <div>
      <button
        onClick={() => {
          getDocker();
        }}
      >
        Get docker
      </button>
    </div>
  );
}
