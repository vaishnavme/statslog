import { customAlphabet } from "nanoid";

const alphanumerics: string = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoidCodecs = (size: number) => customAlphabet(alphanumerics, size)();

const prefixes = {
  user: "usr",
  project: "prj",
} as const;

const prefixedId = (prefix: string, size = 15): string => {
  const id = nanoidCodecs(size);

  return `${prefix}_${id}`;
};

const idCodecs = {
  userId: () => prefixedId(prefixes.user),
  projectId: () => prefixedId(prefixes.project),
};

export default idCodecs;
