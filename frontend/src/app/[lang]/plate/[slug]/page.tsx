"use client";

import Loader from "@/app/[lang]/components/Loader";
import useStrapi from "@/hooks/useStrapi";
import { ApiPlatePlate } from "@/types/generated/contentTypes";
import {addComment, addPlate, fetchComment, fetchPlate} from "@/utils";
import { usePathname } from 'next/navigation'
import { ChangeEvent, useEffect, useState} from "react";
import PageHeader from "@/app/[lang]/components/PageHeader";
import { Dropdown } from "flowbite-react";
import { formatDate } from "@/app/[lang]/utils/api-helpers";

type ApiPlatePlateProps = ApiPlatePlate & {
    id: number
}

type Comment = {
    "id": number;
    "content": string;
    "blocked"?: boolean;
    "blockedThread"?: boolean;
    "blockReason"?: null;
    "authorUser"?: string;
    "removed"?: null;
    "approvalStatus": string;
    "author": {
        "id": string;
        "name": string;
        "email": string;
        "avatar"?: string;
    },
    "createdAt": string;
    "updatedAt": string;
    "related": {};
    "reports": [];
}

const Plate = () => {
    const [newComment, setNewComment] = useState<string>('');
    const [allComments, setAllComments] = useState<Comment[]>([]);
    const pathname = usePathname();
    const slug = pathname.split('/').pop() ?? '';
    const title = slug.replace('-', ' ').toUpperCase();
    const { isLoading, data: currentPlate } = useStrapi<ApiPlatePlateProps>({
        fetcher: fetchPlate,
        filters: { slug },
    });

    useEffect(() => {
        if (!isLoading && !currentPlate?.length) {
            const getData = async () => {
                await addPlate(slug);
            }

            getData().then()
        }
    }, [isLoading, currentPlate])

    useEffect(() => {
        if (!isLoading && currentPlate.length) {
            const getData = async () => {
                const res = await fetchComment(currentPlate[0].id);
                res?.data?.length && setAllComments(res.data);
            }
            getData().then()
        }
    }, [isLoading, currentPlate]);

    const onNewComment = (event: ChangeEvent<HTMLTextAreaElement>) => setNewComment(event.target.value);

    const onSendComment = async () => {
        await addComment(currentPlate[0].id, newComment);
    }

    if (isLoading) return <Loader />;

    return (
        <div className="min-h-screen flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-full">

                <PageHeader heading={title} />

                <div className="mb-6">
                    <div
                        className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea
                            id="comment"
                            rows={6}
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800 resize-none"
                            placeholder="Write a comment..."
                            required
                            onChange={onNewComment}
                        >
                        </textarea>
                    </div>
                    <button
                        onClick={onSendComment}
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    >
                        Send comment
                    </button>
                </div>

                {allComments?.map((comment) => {
                        const { content, author, updatedAt } = comment;
                        return (
                            <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                                <footer className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                            <img
                                                className="mr-2 w-6 h-6 rounded-full"
                                                src="https://flowbite.com/docs/images/people/profile-picture-4.jpg"
                                                alt="Michael Gough"
                                            />

                                            {author?.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <time dateTime="2022-02-08"
                                                  title="February 8th, 2022">{formatDate(updatedAt)}
                                            </time>
                                        </p>
                                    </div>
                                    <Dropdown
                                        label={
                                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                 fill="currentColor" viewBox="0 0 16 3">
                                                <path
                                                    d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                                            </svg>
                                        }
                                        arrowIcon={false}
                                        color="currentColor"
                                    >
                                        <Dropdown.Item>
                                            Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            Remove
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            Report
                                        </Dropdown.Item>
                                    </Dropdown>
                                </footer>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {content}
                                </p>
                                <div className="flex items-center mt-4 space-x-4">
                                    <button type="button"
                                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                                        <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                                        </svg>
                                        Reply
                                    </button>
                                </div>
                            </article>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Plate;
