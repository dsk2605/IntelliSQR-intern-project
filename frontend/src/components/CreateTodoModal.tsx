import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/apiService';
import { todoSchema, type TTodoSchema } from '../lib/schemas';
import styles from './CreateTodoModal.module.css'; 
import toast from 'react-hot-toast';


interface CreateTodoModalProps {
  onClose: () => void; 
}

interface ITodo {
  _id: string;
  user: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
}


const createTodo = async (newTodo: TTodoSchema): Promise<ITodo> => {
  const { data } = await api.post('/todos', newTodo);
  return data;
};

export const CreateTodoModal = ({ onClose }: CreateTodoModalProps) => {
  const queryClient = useQueryClient();


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TTodoSchema>({
    resolver: zodResolver(todoSchema),
  });


const createTodoMutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    onClose();
    toast.success('Todo added successfully!');
  },
  onError: (error: any) => { 
    const message =
      error.response?.data?.message || 'Failed to create todo.';
    toast.error(message);
  },
});


  const onSubmit = (data: TTodoSchema) => {
    createTodoMutation.mutate(data);
  };


  return (

    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Add New Todo</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="form-input"
              autoFocus
            />
            {errors.title && (
              <p className="form-error">{errors.title.message}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description (Optional)
            </label>
            <input
              id="description"
              type="text"
              {...register('description')}
              className="form-input"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className="btn"
              style={{ background: '#6c757d', color: 'white' }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Adding...' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};