export interface Note {
    id: string;
    title: string;
    updatedAt: string;
    preview?: string;
    digitalText?: string;
    aiInsights?: string;
}

export interface Folder {
    id: string;
    name: string;
    notes: Note[];
    subfolders?: Folder[];
}

export const mockFolders: Folder[] = [
    {
        id: "f1",
        name: "Mathematics",
        notes: [
            { id: "n1", title: "Calculus III Notes", updatedAt: "2h ago", preview: "Integration limits..." }
        ],
        subfolders: [
            {
                id: "f1-sub1",
                name: "Linear Algebra",
                notes: [
                    { id: "n2", title: "Exam Prep", updatedAt: "Yesterday" },
                    { id: "n2b", title: "Vector Spaces", updatedAt: "Oct 12" }
                ],
                subfolders: [
                    {
                        id: "f1-sub1-sub1",
                        name: "Past Papers",
                        notes: [
                            { id: "n-past1", title: "2023 Midterm", updatedAt: "Oct 1" },
                            { id: "n-past2", title: "2022 Final", updatedAt: "Sept 10" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "f2",
        name: "Personal",
        notes: [
            { id: "n3", title: "Journal Entry", updatedAt: "Oct 12", preview: "Today was a good day." },
            { id: "n4", title: "Travel Plans", updatedAt: "Oct 10" }
        ]
    },
    {
        id: "f3",
        name: "Work Projects",
        notes: [
            { id: "n5", title: "Q3 Planning", updatedAt: "Oct 5", preview: "Roadmap items include..." },
            { id: "n6", title: "Meeting Minutes", updatedAt: "Oct 1" }
        ]
    }
];
