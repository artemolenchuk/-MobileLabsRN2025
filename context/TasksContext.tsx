import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState
} from 'react';
import { initialTasks } from '../data/tasks';
import { Task, TaskType } from '../types/index';
  
  type TasksContextProps = {
	tasks: Task[];
	updateTaskProgress: (type: TaskType, value?: number) => void;
	updateTotalScore: (score: number) => void;
  };
  
  const TasksContext = createContext<TasksContextProps | undefined>(undefined);
  
  export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
  }) => {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
	// Рядок з console.log був тут, тепер його немає :)
  
	const updateTaskProgress = useCallback(
	  (type: TaskType, value: number = 1) => {
		setTasks(currentTasks =>
		  currentTasks.map(task => {
			if (task.type === type && !task.isCompleted) {
			  const newValue = task.currentValue + value;
			  const isCompleted = newValue >= task.targetValue;
			  return {
				...task,
				currentValue: Math.min(newValue, task.targetValue),
				isCompleted: isCompleted,
			  };
			}
			return task;
		  }),
		);
	  },
	  [],
	);
  
	const updateTotalScore = useCallback((score: number) => {
	  setTasks(currentTasks =>
		currentTasks.map(task => {
		  if (task.type === TaskType.SCORE && !task.isCompleted) {
			const isCompleted = score >= task.targetValue;
			return {
			  ...task,
			  currentValue: Math.min(score, task.targetValue),
			  isCompleted: isCompleted,
			};
		  }
		  return task;
		}),
	  );
	}, []);
  
	const contextValue = useMemo(
	  () => ({
		tasks,
		updateTaskProgress,
		updateTotalScore,
	  }),
	  [tasks, updateTaskProgress, updateTotalScore],
	);
  
	return (
	  <TasksContext.Provider value={contextValue}>
		{children}
	  </TasksContext.Provider>
	);
  };
  
  export const useTasks = (): TasksContextProps => {
	const context = useContext(TasksContext);
	if (!context) {
	  throw new Error('useTasks must be used within a TasksProvider');
	}
	return context;
  };