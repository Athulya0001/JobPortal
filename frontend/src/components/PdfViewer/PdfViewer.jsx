import { FiDownload } from 'react-icons/fi';

const PDFViewer = ({ fileUrl }) => {
  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-4 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Resume Preview</h2>
        <div className="space-x-3">
          <a
            href={fileUrl}
            target='_blank'
            download
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            <FiDownload className="mr-2" />
            Download
          </a>
        </div>
      </div>

      <div className="w-full h-[600px] border rounded overflow-hidden">
      <iframe
        src={`${fileUrl}#toolbar=0`}
        title="PDF Preview"
        width="100%"
        height="600px"
        className="w-full h-full"
      />
      </div>
    </div>
  );
};

export default PDFViewer;
