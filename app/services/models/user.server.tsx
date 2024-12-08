import { prisma } from "../prisma.server";
import { User } from "@prisma/client";

export async function createUser(user: {
  username: string;
  password: string;
  email: string;
}): Promise<User> {
  return await prisma.user.create({
    data: {
      username: user.username,
      password: user.password,
      email: user.email,
    },
  });
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
}

export async function doesUsernameExist(username: string): Promise<boolean> {
  const user = await getUserByUsername(username);
  return user !== null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
}

export async function doesEmailExist(email: string): Promise<boolean> {
  const user = await getUserByEmail(email);
  return user !== null;
}
