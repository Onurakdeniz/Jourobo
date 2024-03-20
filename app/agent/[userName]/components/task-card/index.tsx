import React from 'react';
import TaskInfo from './task-info';
import TaskDescription from './task-description';
import TaskActions from './task-actions';

// Define an interface for the task object
interface Task {
  id: string;
  promptId: string;
  isOneTimeRun: boolean;
  name: string;
  createdAt: string;
  description: string;
  totalViews: number;
  runsCount: number;
  interval: string;
}

// Update the component to use the Task interface for the task prop
const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className="border flex items-center rounded-md h-24 p-4">
      <TaskInfo
        isOneTimeRun={task.isOneTimeRun}
        taskName={task.name}
        taskCreatedAt={task.createdAt}
        state = {task.state}
      />
      <TaskDescription
        taskDescription={task.description}
        taskTotalViews={task.totalViews}
        taskRunsCount={task.runsCount}
        taskInterval={task.interval}
      />
      <TaskActions
        taskId={task.id}
        taskPromptId={task.promptId}
      />
    </div>
  );
};

export default TaskCard;
