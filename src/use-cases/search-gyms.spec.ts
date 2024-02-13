import { expect, describe, it, beforeEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

import { FetchUserCheckInsHistoryUseCase } from "./fetch-member-check-ins-history";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;
describe("search gyms use case", async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it("should be to search for gyms", async () => {
    await gymsRepository.create({
      title: "JavaScript Gym",
      latitude: -22.8727977,
      longitude: -45.3153506,
      description: null,
      phone: null,
    });
    await gymsRepository.create({
      title: "TypeScript Gym",
      latitude: -22.8727977,
      longitude: -45.3153506,
      description: null,
      phone: null,
    });

    const { gyms } = await sut.execute({
      query: "TypeScript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "TypeScript Gym" }),
    ]);
  });
  it("should be to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        latitude: -22.8727977,
        longitude: -45.3153506,
        description: null,
        phone: null,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
