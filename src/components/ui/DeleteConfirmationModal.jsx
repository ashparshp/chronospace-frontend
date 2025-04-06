import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

const DeleteConfirmationModal = ({
  isOpen,
  message = "Are you sure you want to delete this comment?",
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">{message}</p>
            <div className="flex justify-end space-x-4">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onConfirm}>
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;