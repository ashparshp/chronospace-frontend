import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ClipboardCheck,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { adminService } from "../../services/adminService";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextArea from "../../components/ui/TextArea";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { BLOGGER_REQUEST_STATUS } from "../../config/constants";

const AdminBloggerApplicationsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedApp, setExpandedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === "admin";

  // Fetch applications
  useEffect(() => {
    if (!isAdmin) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminService.getPendingBloggerApplications(
          page,
          10
        );
        setApplications(response.data.requests);
        setTotalPages(response.data.total_pages);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogger applications:", error);
        setError("Failed to load blogger applications");
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAdmin, page]);

  const toggleApplicationExpand = (id) => {
    if (expandedApp === id) {
      setExpandedApp(null);
    } else {
      setExpandedApp(id);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openApproveModal = (application) => {
    setModalData(application);
    setModalType("approve");
    setReviewNote(
      `Your application to become a blogger has been approved! Welcome to the ChronoSpace blogger community.`
    );
    setModalOpen(true);
  };

  const openRejectModal = (application) => {
    setModalData(application);
    setModalType("reject");
    setReviewNote(
      `Thank you for your interest in becoming a blogger on ChronoSpace. After reviewing your application, we've determined that it doesn't meet our current needs. We encourage you to continue engaging with our community and consider applying again in the future with more writing samples.`
    );
    setModalOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!modalData || !modalType) return;

    try {
      setReviewLoading(true);

      const status =
        modalType === "approve"
          ? BLOGGER_REQUEST_STATUS.APPROVED
          : BLOGGER_REQUEST_STATUS.REJECTED;

      await adminService.reviewBloggerApplication(
        modalData._id,
        status,
        reviewNote
      );

      setApplications(applications.filter((app) => app._id !== modalData._id));

      showToast(
        `Application ${
          modalType === "approve" ? "approved" : "rejected"
        } successfully`,
        "success"
      );

      setModalOpen(false);
      setModalData(null);
      setReviewNote("");
    } catch (error) {
      console.error("Error reviewing application:", error);
      showToast("Failed to process application", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "MMM d, yyyy h:mm a");
  };

  if (!isAdmin) {
    return (
      <EmptyState
        title="Access Denied"
        description="You need administrator privileges to access this page."
        actionText="Go to Home"
        actionLink="/"
        icon={
          <svg
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-3h-.01M12 19h.01M6.633 5.038A9.013 9.013 0 0012 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9c0-2.056.7-3.94 1.868-5.437"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div className=" mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blogger Applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and manage user applications to become bloggers
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>

            <Button variant="primary" href="/admin" size="sm">
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card className="p-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-black rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-black rounded-full"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-black rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-black rounded w-3/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 w-24 bg-gray-200 dark:bg-black rounded"></div>
                      <div className="h-8 w-24 bg-gray-200 dark:bg-black rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-6">
              {/* Applications List */}
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="bg-white dark:bg-black rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      {/* Applicant Info */}
                      <div className="flex items-start space-x-4">
                        <Avatar
                          src={application.user.personal_info.profile_img}
                          alt={application.user.personal_info.fullname}
                          size="lg"
                          onClick={() =>
                            navigate(
                              `/profile/${application.user.personal_info.username}`
                            )
                          }
                          className="cursor-pointer"
                        />
                        <div>
                          <h3
                            className="font-bold text-gray-900 dark:text-white text-lg cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                            onClick={() =>
                              navigate(
                                `/profile/${application.user.personal_info.username}`
                              )
                            }
                          >
                            {application.user.personal_info.fullname}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            @{application.user.personal_info.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="h-4 w-4 inline-block mr-1" />
                            Applied {formatDate(application.createdAt)}
                          </p>

                          {/* Stats */}
                          <div className="flex space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>
                              {application.user.account_info.total_posts} posts
                            </span>
                            <span>
                              {application.user.account_info.total_reads} reads
                            </span>
                            <span>
                              {application.user.account_info.total_followers}{" "}
                              followers
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-row sm:flex-col gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openApproveModal(application)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRejectModal(application)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>

                    {/* Toggle Details Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleApplicationExpand(application._id)}
                      className="mt-4 w-full flex items-center justify-center text-gray-600 dark:text-gray-400"
                    >
                      {expandedApp === application._id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          View Details
                        </>
                      )}
                    </Button>

                    {/* Application Details */}
                    {expandedApp === application._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Application Reason:
                        </h4>
                        <div className="bg-gray-50 dark:bg-black p-4 rounded-md mb-4">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {application.reason}
                          </p>
                        </div>

                        {application.writing_samples &&
                          application.writing_samples.length > 0 && (
                            <>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Writing Samples:
                              </h4>
                              <div className="bg-gray-50 dark:bg-black p-4 rounded-md">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {application.writing_samples.join("\n\n")}
                                </p>
                              </div>
                            </>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center px-4 py-1 text-sm text-gray-700 dark:text-gray-300">
                      Page {page} of {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No Pending Applications"
              description="There are no blogger applications waiting for review."
              icon={<ClipboardCheck className="h-12 w-12 text-gray-400" />}
              actionText="Go to Dashboard"
              actionLink="/admin"
            />
          )}
        </Card>
      </motion.div>

      {/* Review Modal (Approve/Reject) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalType === "approve" ? "Approve Application" : "Reject Application"
        }
        size="lg"
      >
        {modalData && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar
                src={modalData.user.personal_info.profile_img}
                alt={modalData.user.personal_info.fullname}
                size="md"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {modalData.user.personal_info.fullname}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{modalData.user.personal_info.username}
                </p>
              </div>
            </div>

            <TextArea
              label={
                modalType === "approve"
                  ? "Approval Notes (Optional)"
                  : "Rejection Reason"
              }
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder={
                modalType === "approve"
                  ? "Add any notes for the applicant (optional)"
                  : "Provide a reason for rejecting this application"
              }
              rows={4}
            />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {modalType === "approve"
                ? "This user will be granted blogger privileges and notified of their approval."
                : "This user will be notified that their application has been rejected."}
            </p>

            <div className="flex justify-end space-x-3 mt-2">
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
                disabled={reviewLoading}
              >
                Cancel
              </Button>
              <Button
                variant={modalType === "approve" ? "primary" : "danger"}
                onClick={handleReviewSubmit}
                disabled={modalType === "reject" && !reviewNote.trim()}
                isLoading={reviewLoading}
              >
                {modalType === "approve"
                  ? "Approve Application"
                  : "Reject Application"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBloggerApplicationsPage;
