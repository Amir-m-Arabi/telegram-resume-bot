interface GitHubRepo {
  name: string;
  html_url: string;
}

export async function fetchGithubRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      "User-Agent": "My-Telegram-Bot",
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) throw new Error("GitHub API failed");

  const repos = (await res.json()) as GitHubRepo[]; // ✅

  return repos.map((repo) => ({
    name: repo.name,
    url: repo.html_url,
  }));
}
