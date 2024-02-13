import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { FetchNearbyGymUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymUseCase;
describe("fetch nearby gyms use case", async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymUseCase(gymsRepository);
  });

  it("should be to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      latitude: -22.8727977,
      longitude: -45.3153506,
      description: null,
      phone: null,
    });
    await gymsRepository.create({
      title: "Far Gym",
      latitude: -23.5750186,
      longitude: -46.5894523,
      description: null,
      phone: null,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.8727977,
      userLongitude: -45.3153506,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
