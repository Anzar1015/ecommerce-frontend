export interface CategoryImage {
  url: string;
  publicId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormValues {
  name: string;
  description?: string;
  isActive?: boolean;
  image?: FileList;
}
