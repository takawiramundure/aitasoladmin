import MediaLibrary from "./MediaLibrary";
import { Modal } from "../ui/modal";

interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export default function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
    const handleSelect = (url: string) => {
        onSelect(url);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true} className="max-w-5xl h-[80vh]">
            <MediaLibrary onSelect={handleSelect} onClose={onClose} />
        </Modal>
    );
}
