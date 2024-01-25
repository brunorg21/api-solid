import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";

import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistError } from "./errors/user-alredy-exists-error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("register use case", async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Jhon Doe",
      email: "jhondoe@email.com",
      password: "123",
    });

    const isPasswordCorrectlyHashed = await compare("123", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("shloud not be able to register with same email twice", async () => {
    const email = "jhondoe@email.com";

    await sut.execute({
      name: "Jhon Doe",
      email,
      password: "123",
    });

    await expect(() =>
      sut.execute({
        name: "Jhon Doe",
        email,
        password: "123",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
