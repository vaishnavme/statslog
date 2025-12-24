import { customAlphabet } from "nanoid";

const alphanumerics: string = "0123456789abcdefghijklmnopqrstuvwxyz";
const getIdCodec = (size: number) => {
  const idCodecs = customAlphabet(alphanumerics, size);

  return idCodecs();
};

const prefixes = {
  user: "usr",
  project: "prj",
  session: "ses",
} as const;

const prefixedId = (prefix: string, size = 15): string => {
  const id = getIdCodec(size);

  return `${prefix}_${id}`;
};

const idCodecs = {
  userId: () => prefixedId(prefixes.user),
  projectId: () => prefixedId(prefixes.project),
  sessionId: () => prefixedId(prefixes.session),
};

export default idCodecs;
