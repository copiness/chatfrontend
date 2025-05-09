import React from "react";

const FileUploader = ({ onFileRead }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      onFileRead(reader.result);
    };

    if (file && file.type.startsWith("text")) {
      reader.readAsText(file);
    } else {
      alert("Only text-based files are supported (TXT, PDF as text, etc.)");
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
      />
    </div>
  );
};

export default FileUploader;
