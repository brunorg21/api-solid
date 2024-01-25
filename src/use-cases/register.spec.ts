import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistError } from "./errors/user-alredy-exists-error";

describe("register use case", async () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      password: "123",
    });

    const isPasswordCorrectlyHashed = await compare("123", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("shloud not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "jhondoe@email.com";

    await registerUseCase.execute({
      name: "Jhon Doe",
      email,
      password: "123",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "Jhon Doe",
        email,
        password: "123",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
