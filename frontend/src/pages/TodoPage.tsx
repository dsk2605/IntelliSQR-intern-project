import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import api from '../api/apiService';
import styles from './TodoPage.module.css';
import { useState } from 'react';
import { CreateTodoModal } from '../components/CreateTodoModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion'; 


interface ITodo {
  _id: string;
  user: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
}


const getTodos = async (): Promise<ITodo[]> => {
  const { data } = await api.get('/todos');
  return data;
};

interface UpdateTodoPayload {
  id: string;
  title?: string;
  description?: string;
  isCompleted?: boolean;
}
const updateTodo = async ({
  id,
  ...payload
}: UpdateTodoPayload): Promise<ITodo> => {
  const { data } = await api.put(`/todos/${id}`, payload);
  return data;
};

const deleteTodo = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/todos/${id}`);
  return data;
};


export const TodoPage = () => {
  const queryClient = useQueryClient();

 
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');


  const [isModalOpen, setIsModalOpen] = useState(false);


  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>(
    'all'
  );


  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery<ITodo[], Error>({
    queryKey: ['todos'],
    queryFn: getTodos,
  });


  const filteredTodos = todos?.filter((todo) => {
    if (filter === 'active') {
      return !todo.isCompleted;
    }
    if (filter === 'completed') {
      return todo.isCompleted;
    }
    return true; 
  });


  const invalidateTodos = () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  };

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      invalidateTodos();
      toast.success('Todo updated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update.');
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      invalidateTodos();
      toast.success('Todo deleted!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete.');
    },
  });


  const onToggleComplete = (todo: ITodo) => {
    updateTodoMutation.mutate({
      id: todo._id,
      isCompleted: !todo.isCompleted,
    });
  };

  const onDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodoMutation.mutate(id);
    }
  };


  const onStartEdit = (todo: ITodo) => {
    setEditingTodoId(todo._id);
    setEditingText(todo.title);
  };

  const onCancelEdit = () => {
    setEditingTodoId(null);
    setEditingText('');
  };

  const onSaveEdit = () => {
    if (!editingTodoId || editingText.trim().length === 0) return;

    updateTodoMutation.mutate(
      {
        id: editingTodoId,
        title: editingText,
      },
      {
        onSuccess: () => {
          invalidateTodos();
          toast.success('Todo updated!');
          setEditingTodoId(null);
          setEditingText('');
        },
      }
    );
  };

  if (isLoading) return <div>Loading todos...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2>Your Todos</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Todo
        </button>
      </div>


      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <button
          className={`btn ${styles.btnSmall} ${
            filter === 'all' ? 'btn-primary' : ''
          }`}
          style={filter !== 'all' ? { background: '#eee', color: '#444' } : {}}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`btn ${styles.btnSmall} ${
            filter === 'active' ? 'btn-primary' : ''
          }`}
          style={filter !== 'active' ? { background: '#eee', color: '#444' } : {}}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`btn ${styles.btnSmall} ${
            filter === 'completed' ? 'btn-primary' : ''
          }`}
          style={
            filter !== 'completed' ? { background: '#eee', color: '#444' } : {}
          }
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <ul className={styles.list}>
        <AnimatePresence>
          {filteredTodos && filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <motion.li
                key={todo._id}
                className={
                  todo.isCompleted ? styles.listItemCompleted : styles.listItem
                }
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                {editingTodoId === todo._id ? (

                  <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="form-input"
                      autoFocus
                    />
                    <button
                      onClick={onSaveEdit}
                      className={`btn ${styles.btnSmall} ${styles.btnSuccess}`}
                      disabled={updateTodoMutation.isPending}
                    >
                      {updateTodoMutation.isPending ? '...' : 'Save'}
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className={`btn ${styles.btnSmall}`}
                      style={{ background: '#6c757d', color: 'white' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (

                  <>
                    <div
                      className={
                        todo.isCompleted
                          ? styles.todoContentCompleted
                          : styles.todoContent
                      }
                    >
                      <div
                        className={
                          todo.isCompleted
                            ? styles.todoTitleCompleted
                            : styles.todoTitle
                        }
                      >
                        {todo.title}
                      </div>
                      <p className={styles.todoDescription}>
                        {todo.description}
                      </p>
                    </div>
                    <div className={styles.todoActions}>
                      <button
                        onClick={() => onStartEdit(todo)}
                        className={`btn ${styles.btnSmall} ${styles.btnWarning}`}
                        disabled={updateTodoMutation.isPending}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onToggleComplete(todo)}
                        disabled={updateTodoMutation.isPending}
                        className={`btn ${styles.btnSmall} ${
                          todo.isCompleted
                            ? styles.btnWarning
                            : styles.btnSuccess
                        }`}
                      >
                        {todo.isCompleted ? 'Undo' : 'Complete'}
                      </button>
                      <button
                        onClick={() => onDelete(todo._id)}
                        disabled={deleteTodoMutation.isPending}
                        className={`btn ${styles.btnSmall} ${styles.btnDanger}`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </motion.li>
            ))
          ) : (
            <motion.li
              className={styles.listItem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >

              {filter === 'all'
                ? 'No todos found. Add one above!'
                : `No ${filter} todos found.`}
            </motion.li>
          )}
        </AnimatePresence>
      </ul>


      <AnimatePresence>
        {isModalOpen && (
          <CreateTodoModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};