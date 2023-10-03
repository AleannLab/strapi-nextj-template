import { fetchAPI } from "@/app/[lang]/utils/fetch-api";

export const fetchPlate = (data: any): Promise<any>  => {

    return fetchAPI(`/plates`, {
        ...data,
        populate: {
            comments: { populate: "*" },
            author: {
                populate: "*",
            },
        },
    })
}

export const addPlate = (slug: string): Promise<any>  => {
    return fetchAPI(`/plates`,
        {},
        {
            method: "POST",
            body: JSON.stringify({
                data: {
                    idPlate: slug.replace("-", " ").toUpperCase(),
                    slug,
                }
            }),
        })
}

export const addComment = (id: number, comment: string): Promise<any>  => {
    return fetchAPI(`/comments/api::plate.plate:${id}`,
        {},
    {
        method: "POST",
        body: JSON.stringify({
            author: {
                id: 1,
                name: "Megan",
                email: "meagan@email.com",
                avatar: ""
            },
            content: comment,
        }),
    })
}
export const fetchComment = (id: number): Promise<any>  => {
    return fetchAPI(`/comments/api::plate.plate:${id}/flat`)
}