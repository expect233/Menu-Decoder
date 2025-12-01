import React, { useRef } from 'react';

interface MenuUploaderProps {
  imagePreview: string | null;
  onImageSelected: (file: File) => void;
  onClear: () => void;
}

const MenuUploader: React.FC<MenuUploaderProps> = ({ imagePreview, onImageSelected, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (imagePreview) {
    return (
      <div className="relative group">
        <img
          src={imagePreview}
          alt="Menu Preview"
          className="w-full max-h-96 object-contain rounded-xl border-2 border-gray-200 shadow-sm bg-gray-50"
        />
        <button
          onClick={onClear}
          className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-600 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Remove image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-3 border-dashed border-orange-200 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all min-h-[300px]"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />
      <div className="bg-orange-100 p-4 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">上傳菜單照片</h3>
      <p className="text-gray-500 mb-4">點擊或拖曳圖片至此 (JPG, PNG)</p>
      <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors shadow-md">
        選擇檔案
      </button>
    </div>
  );
};

export default MenuUploader;