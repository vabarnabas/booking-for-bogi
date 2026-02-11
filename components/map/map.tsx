"use client";
import { Marker, Map as PigeonMap } from "pigeon-maps";

export default function CustomMap() {
  return (
    <PigeonMap
      height={300}
      defaultCenter={[47.7266898373948, 17.636709747052624]}
      defaultZoom={16}
    >
      <Marker width={50} anchor={[47.7266898373948, 17.636709747052624]} />
    </PigeonMap>
  );
}
