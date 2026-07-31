import gradientDescent from "./bytes/gradient-descent";
import precisionAndRecall from "./bytes/precision-and-recall";
import pythonFunctionsAndTests from "./bytes/python-functions-and-tests";
import pythonListsForData from "./bytes/python-lists-for-data";
import tensorsAndShapes from "./bytes/tensors-and-shapes";
import type { Byte } from "./types";

export type { Byte, ByteQuestion, CodeExercise, SkillId } from "./types";

export const BYTES: readonly Byte[] = [
  precisionAndRecall,
  gradientDescent,
  tensorsAndShapes,
  pythonListsForData,
  pythonFunctionsAndTests,
].sort((a, b) => a.order - b.order);

export function getByte(slug: string): Byte | undefined {
  return BYTES.find((b) => b.slug === slug);
}

export function allSlugs(): string[] {
  return BYTES.map((b) => b.slug);
}
