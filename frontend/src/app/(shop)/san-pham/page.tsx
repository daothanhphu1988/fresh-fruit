import { Suspense } from "react";
import { ProductListing } from "./product-listing";

export default function ProductListingPage() {
  return (
    <Suspense>
      <ProductListing />
    </Suspense>
  );
}
