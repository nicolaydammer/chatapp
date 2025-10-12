import { useState, useMemo, useEffect } from 'react';
import { Link, usePage } from "@inertiajs/react";
import { router } from '@inertiajs/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

interface User {
    display_name: string;
    id: number;
}

export default function AddFriends() {
    const { props } = usePage();
    const [allPeople, setAllPeople] = useState<User[]>(props.userList);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        if (showSuccessMessage) {
            setTimeout(() => setShowSuccessMessage(false), 4000);
        }
    }, [showSuccessMessage]);

    useEffect(() => {
        setAllPeople(props.userList);
    }, [props.userList]);

    const Backward = () => (
        (<FontAwesomeIcon icon={faArrowLeft} size="xl" />)
    );

    const filteredPeople = useMemo(() => {
        return allPeople.filter((person) =>
            person.display_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allPeople, searchTerm]);

    const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
    const currentPeople = filteredPeople.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const addFriend = (id: number) => {
        let data = {
            user_id: id
        }

        router.post('/chat/friendlist', data, {
            onSuccess: () => {
                setShowSuccessMessage(true);
            },
            preserveScroll: true,
            preserveState: true,
            preserveUrl: true,
            replace: false,
        });
    };

    // Reset to page 1 when search changes
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 flex flex-col items-center">

            <Link href="/chat"

                className="absolute top-4 left-4 flex items-center space-x-2 text-gray-300 hover:text-white transition"
            >
                <Backward />
                <span className="font-medium">Back</span>
            </Link>

            <div className="w-full max-w-3xl">
                <h1 className="text-2xl font-semibold mb-4">Add New Friends</h1>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search for a name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {showSuccessMessage && (
                    <div>
                        <div className="mb-4 p-3 bg-green-600 text-white rounded-lg shadow-md animate-fade-in-out">
                            Successfully added new friend!
                        </div>
                    </div>
                )}

                {currentPeople.length > 0 ? (
                    <div className="space-y-2">
                        {currentPeople.map((person) => (
                            <div
                                key={person.id}
                                className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-xl shadow-sm hover:bg-gray-750 transition"
                            >
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={null}
                                        alt={person.display_name}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-700"
                                    />
                                    <span className="font-medium text-gray-100 text-sm">
                                        {person.display_name}
                                    </span>
                                </div>

                                <button
                                    onClick={() => addFriend(person.id)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded-md font-medium transition"
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center mt-6">No results found.</p>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-2 py-1 rounded-md text-sm font-medium ${currentPage === 1
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 hover:bg-gray-700 text-white'
                                }`}
                        >
                            Prev
                        </button>

                        <span className="text-gray-400 text-sm">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-2 py-1 rounded-md text-sm font-medium ${currentPage === totalPages
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 hover:bg-gray-700 text-white'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}