// src/LMSComponents/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../../firebase/config';
import { ref, onValue, remove } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import ContentUploadModal from './ContentUploadModal';
import DeleteModal from './DeleteModal';

const AdminDashboard = ({ user, userData }) => {
    const [content, setContent] = useState([]);
    const [groupedContent, setGroupedContent] = useState({});
    const [expandedGroups, setExpandedGroups] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        itemToDelete: null,
    });
    const navigate = useNavigate();

    // Base API URL - use environment variable or default to localhost
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Check if user is admin
        if (user && user.email.toLowerCase() === 'inspiringshereen@gmail.com'.toLowerCase()) {
            setIsAdmin(true);
        } else if (user) {
            // If logged in but not admin, redirect to LMS home
            navigate('/lms/home');
        } else {
            // If not logged in, redirect to login
            navigate('/lms/login');
            return;
        }

        // Only fetch data if we have a valid user
        if (user) {
            fetchContent();
            fetchStudents();
        }
    }, [user, navigate]);

    // Function to safely get date from item (with fallback)
    const getItemDate = (item) => {
        // Try different date properties with fallback to epoch 0
        const dateValue = item.created_at || item.createdAt || new Date(0).toISOString();
        return new Date(dateValue);
    };

    // Function to get a date string for display (with fallback)
    const getDisplayDate = (item) => {
        const date = getItemDate(item);

        // Check if date is valid (not epoch 0)
        if (date.getTime() === 0) {
            return 'Unknown Date';
        }

        return date.toLocaleDateString();
    };

    // Function to group content by upload session
    const groupContentBySession = (contentList) => {
        const grouped = {};
        const ungrouped = [];

        // First, identify all content with upload session IDs
        contentList.forEach(item => {
            if (item.uploadSessionId) {
                if (!grouped[item.uploadSessionId]) {
                    grouped[item.uploadSessionId] = {
                        sessionId: item.uploadSessionId,
                        items: [],
                        title: item.title || 'Untitled Content',
                        createdAt: getItemDate(item),
                        contentType: item.contentType || 'Unknown Type',
                        category: item.category || 'Uncategorized'
                    };
                }
                grouped[item.uploadSessionId].items.push(item);
            } else {
                ungrouped.push(item);
            }
        });

        // For content without session IDs, create individual groups by createdAt date
        ungrouped.forEach(item => {
            const dateKey = getItemDate(item).toISOString();
            const itemKey = `item-${item.id}`;
            grouped[itemKey] = {
                sessionId: itemKey,
                items: [item],
                title: item.title || 'Untitled Content',
                createdAt: dateKey,
                contentType: item.contentType || 'Unknown Type',
                category: item.category || 'Uncategorized',
                isSingle: true
            };
        });

        return grouped;
    };

    // Initialize expanded state for a new group
    const initializeExpandedState = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: false // Start collapsed
        }));
    };

    // Function to toggle group expansion
    const toggleGroupExpand = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    // Function to fetch content from Firebase RTDB as a fallback
    const fetchContentFromFirebase = () => {
        const contentRef = ref(database, 'content');
        onValue(contentRef, (snapshot) => {
            if (snapshot.exists()) {
                const contentList = [];
                snapshot.forEach((childSnapshot) => {
                    contentList.push({
                        id: childSnapshot.key,
                        firebaseId: childSnapshot.key, // Store Firebase key separately
                        ...childSnapshot.val()
                    });
                });

                // Sort by date (newest first) with safe fallback
                contentList.sort((a, b) => {
                    const dateA = getItemDate(a);
                    const dateB = getItemDate(b);
                    return dateB - dateA;
                });

                setContent(contentList);

                // Group content and initialize expanded states
                const grouped = groupContentBySession(contentList);
                setGroupedContent(grouped);

                // Initialize expanded states for each group
                Object.keys(grouped).forEach(groupId => {
                    initializeExpandedState(groupId);
                });
            } else {
                setContent([]);
                setGroupedContent({});
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching content from Firebase:", error);
            setLoading(false);
        });
    };

    // Function to fetch content from PostgreSQL
    const fetchContent = async () => {
        try {
            // Try to fetch from API first
            const response = await fetch(`${API_URL}/api/lms/content`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch content from API');
            }

            const contentData = await response.json();
            // Sort by date (newest first) with safe fallback
            contentData.sort((a, b) => {
                const dateA = getItemDate(a);
                const dateB = getItemDate(b);
                return dateB - dateA;
            });

            setContent(contentData);

            // Group content and initialize expanded states
            const grouped = groupContentBySession(contentData);
            setGroupedContent(grouped);

            // Initialize expanded states for each group
            Object.keys(grouped).forEach(groupId => {
                initializeExpandedState(groupId);
            });

            setLoading(false);
        } catch (error) {
            console.error("Error fetching content from API:", error);
            // Fallback to Firebase if API fails
            fetchContentFromFirebase();
        }
    };

    // Function to fetch students
    const fetchStudents = async () => {
        try {
            // Try to fetch from API first
            const response = await fetch(`${API_URL}/api/users?role=student`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const studentsData = await response.json();
            setStudents(studentsData);
        } catch (error) {
            console.error("Error fetching students:", error);
            // You might want to add a fallback for students as well
            // For now, we'll just set an empty array
            setStudents([]);
        }
    };

    const openDeleteModal = (contentItem) => {
        setDeleteModal({
            isOpen: true,
            itemToDelete: contentItem,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            itemToDelete: null,
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.itemToDelete) return;

        const contentItem = deleteModal.itemToDelete;

        try {
            setLoading(true);

            // Step 1: Try to delete from PostgreSQL first
            try {
                const response = await fetch(`${API_URL}/api/lms/content/${contentItem.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${await user.getIdToken()}`,
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    console.warn('PostgreSQL delete failed, trying Firebase');
                }
            } catch (apiError) {
                console.error('Error deleting from API:', apiError);
            }

            // Step 2: Also delete from Firebase RTDB (always do this as a fallback)
            const firebaseId = contentItem.firebase_id || contentItem.id;
            const contentRef = ref(database, `content/${firebaseId}`);
            await remove(contentRef);

            // Step 3: Update local state to remove the deleted item
            setContent(content.filter(item => item.id !== contentItem.id));

            // Update grouped content as well
            const updatedGroupedContent = { ...groupedContent };

            // Find which group contains this item
            Object.keys(updatedGroupedContent).forEach(groupId => {
                const group = updatedGroupedContent[groupId];
                group.items = group.items.filter(item => item.id !== contentItem.id);

                // If group is now empty, remove it
                if (group.items.length === 0) {
                    delete updatedGroupedContent[groupId];
                }
            });

            setGroupedContent(updatedGroupedContent);

            // Close modal and show success message
            closeDeleteModal();

            // Use a non-blocking notification instead of alert
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
            notification.textContent = 'Content deleted successfully!';
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);

        } catch (error) {
            console.error('Error deleting content:', error);

            // Show error notification
            const errorNotification = document.createElement('div');
            errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
            errorNotification.textContent = 'Error deleting content. Please try again.';
            document.body.appendChild(errorNotification);

            setTimeout(() => {
                errorNotification.remove();
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Content Group Component
    const ContentGroupCard = ({ group, isExpanded, onToggle }) => {
        const { items, title, sessionId, createdAt, isSingle } = group;

        // Don't render groups with no items
        if (!items || items.length === 0) return null;

        // For single items, just render them directly without collapsible section
        if (isSingle && items.length === 1) {
            const item = items[0];
            return (
                <tr key={item.id}>
                    <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                            {item.title || 'Untitled Content'}
                        </div>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4">
                        <span className="px-1 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {item.contentType || 'Unknown Type'}
                        </span>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 text-xs sm:text-sm text-gray-500">
                        {getDisplayDate(item)}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 text-xs sm:text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() => openDeleteModal(item)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                            >
                                Delete
                            </button>
                            <Link
                                to={`/lms/admin/edit/${item.id}`}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                                Edit
                            </Link>
                        </div>
                    </td>
                </tr>
            );
        }

        // Get the date string for display with fallback
        let dateString = 'Unknown Date';
        if (createdAt) {
            // Check if createdAt is a date object or a string
            if (createdAt instanceof Date) {
                dateString = createdAt.toLocaleDateString();
            } else {
                try {
                    dateString = new Date(createdAt).toLocaleDateString();
                } catch (e) {
                    dateString = 'Unknown Date';
                }
            }
        }

        // For groups with multiple items, render as collapsible group
        return (
            <>
                <tr className="bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => onToggle(sessionId)}>
                    <td colSpan="4" className="px-2 sm:px-4 md:px-6 py-2 md:py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`mr-2 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="text-xs sm:text-sm md:text-base font-medium text-gray-900 truncate max-w-[180px] sm:max-w-none">
                                    {title || 'Untitled Group'}
                                    <span className="hidden sm:inline text-xs md:text-sm font-normal text-gray-500 ml-1">({items.length} files, {dateString})</span>
                                </div>
                            </div>
                            <div className="text-xs sm:text-sm text-blue-600">
                                {isExpanded ? 'Collapse' : 'Expand'}
                            </div>
                        </div>
                    </td>
                </tr>
                {isExpanded && items.map((item) => (
                    <tr key={item.id} className="bg-gray-50 border-b border-gray-100">
                        <td className="pl-8 sm:pl-12 md:pl-16 pr-2 sm:pr-4 md:pr-6 py-2 md:py-3">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                                {item.title || 'Untitled Content'}
                            </div>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 md:py-3">
                            <span className="px-1 sm:px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {item.contentType || 'Unknown Type'}
                            </span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-xs sm:text-sm text-gray-500">
                            {getDisplayDate(item)}
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-xs sm:text-sm font-medium">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(item);
                                    }}
                                    className="text-red-600 hover:text-red-900 transition-colors"
                                >
                                    Delete
                                </button>
                                <Link
                                    to={`/lms/admin/edit/${item.id}`}
                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Edit
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return <div className="p-4 md:p-8 text-center">Checking permissions...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-4 md:py-8 px-3 sm:px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-600 text-center sm:text-left">Admin's Dashboard</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center w-full sm:w-auto transition-colors duration-200 shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Content
                    </button>
                </div>

                {/* Dashboard Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Total Content</h2>
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">{content.length}</p>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Total Students</h2>
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">{students.length}</p>
                    </div>

                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Last Upload</h2>
                        <p className="text-md text-gray-600">
                            {content.length > 0
                                ? getDisplayDate(content[0])
                                : 'No content yet'}
                        </p>
                    </div>
                </div>

                {/* Content Management */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 md:mb-8">
                    <div className="p-4 md:p-6 bg-gray-50 border-b">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Content Management</h2>
                    </div>

                    {content.length === 0 ? (
                        <div className="p-4 md:p-6 text-center text-gray-500">
                            <p>No content available. Add your first content!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.keys(groupedContent).map(groupId => (
                                        <ContentGroupCard
                                            key={groupId}
                                            group={groupedContent[groupId]}
                                            isExpanded={expandedGroups[groupId]}
                                            onToggle={toggleGroupExpand}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Student Management Section */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 md:p-6 bg-gray-50 border-b">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Student Management</h2>
                    </div>

                    {students.length === 0 ? (
                        <div className="p-4 md:p-6 text-center text-gray-500">
                            <p>No students enrolled yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                        <th className="px-2 sm:px-4 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.id || student.uid}>
                                            <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4">
                                                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                                                    {student.displayName || student.name || 'No Name'}
                                                </div>
                                            </td>
                                            <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4">
                                                <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">{student.email}</div>
                                            </td>
                                            <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 text-xs sm:text-sm text-gray-500">
                                                {student.created_at
                                                    ? new Date(student.created_at).toLocaleDateString()
                                                    : student.createdAt
                                                        ? new Date(student.createdAt).toLocaleDateString()
                                                        : 'Unknown'}
                                            </td>
                                            <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 text-xs sm:text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/lms/admin/student/${student.id || student.uid}`)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Upload Modal */}
            {isModalOpen && (
                <ContentUploadModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onContentAdded={fetchContent}
                    user={user}
                    API_URL={API_URL}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDelete}
                    title="Delete Content"
                    message={`Are you sure you want to delete "${deleteModal.itemToDelete?.title || 'this content'}"? This action cannot be undone.`}
                />
            )}
        </div>
    );
};

export default AdminDashboard;