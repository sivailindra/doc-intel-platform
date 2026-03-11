// A simple in-memory store to pass the File object between the landing page and the analyze route
// This works because Next.js router.push() executes a client-side transition without a full page reload.
export const sharedFileStore = {
    file: null as File | null,
};
