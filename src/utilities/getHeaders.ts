import { USER_AGENTS } from "../constants/user-agents.js";
type TOptions = {
  mobile?: boolean;
};
export function getHeaders(options: TOptions) {
  const available_agents = USER_AGENTS[options.mobile ? "mobile" : "desktop"];
  const ua =
    available_agents![Math.floor(Math.random() * available_agents?.length!)];

  return {
    accept: "text/html",
    "accept-encoding": "gzip, deflate",
    "accept-language": "en-US,en",
    referer: "https://www.google.com/",
    "upgrade-insecure-requests": 1,
    "user-agent": ua,
  };
}
