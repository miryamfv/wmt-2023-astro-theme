import { z, defineCollection } from 'astro:content';

// 2. Define a `type` and `schema` for each collection
const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        //tags: z.array(z.string()),
        url: z.string().url(),
    }),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
    'project': projectsCollection,
};