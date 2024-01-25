import { expect, describe, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("authenticate use case", async () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      email: "jhondoe@email.com",
      name: "Jhon Doe",
      password_hash: await hash("123", 6),
    });

    const { user } = await sut.execute({
      email: "jhondoe@email.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    expect(() =>
      sut.execute({
        email: "jhondoe@email.com",
        password: "123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      email: "jhondoe@email.com",
      name: "Jhon Doe",
      password_hash: await hash("123", 6),
    });

    expect(() =>
      sut.execute({
        email: "jhondoe@email.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
