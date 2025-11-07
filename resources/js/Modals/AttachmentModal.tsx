import { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function AttachmentModal(
    {
        activeTab,
        isModalOpen,
        setIsModalOpen,
        sendMessage
    }: {
        activeTab,
        isModalOpen: boolean,
        setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
        sendMessage: (files?: File[]) => void
    }) {
    const [files, setFiles] = useState([]);
    const [webcamPicture, setWebcamPicture] = useState<File>();
    const webcamRef = useRef(null);

    const handleCameraCapture = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) return;

        setWebcamPicture(imageSrc);
    };

    const savePicture = () => {
        if (!webcamPicture) return;

        fetch(webcamPicture)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], "camera_capture.png", { type: blob.type });

                sendMessage([file]);
            });

        setWebcamPicture(undefined);
    }

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    return (
        <div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow-2xl w-full max-w-md mx-2">
                        {activeTab !== 'camera' ? (
                            <>
                                <input
                                    type="file"
                                    multiple
                                    accept={
                                        activeTab === 'document'
                                            ? '.pdf,.doc,.docx'
                                            : activeTab === 'image'
                                                ? 'image/*'
                                                : 'video/*'
                                    }
                                    onChange={handleFileChange}
                                    className="block w-full mb-2"
                                />
                                {files.length > 0 && (
                                    <ul className="mb-2 max-h-32 overflow-y-auto border p-2 rounded">
                                        {files.map((file, idx) => (
                                            <li key={idx} className="text-sm truncate">{file.name}</li>
                                        ))}
                                    </ul>
                                )}
                                <button
                                    onClick={() => { sendMessage(files); setIsModalOpen(false); setFiles([]) }}
                                    disabled={files.length === 0}
                                    className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                                >
                                    Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full bg-red-800 p-2 rounded mt-3"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/png"
                                    className="rounded-lg mb-2 w-full"
                                />
                                {webcamPicture && (
                                    <div className="mb-2">
                                        <p className="text-sm mb-1">Preview:</p>
                                        <img src={webcamPicture} alt="Preview" className="rounded w-full" />
                                    </div>
                                )}
                                <button
                                    onClick={handleCameraCapture}
                                    className="w-full bg-yellow-400 text-black p-2 rounded"
                                >
                                    Capture Photo
                                </button>
                                {webcamPicture && (
                                    <button
                                        onClick={() => { savePicture(); setIsModalOpen(false); }}
                                        className="w-full bg-green-700 p-2 rounded mt-3 text-black"
                                    >
                                        Send
                                    </button>
                                )}
                                <button
                                    onClick={() => { setIsModalOpen(false); setWebcamPicture(undefined) }}
                                    className="w-full bg-red-600 p-2 rounded mt-3 text-white"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}