/** Subset of Product fields the wishlist API actually populates. */
export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  images: { url: string; publicId: string }[];
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  status: string;
  ratings: {
    average: number;
    count: number;
  };
}

export interface Wishlist {
  id: string;
  products: WishlistProduct[];
}
