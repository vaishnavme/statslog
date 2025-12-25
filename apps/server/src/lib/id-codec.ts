import { customAlphabet } from "nanoid";

const alphanumerics: string = "0123456789abcdefghijklmnopqrstuvwxyz";

const getIdCodec = (size: number) => {
  const idCodecs = customAlphabet(alphanumerics, size);

  return idCodecs();
};

const prefixes = {
  user: "usr", // user
  authSession: "auths", // auth session

  project: "prj", // project
  app: "app", // project app

  visitor: "vis", // visitor
  session: "ses", // visitor session
  pageView: "pgv", // page view
  event: "evt", // event
} as const;

const prefixedId = (prefix: string, size = 15): string => {
  const id = getIdCodec(size);

  return `${prefix}_${id}`;
};

const idCodecs = {
  userId: () => prefixedId(prefixes.user),
  authSessionId: () => prefixedId(prefixes.authSession),

  projectId: () => prefixedId(prefixes.project),
  projectAppId: () => `app_${getIdCodec(12)}`,

  visitorId: () => prefixedId(prefixes.visitor),
  sessionId: () => prefixedId(prefixes.session),
  pageViewId: () => prefixedId(prefixes.pageView),
  eventId: () => prefixedId(prefixes.event),
};

export default idCodecs;
