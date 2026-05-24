'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, Save, X, Upload, Eye, EyeOff,
  Package, LogOut, Search, CheckCircle2,
  AlertCircle, Zap, Image as ImageIcon, ToggleLeft, ToggleRight,
  FileText, ChevronDown, ChevronUp, Battery, Trash,
} from 'lucide-react';
import {
  BRANDS, getProducts, addProduct, updateProduct, deleteProduct, Product,
  getSiteContent, saveSiteContent, SiteContent,
  getBrandImages, setBrandImage, removeBrandImage,
} from '@/lib/data';

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────
const ADMIN_PASSWORD = 'ExideAdmin@2024';

// ──────────────────────────────────────────────
// Validation helpers
// ──────────────────────────────────────────────
interface FormErrors {
  name?: string;
  brand?: string;
  category?: string;
  price?: string;
  warranty?: string;
  description?: string;
  image?: string;
}

function validateForm(data: Partial<Product>): FormErrors {
  const errors: FormErrors = {};
  if (!data.name?.trim()) errors.name = 'Product name is required.';
  else if (data.name.trim().length < 3) errors.name = 'Name must be at least 3 characters.';
  if (!data.brand) errors.brand = 'Please select a brand.';
  if (!data.category?.trim()) errors.category = 'Category is required.';
  if (!data.price || isNaN(Number(data.price))) errors.price = 'Enter a valid price.';
  else if (Number(data.price) <= 0) errors.price = 'Price must be greater than 0.';
  else if (Number(data.price) > 1000000) errors.price = 'Price seems too high.';
  if (!data.warranty?.trim()) errors.warranty = 'Warranty info is required.';
  if (!data.description?.trim()) errors.description = 'Description is required.';
  else if (data.description.trim().length < 10) errors.description = 'Description must be at least 10 characters.';
  return errors;
}

const MAX_IMAGE_SIZE_MB = 2;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      reject(new Error('Only JPG, PNG, and WebP images are allowed.'));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`Image must be under ${MAX_IMAGE_SIZE_MB}MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`));
      return;
    }
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

// ──────────────────────────────────────────────
// Toast
// ──────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-semibold text-sm transition-all duration-300 ${
        type === 'success' ? 'bg-green-700 border border-green-500/40' : 'bg-red-800 border border-red-500/40'
      }`}
    >
      {type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Login screen
// ──────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.trim()) { setError('Password is required.'); return; }
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(204,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(204,0,0,0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className={`relative z-10 w-full max-w-sm bg-dark-2 border border-white/10 rounded-2xl p-8 shadow-2xl ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center glow-red">
            <Zap className="w-9 h-9 text-white fill-white" />
          </div>
        </div>

        <h1
          className="text-3xl text-white text-center mb-1"
          style={{ fontFamily: 'Bebas Neue, serif', letterSpacing: '0.05em' }}
        >
          ADMIN LOGIN
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">Exide Point Admin Panel</p>

        <div className="mb-4">
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5">
            Admin Password
          </label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              placeholder="Enter password"
              className={`admin-input pr-10 ${error ? 'error' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <p className="error-msg mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold tracking-widest uppercase rounded-xl glow-red transition-all hover:scale-105 mt-2"
        >
          Login
        </button>

        <p className="text-center text-gray-600 text-xs mt-6">
          Default password: <span className="text-gray-400 font-mono">ExideAdmin@2024</span>
        </p>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────
// Product Form Modal
// ──────────────────────────────────────────────
interface ProductFormProps {
  initial?: Product | null;
  onSave: (data: Omit<Product, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

// ── Field must be defined OUTSIDE ProductForm so its identity is stable
// across re-renders. Defining it inside causes React to treat it as a new
// component on every keystroke, unmounting the input and losing focus.
type FieldForm = {
  name: string; brand: string; category: string;
  price: string; warranty: string; description: string;
  image: string; inStock: boolean;
};

function Field({
  label, name, type = 'text', placeholder, as,
  form, errors, onSet, onClearError,
}: {
  label: string;
  name: keyof FieldForm;
  type?: string;
  placeholder?: string;
  as?: 'textarea' | 'select';
  form: FieldForm;
  errors: FormErrors;
  onSet: (key: string, value: string | boolean) => void;
  onClearError: (key: string) => void;
}) {
  const hasError = !!errors[name as keyof FormErrors];
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5">
        {label} <span className="text-primary">*</span>
      </label>
      {as === 'textarea' ? (
        <textarea
          value={form[name] as string}
          onChange={e => { onSet(name, e.target.value); onClearError(name); }}
          placeholder={placeholder}
          rows={3}
          className={`admin-input resize-none ${hasError ? 'error' : ''}`}
        />
      ) : as === 'select' ? (
        <select
          value={form[name] as string}
          onChange={e => { onSet(name, e.target.value); onClearError(name); }}
          className={`admin-input ${hasError ? 'error' : ''}`}
        >
          <option value="">Select Brand</option>
          {BRANDS.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={form[name] as string}
          onChange={e => { onSet(name, e.target.value); onClearError(name); }}
          placeholder={placeholder}
          className={`admin-input ${hasError ? 'error' : ''}`}
        />
      )}
      {hasError && (
        <p className="error-msg flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          {errors[name as keyof FormErrors]}
        </p>
      )}
    </div>
  );
}

function ProductForm({ initial, onSave, onClose }: ProductFormProps) {
  const [form, setForm] = useState<FieldForm>({
    name: initial?.name || '',
    brand: initial?.brand || '',
    category: initial?.category || '',
    price: initial?.price?.toString() || '',
    warranty: initial?.warranty || '',
    description: initial?.description || '',
    image: initial?.image || '',
    inStock: initial?.inStock ?? true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imgPreview, setImgPreview] = useState(initial?.image || '');
  const [imgErr, setImgErr] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = useCallback((key: string, value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value })), []);

  const clearError = useCallback((key: string) =>
    setErrors(prev => ({ ...prev, [key]: '' })), []);

  const handleImageFile = async (file: File) => {
    setImgErr('');
    try {
      const base64 = await readImageFile(file);
      set('image', base64);
      setImgPreview(base64);
    } catch (e: any) {
      setImgErr(e.message);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm({ ...form, price: Number(form.price) });
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      name: form.name.trim(),
      brand: form.brand,
      category: form.category.trim(),
      price: Number(form.price),
      warranty: form.warranty.trim(),
      description: form.description.trim(),
      image: form.image,
      inStock: form.inStock,
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl bg-dark-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white tracking-wide">
            {initial ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5">
              Product Image <span className="text-gray-600 normal-case font-normal">(Max 2MB · JPG/PNG/WebP)</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl cursor-pointer transition-all h-40 flex flex-col items-center justify-center gap-2 ${
                dragging
                  ? 'border-primary bg-primary/10'
                  : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
              }`}
            >
              {imgPreview ? (
                <img src={imgPreview} alt="Preview" className="h-full w-full object-contain rounded-xl p-2" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-500" />
                  <span className="text-gray-500 text-sm">Click or drag & drop image</span>
                  <span className="text-gray-600 text-xs">Max size: 2MB</span>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
              }}
            />
            {imgErr && (
              <p className="error-msg flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {imgErr}
              </p>
            )}
            {imgPreview && (
              <button
                type="button"
                onClick={() => { setImgPreview(''); set('image', ''); }}
                className="text-xs text-red-400 hover:text-red-300 mt-1 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove image
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Product Name" name="name" placeholder="e.g. Exide Matrix 35Ah" form={form} errors={errors} onSet={set} onClearError={clearError} />
            <Field label="Brand" name="brand" as="select" form={form} errors={errors} onSet={set} onClearError={clearError} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Category" name="category" placeholder="e.g. Car Battery, Inverter Battery" form={form} errors={errors} onSet={set} onClearError={clearError} />
            <Field label="Price (₹)" name="price" type="number" placeholder="e.g. 3499" form={form} errors={errors} onSet={set} onClearError={clearError} />
          </div>

          <Field label="Warranty Period" name="warranty" placeholder="e.g. 36 Months, 48 Months" form={form} errors={errors} onSet={set} onClearError={clearError} />
          <Field label="Description" name="description" as="textarea" placeholder="Brief product description..." form={form} errors={errors} onSet={set} onClearError={clearError} />

          <div className="flex items-center justify-between p-4 rounded-xl bg-dark-3 border border-white/10">
            <div>
              <div className="text-white font-semibold">In Stock</div>
              <div className="text-gray-500 text-xs mt-0.5">Toggle product availability</div>
            </div>
            <button
              type="button"
              onClick={() => set('inStock', !form.inStock)}
              className={`transition-colors ${form.inStock ? 'text-green-400' : 'text-gray-600'}`}
            >
              {form.inStock
                ? <ToggleRight className="w-10 h-10" />
                : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/10 bg-dark-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-white/20 text-gray-400 hover:text-white rounded-xl font-bold text-sm tracking-widest uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm tracking-widest uppercase glow-red transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {initial ? 'Update' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────
// Delete Confirm Modal
// ──────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-dark-2 border border-red-900/40 rounded-2xl p-6 shadow-2xl">
        <div className="w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Delete Product?</h3>
        <p className="text-gray-400 text-sm mb-6">
          Are you sure you want to delete <strong className="text-white">{name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-white/20 text-gray-400 hover:text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Site Content Editor — shared sub-components
// Defined OUTSIDE SiteContentEditor so their identity is stable across
// re-renders. Defining them inside causes React to unmount/remount on every
// keystroke (focus loss) or every state change (accordion flicker).
// ──────────────────────────────────────────────

function ContentSection({
  id, title, openSection, onToggle, children,
}: {
  id: string; title: string; openSection: string | null;
  onToggle: (id: string) => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-dark-3 border border-white/10 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-bold tracking-wide">{title}</span>
        {openSection === id
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {openSection === id && (
        <div className="px-5 pb-5 border-t border-white/10 space-y-4 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function ContentField({
  label, value, onChange, placeholder, multiline = false, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">
        {label}
      </label>
      {hint && <p className="text-gray-600 text-xs mb-1">{hint}</p>}
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="admin-input resize-none text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="admin-input text-sm"
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Site Content Editor
// ──────────────────────────────────────────────
function SiteContentEditor({ onToast }: { onToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [content, setContent] = useState<SiteContent>(getSiteContent());
  const [brandImages, setBrandImagesState] = useState<Record<string, string>>(getBrandImages());
  const [openSection, setOpenSection] = useState<string | null>('general');
  const [saving, setSaving] = useState(false);
  const brandFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const update = useCallback(<K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNested = useCallback(<K extends keyof SiteContent>(
    key: K,
    index: number,
    field: string,
    value: string
  ) => {
    setContent(prev => {
      const arr = [...(prev[key] as any[])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
  }, []);

  const toggleSection = useCallback((id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  }, []);

  const handleSave = () => {
    setSaving(true);
    saveSiteContent(content);
    // Trigger storage event for same-tab updates (components listen to storage)
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => {
      setSaving(false);
      onToast('Site content saved! Changes are live on the website.', 'success');
    }, 300);
  };

  const handleBrandImage = async (brandId: string, file: File) => {
    try {
      const base64 = await readImageFile(file);
      setBrandImage(brandId, base64);
      setBrandImagesState(getBrandImages());
      window.dispatchEvent(new Event('storage'));
      onToast(`Brand image updated for ${BRANDS.find(b => b.id === brandId)?.name}`, 'success');
    } catch (e: any) {
      onToast(e.message, 'error');
    }
  };

  const handleRemoveBrandImage = (brandId: string) => {
    removeBrandImage(brandId);
    setBrandImagesState(getBrandImages());
    window.dispatchEvent(new Event('storage'));
    onToast('Brand image removed.', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Site Content</h2>
          <p className="text-gray-500 text-xs mt-0.5">Edit all text and content across the website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-widest uppercase rounded-xl glow-red transition-all hover:scale-105 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {/* Brand Images */}
      <ContentSection id="brandimages" title="🔋 Brand Images (Battery Photos)" openSection={openSection} onToggle={toggleSection}>
        <p className="text-gray-500 text-xs mb-3">
          Upload battery/brand images for each brand. These replace the emoji icons in the brand grid and brand pages.
          Recommended: transparent PNG, square, under 2MB.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BRANDS.map(brand => {
            const img = brandImages[brand.id];
            return (
              <div key={brand.id} className="flex flex-col items-center gap-2">
                <div
                  className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed transition-all hover:border-primary/50"
                  style={{ background: `${brand.color}11`, borderColor: img ? `${brand.color}66` : undefined }}
                  onClick={() => brandFileRefs.current[brand.id]?.click()}
                >
                  {img ? (
                    <img src={img} alt={brand.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-600">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-10 h-10 object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <Upload className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-white text-xs font-bold">{brand.name}</div>
                  <div className="flex gap-1 mt-1 justify-center">
                    <button
                      type="button"
                      onClick={() => brandFileRefs.current[brand.id]?.click()}
                      className="text-[10px] text-primary hover:text-primary-light font-semibold"
                    >
                      {img ? 'Change' : 'Upload'}
                    </button>
                    {img && (
                      <>
                        <span className="text-gray-700">·</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBrandImage(brand.id)}
                          className="text-[10px] text-red-400 hover:text-red-300 font-semibold"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <input
                  ref={el => { brandFileRefs.current[brand.id] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleBrandImage(brand.id, file);
                    e.target.value = '';
                  }}
                />
              </div>
            );
          })}
        </div>
      </ContentSection>

      {/* General / Navbar */}
      <ContentSection id="general" title="🔷 Navbar & General" openSection={openSection} onToggle={toggleSection}>
        <div className="grid sm:grid-cols-3 gap-4">
          <ContentField label="Site Title" value={content.navbarTitle} onChange={v => update('navbarTitle', v)} placeholder="EXIDE POINT" />
          <ContentField label="Site Subtitle" value={content.navbarSubtitle} onChange={v => update('navbarSubtitle', v)} placeholder="& Spare Parts" />
          <ContentField label="Phone Number" value={content.navPhone} onChange={v => update('navPhone', v)} placeholder="+918513908681" hint="Used in Call Now buttons (no spaces)" />
        </div>
      </ContentSection>

      {/* Hero Slides */}
      <ContentSection id="hero" title="🎯 Hero Slides" openSection={openSection} onToggle={toggleSection}>
        {content.heroSlides.map((slide, i) => (
          <div key={i} className="border border-white/10 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Slide {i + 1}</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <ContentField label="Title" value={slide.title} onChange={v => updateNested('heroSlides', i, 'title', v)} placeholder="POWER YOUR LIFE" />
              <ContentField label="Subtitle" value={slide.subtitle} onChange={v => updateNested('heroSlides', i, 'subtitle', v)} placeholder="Premium Battery Solutions" />
            </div>
            <ContentField label="Badge Text" value={slide.badge} onChange={v => updateNested('heroSlides', i, 'badge', v)} placeholder="Authorized multi brand retailer" />
            <ContentField label="Description" value={slide.desc} onChange={v => updateNested('heroSlides', i, 'desc', v)} multiline placeholder="Slide description..." />
            <ContentField label="Icon (emoji)" value={slide.icon} onChange={v => updateNested('heroSlides', i, 'icon', v)} placeholder="⚡" hint="Any emoji shown in the rotating circle" />
          </div>
        ))}
      </ContentSection>

      {/* Hero Stats */}
      <ContentSection id="stats" title="📊 Hero Stats Bar" openSection={openSection} onToggle={toggleSection}>
        {content.heroStats.map((stat, i) => (
          <div key={i} className="grid sm:grid-cols-2 gap-3">
            <ContentField label={`Stat ${i + 1} Label`} value={stat.label} onChange={v => updateNested('heroStats', i, 'label', v)} placeholder="Brands Available" />
            <ContentField label={`Stat ${i + 1} Value`} value={stat.value} onChange={v => updateNested('heroStats', i, 'value', v)} placeholder="8+" />
          </div>
        ))}
      </ContentSection>

      {/* Brands Section */}
      <ContentSection id="brands" title="🏷️ Brands Section" openSection={openSection} onToggle={toggleSection}>
        <ContentField label="Section Label (small text)" value={content.brandsSectionLabel} onChange={v => update('brandsSectionLabel', v)} placeholder="Our Collection" />
        <ContentField label="Section Title (big heading)" value={content.brandsSectionTitle} onChange={v => update('brandsSectionTitle', v)} placeholder="PREMIUM BRANDS" />
        <ContentField label="Section Description" value={content.brandsSectionDesc} onChange={v => update('brandsSectionDesc', v)} multiline placeholder="We stock only genuine..." />
      </ContentSection>

      {/* Services Section */}
      <ContentSection id="services" title="⚙️ Services Section" openSection={openSection} onToggle={toggleSection}>
        <div className="grid sm:grid-cols-2 gap-3">
          <ContentField label="Section Label" value={content.servicesSectionLabel} onChange={v => update('servicesSectionLabel', v)} placeholder="What We Offer" />
          <ContentField label="Section Title" value={content.servicesSectionTitle} onChange={v => update('servicesSectionTitle', v)} placeholder="OUR SERVICES" />
        </div>
        <div className="mt-2 space-y-3">
          {content.services.map((svc, i) => (
            <div key={i} className="border border-white/10 rounded-xl p-3 space-y-2">
              <div className="text-xs font-bold text-gray-500 tracking-widest uppercase">Service {i + 1}</div>
              <ContentField label="Title" value={svc.title} onChange={v => updateNested('services', i, 'title', v)} />
              <ContentField label="Description" value={svc.desc} onChange={v => updateNested('services', i, 'desc', v)} multiline />
            </div>
          ))}
        </div>
      </ContentSection>

      {/* About Section */}
      <ContentSection id="about" title="ℹ️ About Section" openSection={openSection} onToggle={toggleSection}>
        <div className="grid sm:grid-cols-2 gap-3">
          <ContentField label="Section Label" value={content.aboutLabel} onChange={v => update('aboutLabel', v)} placeholder="About Us" />
          <ContentField label="Card Title" value={content.aboutCardTitle} onChange={v => update('aboutCardTitle', v)} placeholder="EXIDE POINT" />
        </div>
        <ContentField label="Main Heading" value={content.aboutTitle} onChange={v => update('aboutTitle', v)} placeholder="YOUR TRUSTED BATTERY PARTNER" />
        <ContentField label="Card Subtitle" value={content.aboutCardSubtitle} onChange={v => update('aboutCardSubtitle', v)} placeholder="& Spare Parts" />
        <ContentField label="Paragraph 1" value={content.aboutPara1} onChange={v => update('aboutPara1', v)} multiline />
        <ContentField label="Paragraph 2" value={content.aboutPara2} onChange={v => update('aboutPara2', v)} multiline />
        <div>
          <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Feature Bullets (one per line)</label>
          <textarea
            value={content.aboutFeatures.join('\n')}
            onChange={e => update('aboutFeatures', e.target.value.split('\n').filter(Boolean))}
            rows={6}
            className="admin-input resize-none text-sm"
            placeholder="Authorized multi brand retailer for 8+ battery brands&#10;Free battery testing..."
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <ContentField label="Location" value={content.aboutLocation} onChange={v => update('aboutLocation', v)} />
          <ContentField label="Phone (display)" value={content.aboutPhone} onChange={v => update('aboutPhone', v)} />
          <ContentField label="Hours" value={content.aboutHours} onChange={v => update('aboutHours', v)} />
        </div>
      </ContentSection>

      {/* Footer */}
      <ContentSection id="footer" title="🦶 Footer" openSection={openSection} onToggle={toggleSection}>
        <ContentField label="Footer Description" value={content.footerDesc} onChange={v => update('footerDesc', v)} multiline />
        <div className="grid sm:grid-cols-2 gap-3">
          <ContentField label="Facebook URL" value={content.footerFacebookUrl} onChange={v => update('footerFacebookUrl', v)} />
          <ContentField label="Email" value={content.footerEmail} onChange={v => update('footerEmail', v)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <ContentField label="Address" value={content.footerAddress} onChange={v => update('footerAddress', v)} />
          <ContentField label="Phone 1" value={content.footerPhone1} onChange={v => update('footerPhone1', v)} />
          <ContentField label="Phone 2" value={content.footerPhone2} onChange={v => update('footerPhone2', v)} />
          <ContentField label="Working Hours" value={content.footerHours} onChange={v => update('footerHours', v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <ContentField label="Creator Name" value={content.footerCreatorName} onChange={v => update('footerCreatorName', v)} />
          <ContentField label="Creator URL (Instagram/site)" value={content.footerCreatorUrl} onChange={v => update('footerCreatorUrl', v)} />
        </div>
      </ContentSection>

      {/* Save button at bottom */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-widest uppercase rounded-xl glow-red transition-all hover:scale-105 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Product Row
// ──────────────────────────────────────────────
function ProductRow({
  product, onEdit, onDelete, onToggleStock,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onToggleStock: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const brand = BRANDS.find(b => b.name === product.brand);

  return (
    <div className="bg-dark-3 border border-white/5 hover:border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all">
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-dark-4 shrink-0">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full img-placeholder rounded-xl flex items-center justify-center">
            {brand?.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-12 h-12 object-contain p-1"
                onError={(e) => { e.currentTarget.replaceWith(Object.assign(document.createElement('span'), { className: 'text-xl text-white/30', textContent: brand.name[0] })); }}
              />
            ) : (
              <ImageIcon className="w-8 h-8" />
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-white font-bold text-base truncate">{product.name}</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: `${brand?.color || '#CC0000'}22`, color: brand?.color || '#CC0000', border: `1px solid ${brand?.color || '#CC0000'}44` }}
          >
            {product.brand}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span>📦 {product.category}</span>
          <span>🛡️ {product.warranty}</span>
          <span className="text-accent font-bold text-sm">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-gray-600 text-xs mt-1 truncate">{product.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleStock}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            product.inStock
              ? 'bg-green-900/30 text-green-400 border border-green-800/50 hover:bg-green-900/50'
              : 'bg-red-900/30 text-red-400 border border-red-800/50 hover:bg-red-900/50'
          }`}
        >
          {product.inStock ? '● In Stock' : '● Out'}
        </button>

        <button
          onClick={() => onEdit(product)}
          className="p-2 rounded-lg bg-dark-4 border border-white/10 text-gray-400 hover:text-white hover:border-primary/40 transition-all"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(product)}
          className="p-2 rounded-lg bg-dark-4 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-900/50 transition-all"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Admin Panel
// ──────────────────────────────────────────────
type Tab = 'products' | 'content';

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('products');

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === '1') setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) setProducts(getProducts());
  }, [authed]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  const handleSave = (data: Omit<Product, 'id' | 'createdAt'>) => {
    if (editing) {
      updateProduct(editing.id, data);
      showToast('Product updated successfully!');
    } else {
      addProduct(data);
      showToast('Product added successfully!');
    }
    setProducts(getProducts());
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (product: Product) => setDeleteTarget(product);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setProducts(getProducts());
    showToast('Product deleted.', 'error');
    setDeleteTarget(null);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setShowForm(true);
  };

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brandFilter === 'All' || p.brand === brandFilter;
    return matchSearch && matchBrand;
  });

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    brands: new Set(products.map(p => p.brand)).size,
  };

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
      {showForm && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {/* Sidebar — desktop only */}
      <aside className="admin-sidebar w-64 shrink-0 hidden md:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center glow-red">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="leading-none">
              <div className="text-white font-bold tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, serif' }}>
                EXIDE POINT
              </div>
              <div className="text-primary text-[9px] tracking-widest uppercase">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
              activeTab === 'products'
                ? 'bg-primary/10 border border-primary/30 text-primary'
                : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Package className="w-4 h-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
              activeTab === 'content'
                ? 'bg-primary/10 border border-primary/30 text-primary'
                : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            Site Content
          </button>
        </nav>

        {/* Stats */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {[
            { label: 'Total Products', value: stats.total },
            { label: 'In Stock', value: stats.inStock, color: 'text-green-400' },
            { label: 'Brands', value: stats.brands, color: 'text-accent' },
          ].map(s => (
            <div key={s.label} className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{s.label}</span>
              <span className={`font-bold ${s.color || 'text-white'}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar — visible only on small screens */}
        <div className="md:hidden bg-dark-2 border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow-red">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-bold tracking-widest text-sm" style={{ fontFamily: 'Bebas Neue, serif' }}>
              EXIDE POINT
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide transition-all ${
                activeTab === 'products'
                  ? 'bg-primary/20 border border-primary/40 text-primary'
                  : 'text-gray-500 hover:text-white border border-transparent'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide transition-all ${
                activeTab === 'content'
                  ? 'bg-primary/20 border border-primary/40 text-primary'
                  : 'text-gray-500 hover:text-white border border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Site Content
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white border border-transparent hover:border-white/10 transition-all"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {activeTab === 'products' ? (
          <>
            {/* Topbar */}
            <header className="bg-dark-2 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">Product Management</h1>
                <p className="text-gray-500 text-xs mt-0.5">{filtered.length} of {products.length} products</p>
              </div>
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm tracking-widest uppercase rounded-xl glow-red transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </header>

            {/* Filters */}
            <div className="bg-dark-2 border-b border-white/10 px-6 py-3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-3 border border-white/10 focus:border-primary/50 text-white rounded-xl text-sm outline-none transition-colors"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                />
              </div>

              <select
                value={brandFilter}
                onChange={e => setBrandFilter(e.target.value)}
                className="px-4 py-2 bg-dark-3 border border-white/10 focus:border-primary/50 text-white rounded-xl text-sm outline-none transition-colors"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                <option value="All">All Brands</option>
                {BRANDS.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-6">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Package className="w-12 h-12 text-gray-700 mb-3" />
                  <p className="text-gray-500 font-semibold">No products found</p>
                  <p className="text-gray-700 text-sm mt-1">Add a product to get started.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filtered.map(product => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStock={() => {
                        updateProduct(product.id, { inStock: !product.inStock });
                        setProducts(getProducts());
                        showToast('Stock status updated.');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <header className="bg-dark-2 border-b border-white/10 px-6 py-4">
              <h1 className="text-xl font-bold text-white tracking-wide">Site Content Editor</h1>
              <p className="text-gray-500 text-xs mt-0.5">All changes are saved to browser storage and instantly reflected on the site</p>
            </header>
            <div className="flex-1 overflow-auto p-6">
              <SiteContentEditor onToast={showToast} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
