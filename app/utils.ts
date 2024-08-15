import { LensClient, production } from "@lens-protocol/client";
import { headers } from "next/headers";

export function currentURL(pathname: string): URL {
  try {
    const headersList = headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";

    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    console.error(error);
    return new URL("http://localhost:3000");
  }
}

export function appURL() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  } else {
    const url = process.env.APP_URL || vercelURL() || "http://localhost:3000";
    console.warn(
      `Warning: APP_URL environment variable is not set. Falling back to ${url}.`
    );
    return url;
  }
}

export function vercelURL() {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
}

export interface Creator {
  collects_txs: number;
  creator_URL: string;
  publication_creator_name: string;
  publication_creator_profile_id: string;
  publications: number;
  rank: number;
  volume_usd: number;
}

export const LENS_MEDIA_SNAPSHOT_URL =
  "https://ik.imagekit.io/lens/media-snapshot";
export const HEY_IMAGEKIT_URL = "https://ik.imagekit.io/lensterimg";
export const ipfsGateway = "https://gw.ipfs-lens.dev/ipfs";
export const arweaveGateway = "https://gateway.irys.xyz";
export const images = [
  "https://i.ibb.co/4gC83vC/Creator-Leaderboard-Top10.png",
  "https://i.ibb.co/yWTgSth/Creator-Leaderboard1120.png",
  "https://i.ibb.co/wQVWJRf/Creator-Leaderboard2130.png",
  "https://i.ibb.co/gSCcBtd/Creator-Leaderboard3140.png",
  "https://i.ibb.co/6RFQz9N/Creator-Leaderboard4150.png",
];
export const sanitizeDStorageUrl = (hash?: string): string => {
  if (!hash) {
    return "";
  }

  let link = hash.replace(/^Qm[1-9A-Za-z]{44}/gm, `${ipfsGateway}/${hash}`);
  link = link.replace("https://ipfs.io/ipfs/", ipfsGateway);
  link = link.replace("ipfs://ipfs/", ipfsGateway);
  link = link.replace("ipfs://", ipfsGateway);
  link = link.replace("ar://", arweaveGateway);

  return link;
};

export const AVATAR = "tr:w-350,h-350";

export const imageKit = (url: string, name?: string): string => {
  if (!url) {
    return "";
  }

  if (url.includes(LENS_MEDIA_SNAPSHOT_URL)) {
    const splitedUrl = url.split("/");
    const path = splitedUrl[splitedUrl.length - 1];

    return name ? `${LENS_MEDIA_SNAPSHOT_URL}/${name},q-80/${path}` : url;
  }

  if (url.includes(ipfsGateway)) {
    return name ? `${HEY_IMAGEKIT_URL}/fallback/${name},q-80/${url}` : url;
  }

  return url;
};

export const getAvatar = (profile: any, namedTransform = AVATAR): string => {
  const avatarUrl =
    // Lens NFT Avatar fallbacks
    profile?.metadata?.picture?.image?.optimized?.uri ||
    profile?.metadata?.picture?.image?.raw?.uri ||
    // Lens Profile Avatar fallbacks
    profile?.metadata?.picture?.optimized?.uri ||
    profile?.metadata?.picture?.raw?.uri ||
    "";

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export const condenseName = (name: string): string => {
  if (name.length > 20) {
    return `${name.slice(0, 8)}...${name.slice(-8)}`;
  }
  return name;
};

export const fetchProfiles = async (profileIds: string[]) => {
  const client = new LensClient({
    environment: production,
  });

  const profilesById = await client.profile.fetchAll({
    where: { profileIds },
  });

  return {
    profilePics: profilesById.items.map((profile) => getAvatar(profile)),
    handles: profilesById.items.map((profile) => profile.handle?.localName),
  };
};
