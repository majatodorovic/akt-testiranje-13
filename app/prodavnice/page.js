import Link from "next/link";
import ProdavnicePage from "@/components/MarketsPage/ProdavnicePage";
import { headers } from "next/headers";

const Prodavnice = () => {
  return (
    <>
      <ProdavnicePage />
    </>
  );
};

export default Prodavnice;

export const generateMetadata = async ({ searchParams: { search } }) => {
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: `Prodavnice | Stefan Tekstil`,
    description: "Dobrodošli na Stefan Tekstil Online Shop",
  };
};
