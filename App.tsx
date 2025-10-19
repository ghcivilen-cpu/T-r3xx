import React, { useState } from 'react';
import type { ProductMaster, ProductVariant, SaleItem, SaleOrder, ActiveView } from './types';
import { mockProductMasters, mockProductVariants } from './services/mockData';
import InventoryPage from './components/InventoryPage';
import SalesPage from './components/SalesPage';
import ReportsPage from './components/ReportsPage';
import { InventoryIcon, SalesIcon, ReportsIcon } from './components/icons';

const App: React.FC = () => {
  const [products, setProducts] = useState<ProductMaster[]>(mockProductMasters);
  const [variants, setVariants] = useState<ProductVariant[]>(mockProductVariants);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [sales, setSales] = useState<SaleOrder[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('reports');

  const addProduct = (productData: Omit<ProductMaster, 'id'>, variantsData: Omit<ProductVariant, 'id' | 'product_master_id'>[]) => {
    const newProductId = `pm${Date.now()}`;
    const newProduct: ProductMaster = {
      ...productData,
      id: newProductId,
    };
    const newVariants: ProductVariant[] = variantsData.map((v, index) => ({
      ...v,
      id: `pv${Date.now()}${index}`,
      product_master_id: newProductId,
    }));

    setProducts(prev => [...prev, newProduct]);
    setVariants(prev => [...prev, ...newVariants]);
  };

  const updateProduct = (updatedProduct: ProductMaster, finalVariantsFromComponent: ProductVariant[]) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    
    const finalVariantsWithProperIds = finalVariantsFromComponent.map((variant, index) => {
        if (String(variant.id).startsWith('temp_')) {
            return {
                ...variant,
                id: `pv${Date.now()}${index}`
            };
        }
        return variant;
    });

    setVariants(prev => {
        const otherVariants = prev.filter(v => v.product_master_id !== updatedProduct.id);
        return [...otherVariants, ...finalVariantsWithProperIds];
    });

    // Sync cart: remove items for variants that no longer exist
    const updatedVariantIds = new Set(finalVariantsWithProperIds.map(v => v.id));
    setCart(prevCart => prevCart.filter(item => {
        if (item.product_master_id !== updatedProduct.id) {
            return true; // Keep items not related to the updated product
        }
        // For related items, keep them only if their variant still exists
        return updatedVariantIds.has(item.product_variant_id);
    }));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setVariants(prev => prev.filter(v => v.product_master_id !== productId));
    // Also remove items of the deleted product from the cart
    setCart(prevCart => prevCart.filter(item => item.product_master_id !== productId));
  };


  const renderContent = () => {
    switch (activeView) {
      case 'inventory':
        return <InventoryPage 
                  products={products} 
                  variants={variants}
                  onAddProduct={addProduct}
                  onUpdateProduct={updateProduct}
                  onDeleteProduct={deleteProduct}
               />;
      case 'sales':
        return <SalesPage products={products} variants={variants} cart={cart} setCart={setCart} setVariants={setVariants} setSales={setSales} />;
      case 'reports':
        return <ReportsPage products={products} variants={variants} sales={sales} />;
      default:
        return <ReportsPage products={products} variants={variants} sales={sales} />;
    }
  };

  const NavButton: React.FC<{ view: ActiveView; icon: React.ReactNode; label: string; }> = ({ view, icon, label }) => {
    const isActive = activeView === view;
    return (
        <button
            onClick={() => setActiveView(view)}
            className={`flex flex-col items-center justify-center gap-1 w-full py-3 px-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-blue-100 hover:text-blue-700'}`}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-24 bg-white shadow-lg flex flex-col p-2 space-y-4">
          <div className="text-center py-4 text-blue-700 font-bold text-xl">فروشگاه</div>
          <NavButton view="reports" icon={<ReportsIcon className="w-6 h-6" />} label="گزارشات" />
          <NavButton view="inventory" icon={<InventoryIcon className="w-6 h-6" />} label="انبارداری" />
          <NavButton view="sales" icon={<SalesIcon className="w-6 h-6" />} label="فروش" />
      </nav>
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;