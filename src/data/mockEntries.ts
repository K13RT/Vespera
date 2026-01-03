import { MoodLevel, JournalEntry } from '../types';

// Helper to generate dates relative to today
const getPastDate = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

// Initial Mock Data for History - 15 Entries
export const INITIAL_ENTRIES: JournalEntry[] = [
    {
        id: '1',
        date: getPastDate(0),
        title: "Midnight Inspiration",
        highlight: "Suddenly understood how to fix the layout bug.",
        content: "I was about to go to sleep when the solution hit me. I had to get up and write it down. The night is so quiet and peaceful for coding.",
        mood: MoodLevel.Excellent,
        energyLevel: 85,
        weather: "Clear",
        tags: ["coding", "late-night", "epiphany"],
        impressivePlace: "Home Office",
        images: []
    },
    {
        id: '2',
        date: getPastDate(1),
        title: "Heavy Rain & Jazz",
        highlight: "Found a new jazz playlist that is perfect for reading.",
        content: "It rained all evening. I stayed inside, made tea, and read for three hours straight. It felt like time stopped.",
        mood: MoodLevel.Good,
        energyLevel: 60,
        weather: "Rainy",
        tags: ["reading", "chill", "jazz"],
        song: { title: "Blue in Green - Miles Davis" },
        images: []
    },
    {
        id: '3',
        date: getPastDate(3),
        title: "A Tough Meeting",
        highlight: "Managed to stay calm despite the criticism.",
        content: "Work was stressful today. The project review didn't go as planned, but I learned a lot about what needs to be improved. Need to rest now.",
        mood: MoodLevel.Bad,
        energyLevel: 30,
        weather: "Cloudy",
        tags: ["work", "reflection", "stress"],
        images: []
    },
    {
        id: '4',
        date: getPastDate(4),
        title: "Sunday Brunch",
        highlight: "The pancakes were fluffy perfection.",
        content: "Met with Sarah for brunch. We talked about everything and nothing. It's nice to disconnect from screens for a while.",
        mood: MoodLevel.Excellent,
        energyLevel: 90,
        weather: "Sunny",
        impressivePlace: "The Morning Owl Cafe",
        tags: ["friends", "food", "weekend"],
        images: []
    },
    {
        id: '5',
        date: getPastDate(5),
        title: "Just an Okay Day",
        highlight: "Cleared my email inbox.",
        content: "Nothing special happened today. Just a routine day. Sometimes routine is good, it keeps the chaos away.",
        mood: MoodLevel.Neutral,
        energyLevel: 50,
        weather: "Cloudy",
        tags: ["routine", "chore"],
        images: []
    },
    {
        id: '6',
        date: getPastDate(7),
        title: "Learning React 19",
        highlight: "The new hooks are interesting!",
        content: "Spent the whole afternoon diving into the documentation. The compiler improvements look promising. I'm excited to try them in Vespera.",
        mood: MoodLevel.Good,
        energyLevel: 75,
        weather: "Windy",
        tags: ["coding", "learning", "tech"],
        images: []
    },
    {
        id: '7',
        date: getPastDate(8),
        title: "Exhausted",
        highlight: "Finally finished the report.",
        content: "I pushed myself too hard today. My eyes are burning. Note to self: take more breaks tomorrow.",
        mood: MoodLevel.Terrible,
        energyLevel: 10,
        weather: "Stormy",
        tags: ["burnout", "work"],
        images: []
    },
    {
        id: '8',
        date: getPastDate(10),
        title: "Park Walk",
        highlight: "Saw a double rainbow.",
        content: "Took a long walk in the park before sunset. The air was fresh after the rain. Nature really heals.",
        mood: MoodLevel.Good,
        energyLevel: 65,
        weather: "Clear",
        impressivePlace: "City Park",
        tags: ["nature", "walk", "health"],
        images: []
    },
    {
        id: '9',
        date: getPastDate(12),
        title: "Movie Night",
        highlight: "Rewatched Interstellar.",
        content: "That soundtrack never gets old. It makes me feel so small yet so connected to the universe.",
        mood: MoodLevel.Excellent,
        energyLevel: 70,
        weather: "Clear",
        song: { title: "Cornfield Chase - Hans Zimmer" },
        tags: ["movie", "sci-fi", "inspiration"],
        images: []
    },
    {
        id: '10',
        date: getPastDate(14),
        title: "Grocery Run",
        highlight: "Found fresh strawberries.",
        content: "Did the weekly shopping. Prices are going up, which is annoying. But I'm going to make a smoothie tomorrow.",
        mood: MoodLevel.Neutral,
        energyLevel: 45,
        weather: "Cloudy",
        tags: ["chores", "food"],
        images: []
    },
    {
        id: '11',
        date: getPastDate(15),
        title: "Design System Update",
        highlight: "Standardized the color palette.",
        content: "Refining the UI tokens. It's tedious work but it pays off in the long run. The purple shades look much better now.",
        mood: MoodLevel.Good,
        energyLevel: 80,
        weather: "Sunny",
        tags: ["design", "ui/ux", "work"],
        images: []
    },
    {
        id: '12',
        date: getPastDate(18),
        title: "Feeling Melancholy",
        highlight: "Wrote a poem.",
        content: "Sometimes sadness isn't bad, it's just a quiet place to be. I missed my old home today.",
        mood: MoodLevel.Bad,
        energyLevel: 35,
        weather: "Rainy",
        tags: ["personal", "poetry", "emotions"],
        images: []
    },
    {
        id: '13',
        date: getPastDate(20),
        title: "Gym Session",
        highlight: "Personal best on deadlift.",
        content: "Felt strong today. Physical activity clears my mind better than anything else.",
        mood: MoodLevel.Excellent,
        energyLevel: 95,
        weather: "Clear",
        impressivePlace: "Iron Gym",
        tags: ["fitness", "gym", "health"],
        images: []
    },
    {
        id: '14',
        date: getPastDate(22),
        title: "Pizza Night",
        highlight: "Extra cheese makes everything better.",
        content: "Too tired to cook. Ordered pizza and watched a sitcom. Simple pleasures.",
        mood: MoodLevel.Good,
        energyLevel: 40,
        weather: "Cloudy",
        tags: ["food", "relax"],
        images: []
    },
    {
        id: '15',
        date: getPastDate(25),
        title: "Planning the Month",
        highlight: "Set clear goals.",
        content: "Sat down with my planner. I want to focus more on mindfulness this coming month.",
        mood: MoodLevel.Neutral,
        energyLevel: 60,
        weather: "Clear",
        tags: ["planning", "goals"],
        images: []
    }
];
