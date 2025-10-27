import { useQuery } from '@tanstack/react-query';
import type { User, Post, Todo } from '../types';

const SimpleAnalytics: React.FC = () => {
    // Fetch all data with React Query
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async (): Promise<User[]> => {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            return response.json();
        },
    });

    const { data: posts, isLoading: postsLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: async (): Promise<Post[]> => {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            return response.json();
        },
    });

    const { data: todos, isLoading: todosLoading } = useQuery({
        queryKey: ['todos'],
        queryFn: async (): Promise<Todo[]> => {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            return response.json();
        },
    });

    if (usersLoading || postsLoading || todosLoading) {
        return <div className="text-center py-4 text-gray-500">Loading analytics...</div>;
    }

    if (!users || !posts || !todos) {
        return <div className="text-center py-4 text-red-500">Failed to load data</div>;
    }

    // Calculate statistics
    const userPostCounts = users.map(user => ({
        user,
        postCount: posts.filter(post => post.userId === user.id).length,
    }));

    const userTodoCounts = users.map(user => ({
        user,
        todoCount: todos.filter(todo => todo.userId === user.id).length,
        completedCount: todos.filter(todo => todo.userId === user.id && todo.completed).length,
    }));

    const userWithMostPosts = userPostCounts.reduce((max, current) =>
        current.postCount > max.postCount ? current : max
    );

    const userWithFewestPosts = userPostCounts.reduce((min, current) =>
        current.postCount < min.postCount ? current : min
    );

    const userWithMostCompletedTodos = userTodoCounts.reduce((max, current) =>
        current.completedCount > max.completedCount ? current : max
    );

    const userWithFewestCompletedTodos = userTodoCounts.reduce((min, current) =>
        current.completedCount < min.completedCount ? current : min
    );

    return (
        <div className="space-y-4">
            {/* Total Users Card */}
            <div className="bg-linear-to-br from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium opacity-90">Total Users</h3>
                <p className="text-3xl font-bold">{users.length}</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Most Posts</h4>
                    <p className="font-semibold text-gray-800 text-sm">{userWithMostPosts.user.username}</p>
                    <p className="text-green-600 text-sm font-medium">{userWithMostPosts.postCount} posts</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fewest Posts</h4>
                    <p className="font-semibold text-gray-800 text-sm">{userWithFewestPosts.user.username}</p>
                    <p className="text-green-600 text-sm font-medium">{userWithFewestPosts.postCount} posts</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Most Completed</h4>
                    <p className="font-semibold text-gray-800 text-sm">{userWithMostCompletedTodos.user.username}</p>
                    <p className="text-green-600 text-sm font-medium">{userWithMostCompletedTodos.completedCount} completed</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fewest Completed</h4>
                    <p className="font-semibold text-gray-800 text-sm">{userWithFewestCompletedTodos.user.username}</p>
                    <p className="text-green-600 text-sm font-medium">{userWithFewestCompletedTodos.completedCount} completed</p>
                </div>
            </div>
        </div>
    );
};

export default SimpleAnalytics;