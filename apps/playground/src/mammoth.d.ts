declare module "mammoth/mammoth.browser" {
  interface ExtractRawTextResult {
    value: string;
    messages: unknown[];
  }

  const mammoth: {
    extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<ExtractRawTextResult>;
  };

  export default mammoth;
}
