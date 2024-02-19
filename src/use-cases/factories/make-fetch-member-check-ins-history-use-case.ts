import { FetchUserCheckInsHistoryUseCase } from "../fetch-member-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchMemberCheckInsHistoryUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository();

  const useCase = new FetchUserCheckInsHistoryUseCase(prismaCheckInsRepository);

  return useCase;
}
