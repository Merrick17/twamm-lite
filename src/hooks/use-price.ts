import useSWR from "swr";
import { JUPITER_PRICE_ENDPOINT_V4 } from "src/env";

const swrKey = (
  params: { id: string } & Partial<{
    vsToken: string;
    vsAmount: string;
  }>
) => ({
  key: "price",
  params,
});

const fetcher =
  ({ endpoint }: { endpoint: string }) =>
  async ({ params }: SWRParams<typeof swrKey>) => {
    const resp = await fetch(`${endpoint}?ids=${params.id}`);

    if (resp.status === 404) {
      return 0;
    }

    if (resp.status !== 200) {
      throw new Error("Can not fetch the price");
    }

    const data = await resp.json();

    return data.data[params.id].price;
  };

export default (params: Voidable<SWRArgs<typeof swrKey>>, options = {}) => {
  const opts = { endpoint: JUPITER_PRICE_ENDPOINT_V4 };

  return useSWR(params && swrKey(params), fetcher(opts), options);
};
