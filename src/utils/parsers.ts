import { readFileSync } from "fs";
import path from "path";
import yaml from "yaml";

export function parseIntProps(obj: Record<string, any>) {
  return Object.entries(obj).reduce((prev, curr) => {
    const [k, v] = curr;
    if (!isNaN(+v)) {
      prev[k] = +v;
    } else {
      prev[k] = v;
    }
    return prev;
  }, {});
}

export function parseSwaggerDoc() {
  const swaggerYml = readFileSync(
    path.join(process.cwd(), "swagger.yml"),
    "utf8"
  );
  return yaml.parse(swaggerYml);
}

export function snakeToCamel(obj: any) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = key.replace(/_\w/g, (m) => m[1].toUpperCase());
    acc[camelKey] = snakeToCamel(value);
    return acc;
  }, {});
}

export function parseISODateStringToDate(dto: any) {
  // 1. field의 value가 배열인 경우,
  // 모든 elements에 대해 재귀적으로 함수 호출
  if (Array.isArray(dto)) {
    dto.forEach((elem) => {
      parseISODateStringToDate(elem);
    });
  } else if (typeof dto === "object") {
    // 2. field가 object인 경우,
    // 각 field를 돌면서 field 명이 "createdAt", "updatedAt", "lastModified"
    // 인 경우, string -> Date로 type 변환해줌
    Object.keys(dto).forEach((key) => {
      if (["createdAt", "updatedAt", "lastModified"].includes(key)) {
        dto[key] = new Date(dto[key]);
      } else if (typeof dto[key] === "object" && dto[key] !== null) {
        // 3. nested object인 경우, 재귀적으로 함수 호출
        parseISODateStringToDate(dto[key]);
      }
    });
  }
}
