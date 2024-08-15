/* eslint-disable react/jsx-key */
import { farcasterHubContext, openframes } from "frames.js/middleware";
import { imagesWorkerMiddleware } from "frames.js/middleware/images-worker";
import { createFrames } from "frames.js/next";
import { DEFAULT_DEBUGGER_HUB_URL } from "../debug";
import { getLensFrameMessage, isLensFrameActionPayload } from "frames.js/lens";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { JsonValue } from "frames.js/types";

export const frames = createFrames({
  basePath: "/frames",
  initialState: {
    pageIndex: 0,
  },
  middleware: [
    imagesWorkerMiddleware({
      imagesRoute: "/images",
    }),
    farcasterHubContext({
      hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
    }),
    openframes({
      clientProtocol: {
        id: "lens",
        version: "1.0.0",
      },
      handler: {
        isValidPayload: (body: JsonValue) => true,
        getFrameMessage: async (body: JsonValue) => {
          const bodyObj: any = body;
          return { ...bodyObj };
        },
      },
    }),
  ],
});
