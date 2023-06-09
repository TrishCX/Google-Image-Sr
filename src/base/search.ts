import axios from "axios";
import {
  generateRandomString,
  getHeaders,
  getRandomInt,
  getStringBetweenStrings,
} from "../utilities/index.js";
import { getPayload } from "../constants/Payload.js";
import { IResults } from "../typings/Results.js";
import { IOptions } from "../typings/Options.js";

export default async function search(query: string, options?: IOptions) {
  if (!query) throw new Error("The query cannot be empty.");

  const formData = new URLSearchParams();
  const includeString = !options?.include
    ? query
    : `${query}    site:"${options?.include}"`;
  const params = !options?.safe ? {} : { safe: "active" };
  const utfPayload = getPayload(includeString);
  formData.append("f.req", JSON.stringify(utfPayload));
  formData.append("at", `${generateRandomString(29)}:${Date.now()}`);
  const response = await axios.post(
    `https://www.google.com/_/VisualFrontendUi/data/batchexecute`,
    formData,
    {
      params: {
        rpcids: "HoAMBc",
        "source-path": "/search",
        "f.sid": -getRandomInt(0, 9e10),
        bl: "boq_visualfrontendserver_20220505.05_p0",
        hl: "en",
        authuser: 0,
        _reqid: -getRandomInt(0, 9e5),
        ...params,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        ...getHeaders({ mobile: !options?.userAgent?.mobile ? false : true }),
      },
      ...{},
    }
  );
  const res =
    "[null" +
    (getStringBetweenStrings(response.data, '"[null', ']"') || "") +
    "]";
  const data = JSON.parse(res.replace(/\\"/g, '"').replace(/\\\\"/g, "'"));
  const items = data[56]?.[1]?.[0]?.[0]?.[1]?.[0];
  const array: IResults[] = [];
  items.map((el: any) => {
    const item = el[0]?.[0]?.["444383007"];
    if (!item?.[1]) return;

    const imageData = item[1]?.filter((el: any) => Array.isArray(el));
    const image = imageData?.[1];
    const title = item[1]?.find((el: any) => el?.[2001])["2008"][1];
    const url = item[1]?.find((el: any) => el?.[2001])["2003"][2];
    const imageURL = decodeURIComponent(
      JSON.parse('"' + image[0].replace(/"/g, '"') + '"')
    );
    array.push({
      title,
      url,
      image: imageURL,
    });
  });
  return array;
}
