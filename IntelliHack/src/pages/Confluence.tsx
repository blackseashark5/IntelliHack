import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Search, Plus, FolderOpen, Star, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface Page {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  author: string;
  space: string;
  starred: boolean;
}

const mockPages: Page[] = [
  {
    id: '1',
    title: 'Project Documentation',
    content: '<h1>Project Overview</h1><p>This document outlines...</p>',
    lastModified: '2024-03-20',
    author: 'John Doe',
    space: 'Engineering',
    starred: false
  },
  // Add more mock pages
];

export function Confluence() {
  const [pages, setPages] = useState(mockPages);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreatePage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPage: Page = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      lastModified: new Date().toISOString().split('T')[0],
      author: 'John Doe',
      space: formData.get('space') as string,
      starred: false
    };

    setPages([...pages, newPage]);
    toast.success('Page created successfully');
    setEditing(false);
  };

  const handleStarPage = (pageId: string) => {
    setPages(pages.map(page =>
      page.id === pageId ? { ...page, starred: !page.starred } : page
    ));
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Confluence</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setEditing(true)}
        >
          <Plus size={20} />
          Create Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-lg p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2">
                <FolderOpen size={20} />
                All Pages
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2">
                <Star size={20} />
                Starred
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2">
                <Clock size={20} />
                Recent
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium mb-2">Spaces</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded">
                <Users size={20} />
                <span>Engineering</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded">
                <Users size={20} />
                <span>Marketing</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded">
                <Users size={20} />
                <span>Sales</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          {!editing && !selectedPage && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="divide-y">
                {filteredPages.map((page) => (
                  <div
                    key={page.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedPage(page)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarPage(page.id);
                          }}
                          className={`text-gray-400 hover:text-yellow-400 ${
                            page.starred ? 'text-yellow-400' : ''
                          }`}
                        >
                          <Star size={20} />
                        </button>
                        <div>
                          <div className="font-medium">{page.title}</div>
                          <div className="text-sm text-gray-600">
                            {page.space} • Last modified {page.lastModified}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        by {page.author}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPage && !editing && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">{selectedPage.title}</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setSelectedPage(null);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedPage(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                className="prose max-w-none"
              />
            </div>
          )}

          {editing && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleCreatePage}>
                <div className="mb-6">
                  <input
                    type="text"
                    name="title"
                    placeholder="Page Title"
                    className="w-full text-2xl font-semibold border-b pb-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <select
                    name="space"
                    className="px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Space</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>

                <Editor
                  apiKey="your-tinymce-api-key"
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help'
                  }}
                />

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}