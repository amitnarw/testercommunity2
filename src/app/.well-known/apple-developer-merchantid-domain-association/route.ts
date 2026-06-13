import { NextResponse } from "next/server";

const FILE_CONTENT = `{"version":1,"pspId":"1EDBF0FDBF5FA2065E29979C27D7CC7C95341B4E065BD8D8831658022009A572","createdOn":1749646752541}`;

export async function GET() {
  return new NextResponse(FILE_CONTENT, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
