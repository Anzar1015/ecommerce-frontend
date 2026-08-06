import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { useProduct } from '@/hooks/useProduct';
import { useCategories } from '@/hooks/useCategories';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProductMutations';
import { productFormSchema, type ProductFormSchemaValues } from '@/utils/productValidation';
import { PRODUCT_STATUS_OPTIONS } from '@/constants';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const { data: product } = useProduct(id);
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormSchemaValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { status: 'draft', discount: 0, stock: 0, lowStockThreshold: 5, price: 0 },
  });

  useEffect(() => {
    if (!product) return;
    reset({
      name: product.name,
      description: product.description,
      category: typeof product.category === 'string' ? product.category : product.category.id,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      sku: product.sku,
      brand: product.brand,
      tags: product.tags.join(', '),
      status: product.status,
    });
  }, [product, reset]);

  const isSaving = createProduct.isPending || updateProduct.isPending;

  const onSubmit = async (values: ProductFormSchemaValues) => {
    if (isEditMode) {
      await updateProduct.mutateAsync(values);
    } else {
      await createProduct.mutateAsync(values);
    }
    navigate('/admin/products');
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: 'Products', to: '/admin/products' },
          { label: isEditMode ? 'Edit product' : 'New product' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">
        {isEditMode ? 'Edit product' : 'New product'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex max-w-2xl flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Textarea label="Description" error={errors.description?.message} {...register('description')} />
        <Select
          label="Category"
          placeholder="Select a category"
          error={errors.category?.message}
          options={(categories ?? []).map((category) => ({ value: category.id, label: category.name }))}
          {...register('category')}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register('price')}
          />
          <Input label="Discount %" type="number" error={errors.discount?.message} {...register('discount')} />
          <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock')} />
          <Input
            label="Low stock threshold"
            type="number"
            error={errors.lowStockThreshold?.message}
            {...register('lowStockThreshold')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
          <Input label="Brand" error={errors.brand?.message} {...register('brand')} />
        </div>

        <Input
          label="Tags (comma separated)"
          error={errors.tags?.message}
          {...register('tags')}
        />

        <Select
          label="Status"
          error={errors.status?.message}
          options={PRODUCT_STATUS_OPTIONS}
          {...register('status')}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="images" className="text-sm font-medium text-text-primary">
            Images
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            {...register('images')}
            className="text-sm text-text-secondary"
          />
          {isEditMode && product?.images.length ? (
            <div className="mt-2 flex gap-2">
              {product.images.map((image) => (
                <img key={image.publicId} src={image.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving}>
            {isEditMode ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
