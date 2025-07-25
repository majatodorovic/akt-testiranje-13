import { get, fetch } from "@/app/api/api";
import CategoryPage from "@/_components/category";
import ProductPage from "@/_components/product";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import { getRobots, handleCategoryRobots } from "@/_functions";

const getBodyForHandleData = () => {
  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host");
  let pathname = headersList.get("x-pathname") || "/";

  if (pathname.match(/\.(css|js|map|mjs|json)$/)) {
    return null;
  }

  if (pathname.startsWith("http")) {
    pathname = new URL(pathname).pathname;
  }

  let fullUrl;
  if (process.env.NEXT_PUBLIC_URL_STRUCTURE_MODE === "test") {
    if (pathname.startsWith("/")) {
      pathname = pathname.slice(1);
    }
    fullUrl = pathname;
  } else {
    fullUrl = `${protocol}://${host}${pathname}`;
  }

  console.log("getBodyForHandleData function, fullUrl", fullUrl);

  return { absolute_link: fullUrl };
};

const handleData = async (body) => {
  console.log("handleData function, body", body);
  return await fetch(`/slugs/identify-route`, { ...body })
    .then((res) => {
      console.log("rest", res);
      return res?.payload;
    })
    .catch((error) => {
      console.log("error", error);
      throw new Error(error);
    });
};

const fetchCategorySEO = async (slug) => {
  return await get(`/categories/product/single/seo/${slug}`).then(
    (response) => {
      return response?.payload;
    },
  );
};

const getProductSEO = async (id) => {
  return await get(`/product-details/seo/${id}`).then((response) => {
    return response?.payload;
  });
};

const defaultMetadata = {
  title: "Početna | Fashion Template",
  description: "Dobrodošli na Fashion Template Online Shop",

  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Početna | Fashion Template",
    description: "Dobrodošli na Fashion Template Online Shop",
    type: "website",
    url: "https://croonus.com",
    image: "https://croonus.com/images/logo.png",
    site_name: "croonus.com",
    locale: "sr_RS",
  },
};

export async function generateMetadata({
  params: { path },
  searchParams: { filteri, sort, viewed, strana },
}) {
  const headersList = headers();
  let canonical = headersList?.get("x-pathname");

  const fullUrl = getBodyForHandleData();

  if (!fullUrl) {
    return null;
  }

  const data = await handleData(fullUrl);

  switch (true) {
    case data?.status === false &&
      data?.type === null &&
      data?.id === null &&
      data?.redirect_url === false:
      return defaultMetadata;

    case data?.type === "category" &&
      data?.status &&
      data?.redirect_url === false:
      const category = await fetchCategorySEO(data?.id);

      if (category) {
        let {
          meta_title: title,
          meta_keywords: keywords,
          meta_description: description,
          meta_image: image,
          meta_canonical_link: canonical_link,
          meta_robots: robots,
          social: { share_title, share_description, share_image },
        } = category;

        return {
          title: title ?? "",
          description: description ?? "",
          keywords: keywords ?? "",
          image: image ?? "",
          alternates: {
            canonical: `${canonical_link ?? canonical}`,
          },
          openGraph: {
            title: `${share_title}` ?? "",

            description: share_description ?? "",
            images: [
              {
                url: share_image ?? "",
                width: 800,
                height: 600,
                alt: share_description ?? "",
                title: share_title ?? "",
                description: share_description ?? "",
              },
            ],
          },
          robots: handleCategoryRobots(strana, filteri, sort, viewed, robots),
        };
      } else {
        return defaultMetadata;
      }

    case data?.type === "product" &&
      data?.status &&
      data?.redirect_url === false:
      const productSEO = await getProductSEO(data?.id);

      let robots = getRobots(productSEO?.meta_robots);

      const image =
        convertHttpToHttps(productSEO?.meta_image) ??
        "https://croonus.com/images/logo.png";
      if (productSEO) {
        return {
          alternates: {
            canonical: `${productSEO?.meta_canonical_link ?? canonical}`,
          },
          description:
            `${productSEO?.meta_title} - ${productSEO?.meta_description}` ?? "",
          keywords: productSEO?.meta_keywords ?? "",
          openGraph: {
            title: `${productSEO?.meta_title}` ?? "",
            description: productSEO?.meta_description ?? "",
            type: "website",
            images: [
              {
                url: image,
                width: 800,
                height: 800,
                alt: productSEO?.meta_title ?? productSEO?.meta_description,
              },
            ],
          },
          robots: robots,
          title: `${productSEO?.meta_title}` ?? "",
        };
      } else {
        return defaultMetadata;
      }
  }
}

const CategoryProduct = async ({ params, searchParams }) => {
  const fullUrl = getBodyForHandleData();

  if (!fullUrl) {
    return null;
  }

  const data = await handleData(fullUrl);

  console.log("CategoryProduct component, data", data);

  if (data?.status === false) {
    console.error(`Something went wrong! Status is false.`);
    return notFound();
  }

  if (fullUrl.absolute_link === data?.redirect_url) {
    console.error(`Something went wrong! Same absolute_link and redirect_url.`);
    return notFound();
  }
  switch (data?.code) {
    case 308:
      return permanentRedirect(`${data?.redirect_url}`);
      break;
    case 200:
      switch (data?.type) {
        case "category":
          return (
            <CategoryPage
              params={params}
              searchParams={searchParams}
              category_id={data?.id}
            />
          );
          break;
        case "product":
          return (
            <ProductPage
              id={data?.id}
              path={params.path}
              category_id={params.path?.[params.path?.length - 2] ?? "*"}
            />
          );
      }
      break;
  }
  return notFound();
};

export default CategoryProduct;
