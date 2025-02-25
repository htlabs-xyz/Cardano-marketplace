import axios from "axios";
import { decodeFirst, Tagged } from "cbor";
import { BlockfrostProvider } from "@meshsdk/core";


export const parseHttpError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return JSON.stringify({
        data: error.response.data,
        headers: error.response.headers,
        status: error.response.status,
      });
    } else if (error.request && !(error.request instanceof XMLHttpRequest)) {
      return JSON.stringify(error.request);
    } else {
      return JSON.stringify({ code: error.code, message: error.message });
    }
  } else {
    return JSON.stringify(error);
  }
};

export const parseError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
};

export const readPlutusData = async ({ plutusData }: { plutusData: string }) => {
        const datum = await convertInlineDatum({ inlineDatum: plutusData });
        return {
            policyId: datum?.fields[0].bytes,
            assetName: datum?.fields[1].bytes,
            seller: datum?.fields[2].bytes,
            price: datum?.fields[3].int,
        };
    }


export const blockfrostProvider = new BlockfrostProvider(process.env.BLOCKFROST_API_KEY || "");

export function convertToJSON(decoded: any) {
    if (Buffer.isBuffer(decoded)) {
        return { bytes: decoded.toString("hex") };
    } else if (typeof decoded === "number") {
        return { int: decoded };
    } else if (typeof decoded === "bigint") {
        return { int: decoded.toString() };
    } else if (decoded instanceof Tagged) {
        const fields = decoded.value.map(function (item: any) {
            if (Buffer.isBuffer(item)) {
                return { bytes: item.toString("hex") };
            } else if (typeof item === "number") {
                return { int: item };
            } else {
                return null;
            }
        });

        return {
            fields: fields.filter(function (item: any) {
                return item !== null;
            }),
            constructor: decoded.tag,
        };
    }
}
export const convertInlineDatum = async function ({ inlineDatum }: { inlineDatum: string }) {
    try {
        const cborDatum: Buffer = Buffer.from(inlineDatum, "hex");
        const decoded = await decodeFirst(cborDatum);
        const jsonStructure = {
            fields: decoded.value.map((item: any) => convertToJSON(item)),
            constructor: decoded.tag,
        };
        return jsonStructure;
    } catch (error) {
        return null;
    }
};
