// This file will serve as a centralized mock database.

export const mockBooksData = [
    {
        id: 1,
        title: 'Whispers of the Ancient Forest',
        author: 'Elara Vance',
        rating: 4.5,
        reviewsCount: 128,
        genres: ['Fantasy', 'Adventure', 'Magic'],
        price: 'Rp 250.000',
        shortDescription: 'A young sorceress discovers a hidden power that could either save her kingdom or plunge it into eternal darkness. A thrilling journey through enchanted woods and forgotten realms.',
        imageUrl: 'https://via.placeholder.com/400x550.png/1a2a3a/ffffff?text=Whispers',
        details: {
            publisher: 'Mythical Press',
            publishDate: 'October 26, 2023',
            language: 'English',
            pages: 480,
            isbn: '978-1-2345-6789-0',
            longDescription: 'In the mystical land of Aerthos, where magic flows through the very soil, a young apprentice named Lyra stumbles upon an ancient secret. This detailed account follows her quest, filled with perilous trials, unexpected allies, and powerful foes. It\'s a story about courage, sacrifice, and the enduring power of hope.'
        },
        reviews: [
            { author: 'John Doe', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=John', content: 'An absolutely captivating read!' },
            { author: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Jane', content: 'A bit slow to start, but the ending was worth it.' },
        ]
    },
    {
        id: 2,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        rating: 4.2,
        reviewsCount: 256,
        genres: ['Classic', 'Fiction'],
        price: 'Rp 180.000',
        shortDescription: 'The story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan, of lavish parties on Long Island.',
        imageUrl: 'https://via.placeholder.com/400x550.png/1a2a3a/ffffff?text=Gatsby',
        details: {
            publisher: 'Scribner',
            publishDate: 'April 10, 1925',
            language: 'English',
            pages: 180,
            isbn: '978-0-7432-7356-5',
            longDescription: 'The Great Gatsby, F. Scott Fitzgerald\'s third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when gin was the national drink and sex the national obsession, it is an exquisitely crafted tale of America in the 1920s.'
        },
        reviews: []
    },
    {
        id: 3,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        rating: 4.8,
        reviewsCount: 512,
        genres: ['Classic', 'Drama'],
        price: 'Rp 210.000',
        shortDescription: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
        imageUrl: 'https://via.placeholder.com/400x550.png/1a2a3a/ffffff?text=Mockingbird',
        details: {
            publisher: 'J. B. Lippincott & Co.',
            publishDate: 'July 11, 1960',
            language: 'English',
            pages: 324,
            isbn: '978-0-06-112008-4',
            longDescription: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960. It went on to win the Pulitzer Prize in 1961 and was later made into an Academy Award-winning film, also a classic.'
        },
        reviews: [
            { author: 'John Doe', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=John', content: 'An incredible journey into the heart of madness. A must-read for fans of classic literature.' },
            { author: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Jane', content: 'A truly captivating story. The characters are well-developed, and the plot is masterfully woven.' }
        ]
    },
];

export const borrowedBooksData = [
    {
        id: 1,
        bookId: 2, // The Great Gatsby
        borrowDate: '2024-05-15',
        dueDate: '2024-06-15',
        status: 'Borrowed',
    },
    {
        id: 2,
        bookId: 3, // To Kill a Mockingbird
        borrowDate: '2024-04-30',
        dueDate: '2024-05-30',
        status: 'Overdue',
    },
    {
        id: 3,
        bookId: 1, // Whispers of the Ancient Forest
        borrowDate: '2024-06-25',
        dueDate: '2024-07-25',
        status: 'Scheduled',
    },
]; 