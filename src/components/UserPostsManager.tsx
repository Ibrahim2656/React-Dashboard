import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { User, Post, Todo } from '../types';

const UserPostsManager: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [completedTodos, setCompletedTodos] = useState<Set<number>>(new Set());

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      return response.json();
    },
  });

  // Fetch posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', selectedUserId],
    queryFn: async (): Promise<Post[]> => {
      if (!selectedUserId) return [];
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`
      );
      return response.json();
    },
    enabled: !!selectedUserId,
  });

  // Fetch todos
  const { data: todos, isLoading: todosLoading } = useQuery({
    queryKey: ['todos', selectedUserId],
    queryFn: async (): Promise<Todo[]> => {
      if (!selectedUserId) return [];
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos?userId=${selectedUserId}`
      );
      return response.json();
    },
    enabled: !!selectedUserId,
  });

  const toggleTodo = (todoId: number) => {
    setCompletedTodos(prev => {
      const newSet = new Set(prev);
      newSet.has(todoId) ? newSet.delete(todoId) : newSet.add(todoId);
      return newSet;
    });
  };

  const selectedUser = users?.find(user => user.id === selectedUserId);

  if (usersLoading) {
    return <div className="text-center py-4 text-gray-500">Loading users...</div>;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* User List */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Select a User:</h3>
        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
          {users?.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`p-3 text-left rounded-lg border transition-colors w-full ${
                selectedUserId === user.id
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-gray-600 truncate">{user.email}</div>
            </button>
          ))}
        </div>
      </div>

      {/* User Details */}
      {selectedUser && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            User: {selectedUser.name}
          </h3>

          {/* Posts */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-600 mb-2">
              Posts ({posts?.length || 0})
            </h4>
            {postsLoading ? (
              <div className="text-gray-500">Loading posts...</div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {posts?.map(post => (
                  <div
                    key={post.id}
                    className="p-3 bg-gray-50 rounded-lg border w-full wrap-break-words"
                  >
                    <div className="font-medium text-sm">{post.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{post.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Todos */}
          <div>
            <h4 className="font-medium text-gray-600 mb-2">
              To-dos ({todos?.length || 0})
            </h4>
            {todosLoading ? (
              <div className="text-gray-500">Loading todos...</div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {todos?.map(todo => (
                  <div
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors w-full wrap-break-word ${
                      completedTodos.has(todo.id)
                        ? 'bg-green-50 border-green-500 text-green-700 line-through'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-sm truncate">{todo.title}</div>
                    <div className="text-xs mt-1">
                      Status:{' '}
                      {completedTodos.has(todo.id) ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPostsManager;
