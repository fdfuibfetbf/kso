'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import AnimatedSelect from '@/components/ui/animated-select';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';

export interface Category {
  id?: string;
  name: string;
  type: 'main' | 'sub';
  parentId?: string | null;
  parent?: Category | null;
  subcategories?: Category[];
  description?: string;
  status: 'A' | 'I';
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Category>({
    name: '',
    type: 'main',
    parentId: null,
    description: '',
    status: 'A',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      const allCategories = response.data.categories;
      setCategories(allCategories);
      
      // Filter main categories for dropdown
      const mains = allCategories.filter((cat: Category) => cat.type === 'main');
      setMainCategories(mains);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      if (selectedCategory?.id) {
        // Update
        await api.put(`/categories/${selectedCategory.id}`, formData);
        setSuccess('Category updated successfully');
      } else {
        // Create
        await api.post('/categories', formData);
        setSuccess('Category created successfully');
      }
      
      resetForm();
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      parentId: category.parentId || null,
      description: category.description || '',
      status: category.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/categories/${id}`);
      setSuccess('Category deleted successfully');
      if (selectedCategory?.id === id) {
        resetForm();
      }
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'main',
      parentId: null,
      description: '',
      status: 'A',
    });
    setSelectedCategory(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
        <p className="text-sm text-gray-500 mt-1">Add and manage product categories</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{selectedCategory ? 'Edit Category' : 'Add Category'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatedSelect
                  label="Category Type"
                  value={formData.type}
                  onChange={(value) => {
                    const newType = value as 'main' | 'sub';
                    setFormData({
                      ...formData,
                      type: newType,
                      parentId: newType === 'main' ? null : formData.parentId,
                    });
                  }}
                  placeholder="Select category type"
                  options={[
                    { value: 'main', label: 'Main Category' },
                    { value: 'sub', label: 'Sub Category' },
                  ]}
                />

                {formData.type === 'sub' && (
                  <AnimatedSelect
                    label="Parent Category"
                    value={formData.parentId || ''}
                    onChange={(value) =>
                      setFormData({ ...formData, parentId: value || null })
                    }
                    placeholder="Select parent category"
                    options={[
                      { value: '', label: 'Select parent category' },
                      ...mainCategories.map((cat) => ({
                        value: cat.id || '',
                        label: cat.name,
                      })),
                    ]}
                  />
                )}

                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description (optional)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'A' | 'I' })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="A">Active</option>
                    <option value="I">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Saving...' : selectedCategory ? 'Update' : 'Create'}
                  </Button>
                  {selectedCategory && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Categories ({categories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && !categories.length ? (
                <div className="text-center py-8 text-gray-500">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No categories found. Create one to get started.</div>
              ) : (
                <div className="space-y-4">
                  {mainCategories.map((mainCat) => (
                    <div key={mainCat.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{mainCat.name}</span>
                          <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded">
                            Main
                          </span>
                          {mainCat.status === 'I' && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(mainCat)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => mainCat.id && handleDelete(mainCat.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      {mainCat.description && (
                        <p className="text-sm text-gray-600 mb-2">{mainCat.description}</p>
                      )}
                      {mainCat.subcategories && mainCat.subcategories.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-2">
                          <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                            Subcategories
                          </p>
                          {mainCat.subcategories.map((subCat) => (
                            <div
                              key={subCat.id}
                              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">{subCat.name}</span>
                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                  Sub
                                </span>
                                {subCat.status === 'I' && (
                                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(subCat)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => subCat.id && handleDelete(subCat.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

