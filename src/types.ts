export type FilePath = string;

export type FileSimilarityOptions = {
  root: string;
  ext: string[];
  ignore: string[];
  output: string | null;
};