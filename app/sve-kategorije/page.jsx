import { get } from "@/app/api/api";
import Link from "next/link";
import { headers } from "next/headers";

const getCategories = () => {
  return get("/categories/product/tree").then((res) => res?.payload);
};

const AllCategories = async () => {
  const categories = await getCategories();

  const renderCategories = (categories) => {
    return (categories ?? [])
      ?.filter((item) => !["novo", "akcija", "outlet"].includes(item?.slug))
      ?.map((item, i) => {
        let has_children = item?.children?.length > 0 && item?.children;
        if (has_children) {
          return (
            <div key={item?.id} className={`mb-12`}>
              <div className={`border-b border-black mb-4`}>
                <Link
                  href={`/${item?.link?.link_path}`}
                  className={`hover:text-croonus-3  ${
                    !item?.parent_id ? "text-xl font-bold" : ""
                  }`}
                >
                  {item?.name}
                </Link>
              </div>
              <div className="grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-10 gap-y-8 lg:gap-x-20">
                {item?.children?.map((item, index) => {
                  return (
                    <div key={index}>
                      <Link
                        href={`/${item?.link?.link_path}`}
                        className="font-bold text-[1.1rem] hover:text-croonus-3"
                      >
                        {item.name}
                      </Link>
                      <div className="flex flex-col gap-1 mt-4">
                        {item?.children?.map((item, index) => {
                          return (
                            <Link
                              href={`/${item?.link?.link_path}`}
                              key={index}
                              className="hover:text-croonus-3"
                            >
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else {
          return (
            <div key={item?.id} className={`border-b border-black mb-4`}>
              <Link
                href={`/${item?.link?.link_path}`}
                className={`hover:text-croonus-3 ${
                  !item?.parent_id ? "text-xl font-bold" : ""
                }`}
              >
                {item?.name}
              </Link>
            </div>
          );
        }
      });
  };

  return (
    <div className={`w-[95%] lg:w-[85%] mx-auto`}>
      <div
        className={`text-xl font-normal text-white bg-croonus-1 w-[14rem] pl-5 py-1 mt-5 mb-12`}
      >
        Kategorije
      </div>
      <div>{renderCategories(categories)}</div>
    </div>
  );
};

export default AllCategories;

export const generateMetadata = async () => {
  const header_list = headers();
  let canonical = header_list?.get("x-pathname");
  return {
    title: `Sve kategorije | Stefan Tekstil`,
    description:
      "Sve kategorije proizvoda Stefan kućni tekstil Arilje kao sto su Posteljine, Jorgani, Jastuci, Peskiri...",
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: `Sve kategorije | Stefan Tekstil`,
      description:
        "Sve kategorije proizvoda Stefan kućni tekstil Arilje kao sto su Posteljine, Jorgani, Jastuci, Peskiri...",
      type: "website",
      images: [
        {
          url: "https://api.akt.croonus.com/croonus-uploads/config/b2c/logo-bcca26522da09b0cfc1a9bd381ec4e99.jpg",
          width: 800,
          height: 600,
          alt: "Stefan Tekstil DOO Logo",
        },
      ],
      locale: "sr_RS",
    },
  };
};
