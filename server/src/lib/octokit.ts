import { Octokit } from "@octokit/rest";
import { prisma } from "./prisma";

export async function getOctokitForRepo(repoid: string): Promise<Octokit> {
  const repo = await prisma.repository.findUnique({
    where: {
      id: repoid,
    },
    include: {
      user: { select: { githubToken: true } },
    },
  });

  if (!repo?.user?.githubToken) {
    throw new Error(`No Github Token found for Repository ${repoid}`);
  }
  return new Octokit({
    auth: repo.user.githubToken,
  });
}

export async function getOctokitForUser(userid: string): Promise<Octokit> {
  const user = await prisma.user.findUnique({
    where: {
      id: userid,
    },
    select: {
      githubToken: true,
    },
  });
  if (!user?.githubToken) {
    throw new Error(`No Github Token found for User ${userid}`);
  }
  return new Octokit({
    auth: user.githubToken,
  });
}
