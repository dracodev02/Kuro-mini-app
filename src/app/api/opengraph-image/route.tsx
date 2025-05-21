import Image from "next/image";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return new ImageResponse(
    (
      <Image
        src={"/immages/kuro-logo.svg"}
        alt="Kuro Logo"
        width={800}
        height={800}
      />
    ),
    {
      width: 800,
      height: 800,
    }
  );
}
