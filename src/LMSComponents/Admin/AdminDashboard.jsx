// src/LMSComponents/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database, storage } from '../../firebase/config';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import LMSNavbar from '../LMSNavbar';
import ContentUploadModal from './ContentUploadModal';

const AdminDashboard = ({ user, userData }) => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const isAdmin = true; // The component only renders if user is admin

    useEffect(() => {
        // Only proceed if we have a user
        if (!user) return;

        // Fetch content
        const contentRef = ref(database, 'content');
        const contentUnsub = onValue(contentRef, (snapshot) => {
            if (snapshot.exists()) {
                const contentList = [];
                snapshot.forEach((childSnapshot) => {
                    contentList.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                // Sort by date (newest first)
                contentList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setContent(contentList);
            } else {
                setContent([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching content:", error);
            setLoading(false);
        });

        // Fetch students
        const usersRef = ref(database, 'users');
        const usersUnsub = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const usersList = [];
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().role === 'student') {
                        usersList.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    }
                });
                setStudents(usersList);
            }
        }, (error) => {
            console.error("Error fetching users:", error);
        });

        return () => {
            contentUnsub();
            usersUnsub();
        };
    }, [user]);

    const handleDeleteContent = async (contentItem) => {
        if (window.confirm(`Are you sure you want to delete "${contentItem.title}"?`)) {
            try {
                // Delete file from storage
                const fileRef = storageRef(storage, contentItem.storagePath);
                await deleteObject(fileRef);

                // Delete content entry from database
                const contentRef = ref(database, `content/${contentItem.id}`);
                await remove(contentRef);

                alert('Content deleted successfully!');
            } catch (error) {
                console.error('Error deleting content:', error);
                alert('Error deleting content. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <LMSNavbar user={user} userData={userData} isAdmin={isAdmin} />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <LMSNavbar user={user} userData={userData} isAdmin={isAdmin} />

            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Content
                    </button>
                </div>

                {/* Dashboard Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Content</h2>
                        <p className="text-3xl font-bold text-blue-600">{content.length}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Total Students</h2>
                        <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Last Upload</h2>
                        <p className="text-md text-gray-600">
                            {content.length > 0
                                ? new Date(content[0].createdAt).toLocaleDateString()
                                : 'No content yet'}
                        </p>
                    </div>
                </div>

                {/* Content Management */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="p-6 bg-gray-50 border-b">
                        <h2 className="text-2xl font-semibold text-gray-800">Content Management</h2>
                    </div>

                    {content.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <p>No content available. Add your first content!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {content.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${item.contentType === 'pdf' ? 'bg-red-100 text-red-800' :
                                                    item.contentType === 'video' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                                    {item.contentType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteContent(item)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Student Management */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b">
                        <h2 className="text-2xl font-semibold text-gray-800">Student Management</h2>
                    </div>

                    {students.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <p>No students registered yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(student.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Content Modal */}
            {isModalOpen && (
                <ContentUploadModal
                    onClose={() => setIsModalOpen(false)}
                    user={user}
                />
            )}
        </div>
    );
};

export default AdminDashboard;